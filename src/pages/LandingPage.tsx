import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Heart, Shield, Clock, MessageCircle } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleAuthSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (authMode === 'signin') {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password, data.name || '');
      }
      setAuthMode(null);
      navigate('/chat');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header onSignIn={() => setAuthMode('signin')} onSignUp={() => setAuthMode('signup')} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 md:text-6xl lg:text-7xl">
              Your Daily
              <span className="text-indigo-600"> Anonymous </span>
              Venting Partner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your thoughts, feelings, and experiences with a new understanding partner every day. 
              No judgments, just genuine connections.
            </p>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <Button size="lg" onClick={() => setAuthMode('signup')}>
                Start Venting Now
              </Button>
              <Button variant="secondary" size="lg">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold">Daily Matching</h3>
              <p className="text-gray-600">Connect with a new understanding partner every day for fresh perspectives.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold">Safe Space</h3>
              <p className="text-gray-600">Express yourself freely in a judgment-free environment.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold">100% Anonymous</h3>
              <p className="text-gray-600">Your identity remains completely private and protected.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold">24-Hour Chats</h3>
              <p className="text-gray-600">Fresh starts daily with new conversations and connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-indigo-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of others who have found comfort and understanding through anonymous venting.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 border-0"
              onClick={() => setAuthMode('signup')}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSubmit={handleAuthSubmit}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      )}
    </div>
  );
}