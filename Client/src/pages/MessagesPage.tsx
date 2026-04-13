import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import EmptyState from '../components/EmptyState';
import MobileMessagesPage from './MobileMessagePage';
import './MessagesPage.css';

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number; // number of unread messages in the conversation - should change in backend
}

export interface Message {
    id: string;
    senderId: string;
    body: string;
    sentAt: string; // ISO timestamp
}

export interface MessagesPageProps {
    conversations: Conversation[];
    messages: Message[];
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSend: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

// TODO: Replace CURRENT_USER_ID with the authenticated user's ID
const CURRENT_USER_ID = 'me';

// TODO: Remove placeholder conversations
const PLACEHOLDER_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-1',
        participantId: 'user-2',
        participantName: 'Sarah M.',
        lastMessage: 'Does the cinnamon roll order come with icing?',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        unreadCount: 0,
    }
];

// TODO: Remove placeholder messages
const PLACEHOLDER_MESSAGES: Record<string, Message[]> = {
    'conv-1': [
        { id: 'm1', senderId: 'user-2', body: 'Hi! I saw your cinnamon roll listing.', sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
        { id: 'm2', senderId: CURRENT_USER_ID, body: 'Hey! Yes, they\'re fresh-baked every morning.', sentAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
        { id: 'm3', senderId: 'user-2', body: 'Does the cinnamon roll order come with icing?', sentAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    ]
};

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

    // TODO: get conversations from backend
    const conversations = PLACEHOLDER_CONVERSATIONS;

    const [selectedId, setSelectedId] = useState<string | null>(
        !isMobile && conversations.length > 0 ? conversations[0].id : null
    );
    const [inputValue, setInputValue] = useState('');
    const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(PLACEHOLDER_MESSAGES);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // TODO: get messages from backend
    const messages = selectedId ? (localMessages[selectedId] ?? []) : [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const body = inputValue.trim();
        if (!body || !selectedId) return;

        // TODO: Replace with useMutation: mutate({ conversationId: selectedId, body })
        //       then invalidate queryKeys.messages(selectedId) and queryKeys.conversations on success.
        const newMessage: Message = {
            id: `local-${Date.now()}`,
            senderId: CURRENT_USER_ID,
            body,
            sentAt: new Date().toISOString(),
        };
        setLocalMessages((prev) => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] ?? []), newMessage],
        }));
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const sharedProps: MessagesPageProps = {
        conversations,
        messages,
        selectedId,
        setSelectedId,
        inputValue,
        setInputValue,
        handleSend,
        handleKeyDown,
        messagesEndRef,
    };

    if (isMobile) return <MobileMessagesPage {...sharedProps} />;

    return <DesktopMessagesPage {...sharedProps} />;
};

const DesktopMessagesPage = ({
    conversations,
    messages,
    selectedId,
    setSelectedId,
    inputValue,
    setInputValue,
    handleSend,
    handleKeyDown,
    messagesEndRef,
}: MessagesPageProps) => {
    const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

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
                            <span className="thread-header-name">{selectedConversation.participantName}</span>
                        </div>

                        <div className="thread-messages">
                            {messages.length === 0 ? (
                                <EmptyState
                                    title="No messages yet"
                                    subtitle="Send a message to start the conversation."
                                    className="thread-empty"
                                />
                            ) : (
                                messages.map((msg) => {
                                    const isMine = msg.senderId === CURRENT_USER_ID;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`bubble-row${isMine ? ' bubble-row--mine' : ''}`}
                                        >
                                            <div className={`bubble${isMine ? ' bubble--mine' : ' bubble--theirs'}`}>
                                                <p className="bubble-text">{msg.body}</p>
                                                <span className="bubble-time">{formatTime(msg.sentAt)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="compose-bar">
                            <textarea
                                className="compose-input"
                                placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={2}
                            />
                            <button
                                className="compose-send"
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                            >
                                Send
                            </button>
                        </div>
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
