import { useState, useEffect } from 'react';
import { ref, push, onValue, off, query, orderByChild } from 'firebase/database';
import { db } from '../config/firebase';
import { ChatMessage } from '../types';

export const useChat = (channelId?: string, recipientId?: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId && !recipientId) return;

    const path = channelId
      ? `/channels/${channelId}/messages`
      : `/directMessages/${recipientId}`;
    
    const messagesRef = ref(db, path);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));

    setLoading(true);

    onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
          timestamp: new Date(value.timestamp)
        }));
        setMessages(messageList.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => {
      off(messagesQuery);
    };
  }, [channelId, recipientId]);

  const sendMessage = async (message: Omit<ChatMessage, 'id'>) => {
    const path = message.channelId 
      ? `/channels/${message.channelId}/messages`
      : `/directMessages/${message.recipientId}`;

    const messagesRef = ref(db, path);
    await push(messagesRef, {
      ...message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  };

  return {
    messages,
    loading,
    sendMessage
  };
};