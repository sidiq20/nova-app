import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Heart, PenLine, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during authentication.';

      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50 flex">
      {/* Left side - Inspiration */}
      <div className="hidden lg:flex lg:w-1/2 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Heart className={`w-${Math.floor(Math.random() * 8 + 4)} h-${Math.floor(Math.random() * 8 + 4)} text-rose-${Math.floor(Math.random() * 3 + 3)}00 opacity-${Math.floor(Math.random() * 3 + 2)}0`} />
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PenLine className="w-12 h-12 text-rose-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Express Your Feelings</h2>
            <p className="text-lg text-gray-600">
              Create beautiful, heartfelt letters that will be cherished forever. Add your personal touch with custom signatures and decorative elements.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-rose-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                <Sparkles className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? 'Sign in to continue your letter writing journey'
                  : 'Start creating beautiful letters today'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
              >
                <PenLine className="w-5 h-5 mr-2" />
                {isLogin ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                {isLogin
                  ? "Don't have an account? Sign up to start writing"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}