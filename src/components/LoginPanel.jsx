import { useState } from 'react';
import './LoginPanel.css';

const LoginPanel = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onLogin(username.trim());
        } catch (err) {
            setError('Failed to connect. Make sure MQTT broker is running on localhost:1882');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-panel-wrapper">
            <div className="login-panel">
                <div className="login-icon">💬</div>
                <h1>Microsoft Teams Chat</h1>
                <p className="subtitle">MQTT-Powered End-to-End Chat</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Enter your username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setError('')}
                            placeholder="e.g., alice"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={isLoading || !username.trim()}>
                        {isLoading ? 'Connecting...' : 'Join Chat'}
                    </button>
                </form>

                <div className="info-box">
                    <p>
                        <strong>How to use:</strong>
                    </p>
                    <ul>
                        <li>Enter your username to connect</li>
                        <li>Start chats with other users</li>
                        <li>Messages are sent via MQTT broker</li>
                        <li>Make sure broker runs on localhost:1882</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPanel;
