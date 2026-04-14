import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Channel, Chat, MessageInput, MessageList, Window } from 'stream-chat-react';
import type { Channel as StreamChannel, StreamChat } from 'stream-chat';
import { StreamChat as StreamChatClient } from 'stream-chat';
import type { BuyerOrder, SellerOrder } from '@shared/types';
import { useIsMobile } from '../hooks/useIsMobile';
import EmptyState from '../components/EmptyState';
import MobileMessagesPage from './MobileMessagePage';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useBuyerOrders } from '../hooks/useBuyerOrders';
import { useSellerOrders } from '../hooks/useSellerOrders';
import { createOrderChannel, fetchChatConfig, fetchChatToken } from '../services/chatService';
import './MessagesPage.css';
import 'stream-chat-react/dist/css/v2/index.css';

export interface Conversation {
    id: string; // maps to order id string
    orderId: number;
    participantId: string;
    participantName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    orderLabel: string;
}

export interface MessagesPageProps {
    conversations: Conversation[];
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    selectedConversation: Conversation | null;
    threadContent: ReactNode;
    isThreadLoading: boolean;
    threadError: string | null;
}

const STREAM_API_KEY_FALLBACK = import.meta.env.VITE_STREAM_API_KEY as string | undefined;

const buildBuyerConversation = (order: BuyerOrder): Conversation => {
    const counterpartName = order.listing.user
        ? `${order.listing.user.first_name} ${order.listing.user.last_name}`
        : 'Seller';
    const participantId = order.listing.user?.id?.toString() ?? `seller-${order.id}`;

    return {
        id: String(order.id),
        orderId: order.id,
        participantId,
        participantName: counterpartName,
        lastMessage: `Order #${order.id}: ${order.listing.title}`,
        lastMessageAt: order.created_at,
        unreadCount: 0,
        orderLabel: `Order #${order.id} · ${order.listing.title}`,
    };
};

const buildSellerConversation = (order: SellerOrder): Conversation => ({
    id: String(order.id),
    orderId: order.id,
    participantId: String(order.user.id),
    participantName: `${order.user.first_name} ${order.user.last_name}`,
    lastMessage: `Order #${order.id}: ${order.listing.title}`,
    lastMessageAt: order.created_at,
    unreadCount: 0,
    orderLabel: `Order #${order.id} · ${order.listing.title}`,
});

export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
}

const MessagesPage = () => {
    const isMobile = useIsMobile();
    const { accessToken } = useAuth();
    const { profile, isLoading: profileLoading, error: profileError } = useProfile();
    const userId = profile?.id ?? null;
    const { orders: buyerOrders, isLoading: buyerLoading, error: buyerError } = useBuyerOrders(userId);
    const { orders: sellerOrders, isLoading: sellerLoading, error: sellerError } = useSellerOrders(userId);
    const [streamClient, setStreamClient] = useState<StreamChat | null>(null);
    const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(null);
    const [chatError, setChatError] = useState<string | null>(null);
    const [isThreadLoading, setIsThreadLoading] = useState(false);
    const [streamApiKey, setStreamApiKey] = useState<string | null>(null);
    const createdChannelMapRef = useRef<Record<number, string>>({});

    const conversations = useMemo(() => {
        const sellerList = [
            ...sellerOrders.pending_orders,
            ...sellerOrders.confirmed_orders,
            ...sellerOrders.cancelled_orders,
        ];

        return [...buyerOrders.map(buildBuyerConversation), ...sellerList.map(buildSellerConversation)]
            .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    }, [buyerOrders, sellerOrders]);

    const [selectedId, setSelectedId] = useState<string | null>(
        !isMobile && conversations.length > 0 ? conversations[0].id : null
    );

    useEffect(() => {
        if (isMobile) {
            return;
        }
        if (!selectedId && conversations.length > 0) {
            setSelectedId(conversations[0].id);
            return;
        }
        if (selectedId && !conversations.some((conversation) => conversation.id === selectedId)) {
            setSelectedId(conversations[0]?.id ?? null);
        }
    }, [conversations, isMobile, selectedId]);

    useEffect(() => {
        if (!accessToken || !profile) {
            return;
        }

        let isMounted = true;

        const initClient = async () => {
            try {
                setChatError(null);
                const [{ token }, config] = await Promise.all([
                    fetchChatToken(accessToken),
                    fetchChatConfig(),
                ]);

                const resolvedApiKey = config.apiKey || STREAM_API_KEY_FALLBACK;
                if (!resolvedApiKey) {
                    throw new Error('Stream API key is not configured in backend chat config.');
                }

                const client = StreamChatClient.getInstance(resolvedApiKey);
                const expectedUserId = String(profile.id);
                if (client.userID && client.userID !== expectedUserId) {
                    await client.disconnectUser();
                }
                if (client.userID !== expectedUserId) {
                    await client.connectUser({ id: expectedUserId, name: profile.name }, token);
                }
                if (isMounted) {
                    setStreamApiKey(resolvedApiKey);
                    setStreamClient(client);
                }
            } catch (error) {
                if (isMounted) {
                    setChatError(error instanceof Error ? error.message : 'Failed to initialize chat client.');
                }
            }
        };

        void initClient();

        return () => {
            isMounted = false;
        };
    }, [accessToken, profile]);

    useEffect(() => {
        if (!selectedId || !streamClient || !accessToken || !userId || !streamApiKey) {
            setActiveChannel(null);
            return;
        }

        const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);
        if (!selectedConversation) {
            setActiveChannel(null);
            return;
        }

        let isMounted = true;

        const loadChannel = async () => {
            try {
                setIsThreadLoading(true);
                setChatError(null);

                const existingChannelId = createdChannelMapRef.current[selectedConversation.orderId];
                const channelId = existingChannelId
                    ? existingChannelId
                    : (await createOrderChannel(accessToken, selectedConversation.orderId)).channelId;

                createdChannelMapRef.current[selectedConversation.orderId] = channelId;
                const channel = streamClient.channel('messaging', channelId);
                await channel.watch();

                if (isMounted) {
                    setActiveChannel(channel);
                }
            } catch (error) {
                if (isMounted) {
                    setActiveChannel(null);
                    setChatError(error instanceof Error ? error.message : 'Failed to load channel.');
                }
            } finally {
                if (isMounted) {
                    setIsThreadLoading(false);
                }
            }
        };

        void loadChannel();

        return () => {
            isMounted = false;
        };
    }, [accessToken, conversations, selectedId, streamClient, streamApiKey, userId]);

    useEffect(() => {
        return () => {
            if (streamClient) {
                void streamClient.disconnectUser();
            }
        };
    }, [streamClient]);

    const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

    const isPageLoading = profileLoading || buyerLoading || sellerLoading;
    const pageError = profileError || buyerError || sellerError || null;

    const threadContent = (() => {
        if (!selectedConversation) {
            return (
                <div className="thread-placeholder">
                    <EmptyState
                        title="Select a conversation"
                        subtitle="Choose an order conversation from the left to start messaging."
                    />
                </div>
            );
        }

        if (isThreadLoading) {
            return <div className="thread-loading">Loading conversation…</div>;
        }

        if (chatError) {
            return <div className="thread-error">{chatError}</div>;
        }

        if (!streamClient || !activeChannel) {
            return <div className="thread-loading">Preparing chat…</div>;
        }

        return (
            <div className="thread-stream-wrapper">
                <Chat client={streamClient}>
                    <Channel channel={activeChannel}>
                        <Window>
                            <MessageList />
                            <MessageInput />
                        </Window>
                    </Channel>
                </Chat>
            </div>
        );
    })();

    if (isPageLoading) {
        return <div className="messages-page-loading">Loading conversations…</div>;
    }

    if (pageError) {
        return <div className="messages-page-loading">{pageError}</div>;
    }

    const sharedProps: MessagesPageProps = {
        conversations,
        selectedId,
        setSelectedId,
        selectedConversation,
        threadContent,
        isThreadLoading,
        threadError: chatError,
    };

    if (isMobile) return <MobileMessagesPage {...sharedProps} />;

    return <DesktopMessagesPage {...sharedProps} />;
};

const DesktopMessagesPage = ({
    conversations,
    selectedId,
    setSelectedId,
    selectedConversation,
    threadContent,
}: MessagesPageProps) => {
    return (
        <div className="messages-page">
            {/* ── Inbox sidebar ── */}
            <aside className="messages-inbox">
                <div className="inbox-header">
                    <h2 className="inbox-heading">Messages</h2>
                </div>

                {conversations.length === 0 ? (
                    <EmptyState
                        title="No messages yet"
                        subtitle="When you connect with a baker or buyer, your conversations will appear here."
                        className="inbox-empty"
                    />
                ) : (
                    <ul className="inbox-list">
                        {conversations.map((conv) => (
                            <li
                                key={conv.id}
                                className={`inbox-item${selectedId === conv.id ? ' inbox-item--active' : ''}`}
                                onClick={() => setSelectedId(conv.id)}
                            >
                                <div className="inbox-avatar">{getInitial(conv.participantName)}</div>
                                <div className="inbox-item-body">
                                    <div className="inbox-item-top">
                                        <span className="inbox-item-name">{conv.participantName}</span>
                                        <span className="inbox-item-time">{formatTime(conv.lastMessageAt)}</span>
                                    </div>
                                    <div className="inbox-item-order">{conv.orderLabel}</div>
                                    <div className="inbox-item-bottom">
                                        <span className="inbox-item-preview">{conv.lastMessage}</span>
                                        {conv.unreadCount > 0 && (
                                            <span className="inbox-unread-badge">{conv.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </aside>

            {/* ── Message thread ── */}
            <section className="messages-thread">
                {selectedConversation ? (
                    <>
                        <div className="thread-header">
                            <div className="thread-header-avatar">
                                {getInitial(selectedConversation.participantName)}
                            </div>
                            <div className="thread-header-meta">
                                <span className="thread-header-name">{selectedConversation.participantName}</span>
                                <span className="thread-header-order">{selectedConversation.orderLabel}</span>
                            </div>
                        </div>

                        <div className="thread-messages">{threadContent}</div>
                    </>
                ) : (
                    <div className="thread-placeholder">
                        <EmptyState
                            title="Select a conversation"
                            subtitle="Choose a conversation from the left to start messaging."
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default MessagesPage;
