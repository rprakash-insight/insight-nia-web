import { useEffect, useRef } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ activeChat, messages, onSendMessage, username, isLoading }) => {
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!activeChat) {
        return (
            <div className="chat-window empty">
                <div className="empty-state-large">
                    <div className="empty-icon">💬</div>
                    <h2>No chat selected</h2>
                    <p>Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const chatMessages = messages[activeChat.topic] || [];

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="header-left">
                    <div className="header-avatar">{activeChat.name[0].toUpperCase()}</div>
                    <div>
                        <h3 className="header-title">{activeChat.name}</h3>
                        <p className="header-status">Active now</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="action-btn">📞</button>
                    <button className="action-btn">📹</button>
                    <button className="action-btn">ℹ️</button>
                </div>
            </div>

            <div className="messages-container">
                {chatMessages.length === 0 ? (
                    <div className="empty-messages">
                        <p>No messages yet</p>
                        <p style={{ fontSize: '12px' }}>Start the conversation</p>
                    </div>
                ) : (
                    chatMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === username ? 'sent' : 'received'}`}
                        >
                            <div
                                className={`message-avatar ${message.sender === username ? 'hidden' : ''}`}
                            >
                                {message.sender[0].toUpperCase()}
                            </div>
                            <div className="message-content">
                                {message.sender !== username && (
                                    <span className="message-sender">{message.sender}</span>
                                )}
                                <div
                                    className={`message-bubble ${message.sender === username ? 'mine' : 'theirs'
                                        }`}
                                >
                                    {message.text}
                                </div>
                                <span className="message-time">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messageEndRef} />
            </div>

            <div className="message-input-area">
                <input
                    type="text"
                    className="message-input"
                    placeholder={`Message ${activeChat.name}...`}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                            onSendMessage(activeChat.topic, e.target.value.trim());
                            e.target.value = '';
                        }
                    }}
                    disabled={isLoading}
                />
                <button
                    className="send-btn"
                    onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                            onSendMessage(activeChat.topic, input.value.trim());
                            input.value = '';
                        }
                    }}
                    disabled={isLoading}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
