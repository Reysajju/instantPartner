import React from 'react';
import { X } from 'lucide-react';
import { AuthForm } from './AuthForm';

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  onToggleMode: () => void;
}

export function AuthModal({ mode, onClose, onSubmit, onToggleMode }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-8 m-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'signin'
              ? 'Sign in to continue to VentMate'
              : 'Start your journey with VentMate'}
          </p>
        </div>

        <AuthForm mode={mode} onSubmit={onSubmit} />

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={onToggleMode}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}