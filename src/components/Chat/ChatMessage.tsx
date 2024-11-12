import React from 'react';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isOwn?: boolean;
  status?: 'sent' | 'delivered' | 'seen';
}

export function ChatMessage({ content, timestamp, isOwn, status }: ChatMessageProps) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[75%] rounded-2xl px-4 py-2 mb-1',
        isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'
      )}>
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <div className={cn(
          'flex items-center gap-1 text-xs mt-1',
          isOwn ? 'text-indigo-100' : 'text-gray-500'
        )}>
          <span>{format(timestamp, 'HH:mm')}</span>
          {isOwn && status && (
            <span>• {status}</span>
          )}
        </div>
      </div>
    </div>
  );
}