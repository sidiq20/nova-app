import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Share2, MessageCircle, Send, Link2, Twitter } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterUrl: string;
}

const shareOptions = [
  {
    name: 'Email',
    icon: Mail,
    action: (url: string) => {
      window.open(`mailto:?subject=Check out my letter on Nova Letter&body=${encodeURIComponent(url)}`);
    },
    color: 'bg-blue-500'
  },
  {
    name: 'WhatsApp',
    icon: MessageCircle,
    action: (url: string) => {
      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    },
    color: 'bg-green-500'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    action: (url: string) => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out my letter on Nova Letter!`);
    },
    color: 'bg-sky-500'
  },
  {
    name: 'Telegram',
    icon: Send,
    action: (url: string) => {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=Check out my letter on Nova Letter!`);
    },
    color: 'bg-blue-400'
  }
];

export default function ShareModal({ isOpen, onClose, letterUrl }: ShareModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letterUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (option: typeof shareOptions[0]) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Nova Letter",
          text: "Check out my letter on Nova Letter!",
          url: letterUrl
        });
      } else {
        option.action(letterUrl);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 w-[400px] max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Share Letter</h3>
            <Share2 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShare(option)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`p-3 rounded-xl ${option.color} text-white transform group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">{option.name}</span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={letterUrl}
              readOnly
              className="w-full px-4 py-3 pr-24 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Copy
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}