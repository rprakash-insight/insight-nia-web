import { useEffect, useRef, useCallback, useState } from 'react';
import mqtt from 'mqtt';

const useMqtt = () => {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  const messageHandlersRef = useRef({});

  const connect = useCallback((username) => {
    return new Promise((resolve, reject) => {
      try {
        const client = mqtt.connect('ws://localhost:1882', {
          clientId: `user_${username}_${Date.now()}`,
          username: username,
          clean: true,
        });

        client.on('connect', () => {
          console.log('Connected to MQTT broker');
          setIsConnected(true);
          clientRef.current = client;
          resolve(client);
        });

        client.on('message', (topic, payload) => {
          const message = JSON.parse(payload.toString());
          
          setMessages((prev) => ({
            ...prev,
            [topic]: [
              ...(prev[topic] || []),
              {
                id: Date.now(),
                ...message,
                timestamp: new Date().toISOString(),
              },
            ],
          }));

          if (messageHandlersRef.current[topic]) {
            messageHandlersRef.current[topic](message);
          }
        });

        client.on('error', (error) => {
          console.error('MQTT Error:', error);
          reject(error);
        });

        client.on('disconnect', () => {
          console.log('Disconnected from MQTT broker');
          setIsConnected(false);
        });
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const subscribe = useCallback((topic, handler) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.subscribe(topic, (error) => {
        if (error) {
          console.error(`Failed to subscribe to ${topic}:`, error);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
      if (handler) {
        messageHandlersRef.current[topic] = handler;
      }
    }
  }, []);

  const publishMessage = useCallback((topic, payload) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish(topic, JSON.stringify(payload), {
        qos: 1,
        retain: false,
      });
    }
  }, []);

  const unsubscribe = useCallback((topic) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.unsubscribe(topic);
      delete messageHandlersRef.current[topic];
    }
  }, []);

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, []);

  return {
    connect,
    subscribe,
    publishMessage,
    unsubscribe,
    isConnected,
    messages,
    client: clientRef.current,
  };
};

export default useMqtt;
