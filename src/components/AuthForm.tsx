import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Mail, Lock, User } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <div className="relative">
          <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
          <Input
            label="Name"
            type="text"
            placeholder="Enter your name"
            className="pl-10"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
        </div>
      )}
      <div className="relative">
        <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          className="pl-10"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          className="pl-10"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />
      </div>
      <Button type="submit" className="w-full">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
}