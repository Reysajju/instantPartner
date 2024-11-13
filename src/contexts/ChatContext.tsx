import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { differenceInSeconds, addDays } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
  sendMessage: (content: string) => Promise<void>;
  isChatExpired: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isChatExpired, setIsChatExpired] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load chat history and partner info
    const loadChatData = async () => {
      const { data: chatData } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (chatData) {
        setPartner({
          id: chatData.partner_id,
          name: 'Anonymous Partner',
          matchedAt: new Date(chatData.matched_at),
        });

        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatData.id)
          .order('timestamp', { ascending: true });

        if (messages) {
          setMessages(messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })));
        }
      } else {
        // Create new chat if none exists
        const newPartner = {
          id: uuidv4(),
          name: 'Anonymous Partner',
          matchedAt: new Date(),
        };

        const { data: newChat } = await supabase
          .from('chats')
          .insert({
            user_id: user.id,
            partner_id: newPartner.id,
            matched_at: newPartner.matchedAt,
          })
          .select()
          .single();

        if (newChat) {
          setPartner(newPartner);
          const welcomeMessage = {
            id: uuidv4(),
            content: "Hi there! Feel free to share whatever is on your mind. This is a safe space.",
            timestamp: new Date(),
            isOwn: false,
          };

          await supabase
            .from('messages')
            .insert({
              chat_id: newChat.id,
              content: welcomeMessage.content,
              timestamp: welcomeMessage.timestamp,
              is_own: welcomeMessage.isOwn,
            });

          setMessages([welcomeMessage]);
        }
      }
    };

    loadChatData();
  }, [user]);

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

  const sendMessage = async (content: string) => {
    if (isChatExpired || !user) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
    };

    const { data: chatData } = await supabase
      .from('chats')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (chatData) {
      await supabase
        .from('messages')
        .insert({
          id: newMessage.id,
          chat_id: chatData.id,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          is_own: newMessage.isOwn,
          status: newMessage.status,
        });

      setMessages(prev => [...prev, newMessage]);

      // Simulate partner response
      setTimeout(async () => {
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

        await supabase
          .from('messages')
          .insert({
            id: response.id,
            chat_id: chatData.id,
            content: response.content,
            timestamp: response.timestamp,
            is_own: response.isOwn,
          });

        setMessages(prev => [...prev, response]);
      }, 2000);
    }
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