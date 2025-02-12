import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Heart, Sparkles, Send } from 'lucide-react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';



interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  const handleDemoSignIn = async () => {
    try {
      // Try to sign in first
      await signInWithEmailAndPassword(auth, 'demo@example.com', 'demo123456');
    } catch (error: any) {
      // If user doesn't exist, create it
      if (error.code === 'auth/user-not-found') {
        try {
          await createUserWithEmailAndPassword(auth, 'demo@example.com', 'demo123456');
        } catch (createError) {
          console.error('Failed to create demo account:', createError);
        }
      } else {
        console.error('Demo sign in failed:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            animate={{
              x: ['-100%', '100%'],
              y: [i * 20, (i * 20) + 10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart className="w-24 h-24 text-rose-300" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-rose-100"
              >
                <Sparkles className="w-4 h-4 text-rose-500 mr-2" />
                <span className="text-sm font-medium text-rose-700">Express your feelings beautifully</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
              >
                Write letters that
                <span className="block text-rose-500">touch hearts</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-600 max-w-lg"
              >
                Create beautiful, heartfelt letters with elegant designs, custom signatures, and personal touches that make your messages unforgettable.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-rose-500/25 flex items-center justify-center"
              >
                <PenLine className="w-5 h-5 mr-2" />
                Start Writing
              </button>
              <button
                onClick={handleDemoSignIn}
                className="px-8 py-4 rounded-lg bg-white text-rose-500 font-medium hover:bg-rose-50 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center border border-rose-100"
              >
                <Send className="w-5 h-5 mr-2" />
                Try Demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center text-white font-medium"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">1,000+</span> letters written today
              </p>
            </motion.div>
          </motion.div>

          {/* Right column - Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-indigo-100 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-xl">
                <img
                  src="/assets/paper/paper1.png"
                  alt="Letter preview"
                  className="w-full h-full object-cover rounded-3xl opacity-20"
                />
                <div className="absolute inset-0 p-8">
                  <div className="h-full flex flex-col">
                    <div className="font-serif text-gray-600 mb-4">Dear Sarah,</div>
                    <div className="flex-1 font-serif text-gray-400 text-sm leading-relaxed">
                      I hope this letter finds you well. I wanted to take a moment to express my gratitude for your unwavering support and friendship throughout the years...
                    </div>
                    <div className="font-dancing-script text-xl text-gray-600">
                      With love,<br />
                      Michael
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4"
            >
              <Heart className="w-16 h-16 text-rose-400 fill-rose-400 opacity-50" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}