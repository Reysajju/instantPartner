import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function Header({ onSignIn, onSignUp }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-xl">VentMate</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onSignIn}>
            Sign In
          </Button>
          <Button size="sm" onClick={onSignUp}>
            Get Started
          </Button>
        </nav>
      </div>
    </header>
  );
}