import React from 'react';
import { ChatWindow } from '../components/Chat/ChatWindow';
import { useChat } from '../contexts/ChatContext';

export function ChatPage() {
  const { messages, sendMessage, timeRemaining, isChatExpired } = useChat();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-3xl h-[calc(100vh-2rem)]">
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          timeRemaining={timeRemaining}
          disabled={isChatExpired}
        />
      </div>
    </div>
  );
}