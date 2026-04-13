import EmptyState from '../components/EmptyState';
import { formatTime, getInitial } from './MessagesPage';
import type { MessagesPageProps } from './MessagesPage';
import './MobileMessagePage.css';

// TODO: Replace CURRENT_USER_ID with the authenticated user's ID
const CURRENT_USER_ID = 'me';

const MobileMessagesPage = ({
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
                    <span className="thread-header-name">{selectedConversation.participantName}</span>
                </div>

                <div className="thread-messages mobile-thread-messages">
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

                <div className="mobile-compose-bar">
                    <textarea
                        className="compose-input"
                        placeholder="Type a message…"
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
