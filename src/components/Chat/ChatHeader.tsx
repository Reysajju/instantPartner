import React from 'react';
import { Clock } from 'lucide-react';

interface ChatHeaderProps {
  timeRemaining: string;
}

export function ChatHeader({ timeRemaining }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
      <div>
        <h2 className="font-semibold">Anonymous Chat</h2>
        <p className="text-sm text-gray-500">Your daily venting partner</p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>{timeRemaining}</span>
      </div>
    </div>
  );
}