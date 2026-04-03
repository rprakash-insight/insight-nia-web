import './ChatList.css';

const ChatList = ({ chats, activeChat, onSelectChat, username }) => {
    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <div className="user-profile">
                    <div className="avatar">{username[0].toUpperCase()}</div>
                    <div className="user-info">
                        <div className="username">{username}</div>
                        <div className="status">Active</div>
                    </div>
                </div>
            </div>

            <div className="search-box">
                <input type="text" placeholder="Search or start new chat" />
                <span className="search-icon">🔍</span>
            </div>

            <div className="chat-items">
                {chats.length === 0 ? (
                    <div className="empty-state">
                        <p>No chats yet</p>
                        <p style={{ fontSize: '12px', color: '#666' }}>Start a new conversation</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat)}
                        >
                            <div className="chat-avatar">{chat.name[0].toUpperCase()}</div>
                            <div className="chat-content">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-preview">{chat.lastMessage}</div>
                            </div>
                            <div className="chat-timestamp">{chat.time}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;
