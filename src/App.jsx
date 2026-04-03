import { useState, useCallback } from 'react';
import useMqtt from './hooks/useMqtt';
import LoginPanel from './components/LoginPanel';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';

const App = () => {
  const [username, setUsername] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mqtt = useMqtt();

  // Predefined list of users for demo purposes
  const DEMO_USERS = ['alice', 'bob', 'charlie', 'diana'];

  const handleLogin = useCallback(
    async (user) => {
      setIsLoading(true);
      try {
        await mqtt.connect(user);
        setUsername(user);

        // Initialize demo chats with other users
        const initialChats = DEMO_USERS.filter((u) => u !== user).map((u) => ({
          id: u,
          name: u.charAt(0).toUpperCase() + u.slice(1),
          topic: `chat/${user}`,
          lastMessage: 'Click to start chatting',
          time: 'now',
        }));

        setChats(initialChats);

        // Subscribe to all chat topics for this user
        initialChats.forEach((chat) => {
          mqtt.subscribe(chat.topic);
        });
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mqtt]
  );

  const handleSelectChat = useCallback((chat) => {
    setActiveChat(chat);
  }, []);

  const handleSendMessage = useCallback(
    (topic, text) => {
      if (!username) return;

      mqtt.publishMessage(topic, {
        sender: username,
        text: text,
        timestamp: new Date().toISOString(),
      });

      // Update chat list with last message
      setChats((prev) =>
        prev.map((chat) =>
          chat.topic === topic
            ? {
              ...chat,
              lastMessage: text,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
            : chat
        )
      );
    },
    [username, mqtt]
  );

  if (!username) {
    return <LoginPanel onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        username={username}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={mqtt.messages}
        onSendMessage={handleSendMessage}
        username={username}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
