import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { differenceInSeconds, addDays, format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'seen';
}

interface Partner {
  id: string;
  name: string;
  matchedAt: Date;
}

interface ChatContextType {
  messages: Message[];
  partner: Partner | null;
  timeRemaining: string;
  sendMessage: (content: string) => void;
  isChatExpired: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

const CHAT_DURATION = 24 * 60 * 60; // 24 hours in seconds

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isChatExpired, setIsChatExpired] = useState(false);

  // Initialize partner matching
  useEffect(() => {
    if (!partner) {
      const newPartner = {
        id: uuidv4(),
        name: 'Anonymous Partner',
        matchedAt: new Date(),
      };
      setPartner(newPartner);
      setMessages([
        {
          id: uuidv4(),
          content: "Hi there! Feel free to share whatever is on your mind. This is a safe space.",
          timestamp: new Date(),
          isOwn: false,
        },
      ]);
    }
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!partner) return;

    const chatEndTime = addDays(partner.matchedAt, 1);

    const updateTimer = () => {
      const secondsLeft = differenceInSeconds(chatEndTime, new Date());
      
      if (secondsLeft <= 0) {
        setIsChatExpired(true);
        setTimeRemaining('Chat Expired');
        return;
      }

      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [partner]);

  const sendMessage = (content: string) => {
    if (isChatExpired) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message being delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    // Simulate message being seen
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
        )
      );

      // Simulate partner response
      if (!isChatExpired) {
        const responses = [
          "I understand how you feel. Would you like to tell me more about that?",
          "That sounds challenging. How are you coping with it?",
          "I'm here to listen. Feel free to continue sharing.",
          "Thank you for sharing that with me. What else is on your mind?",
          "I appreciate you opening up. How long have you been feeling this way?",
        ];

        const response: Message = {
          id: uuidv4(),
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isOwn: false,
        };

        setMessages((prev) => [...prev, response]);
      }
    }, 2000);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        partner,
        timeRemaining,
        sendMessage,
        isChatExpired,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}