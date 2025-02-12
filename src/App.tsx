import React, { useEffect, useState } from 'react';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LetterEditor from './components/LetterEditor';
import Auth from './components/Auth';
import Hero from './components/Hero';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-red-500 text-center mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">Configuration Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <p className="text-sm text-gray-500 text-center">
            Please ensure all required environment variables are properly set.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showEditor ? <Auth /> : <Hero onGetStarted={() => setShowEditor(true)} />;
  }

  return <LetterEditor />;
}