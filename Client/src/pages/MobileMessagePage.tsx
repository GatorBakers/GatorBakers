import EmptyState from '../components/EmptyState';
import { formatTime, getInitial } from './MessagesPage';
import type { MessagesPageProps } from './MessagesPage';
import './MobileMessagePage.css';

const MobileMessagesPage = ({
    conversations,
    setSelectedId,
    selectedConversation,
    threadContent,
}: MessagesPageProps) => {
    if (selectedConversation) {
        return (
            <div className="mobile-thread-overlay">
                <div className="mobile-thread-header">
                    <button
                        className="mobile-back-btn"
                        onClick={() => setSelectedId(null)}
                        aria-label="Back to inbox"
                    >
                        &#8592; Back
                    </button>
                    <div className="thread-header-avatar">
                        {getInitial(selectedConversation.participantName)}
                    </div>
                    <div className="thread-header-meta">
                        <span className="thread-header-name">{selectedConversation.participantName}</span>
                        <span className="thread-header-order">{selectedConversation.orderLabel}</span>
                    </div>
                </div>

                <div className="thread-messages mobile-thread-messages">
                    {threadContent}
                </div>
            </div>
        );
    }

    return (
        <div className="mobile-messages-page">
            {conversations.length === 0 ? (
                <EmptyState
                    title="No messages yet"
                    subtitle="When you connect with a baker or buyer, your conversations will appear here."
                    className="mobile-inbox-empty"
                />
            ) : (
                <ul className="inbox-list">
                    {conversations.map((conv) => (
                        <li
                            key={conv.id}
                            className="inbox-item"
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
        </div>
    );
};

export default MobileMessagesPage;
