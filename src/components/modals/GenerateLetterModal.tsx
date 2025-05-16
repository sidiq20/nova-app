import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, Loader2, Send, User, Bot } from 'lucide-react';
import { generateLetter } from '../../services/ai';
// Import fonts with proper type definition
import { fonts } from '../../data/fonts';

interface Font {
  id: string;
  name: string;
  family: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GenerateLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (content: string) => void;
  selectedFont?: string;
}

export default function GenerateLetterModal({
  isOpen,
  onClose,
  onGenerated,
  selectedFont = 'great-vibes'
}: GenerateLetterModalProps) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hello! I can help you write your letter. What would you like to write about?'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await generateLetter({
        prompt: userMessage,
        context: messages.map(m => `${m.role}: ${m.content}`).join('\n')
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setError('Failed to generate response. Please try again.');
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseContent = (content: string) => {
    onGenerated(content);
    onClose();
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl shadow-xl w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-rose-500" />
              <h3 className="text-xl font-semibold text-gray-900">AI Letter Assistant</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'assistant' ? 'items-start' : 'items-start justify-end'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-rose-600" />
                  </div>
                )}
                <div className={`
                  max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap
                  ${message.role === 'assistant'
                    ? 'bg-white border border-gray-200'
                    : 'bg-rose-500 text-white'}
                `}>
                  <p 
                    className="text-sm leading-relaxed"
                    style={message.role === 'assistant' ? { 
                      fontFamily: (fonts.find((f: Font) => f.id === selectedFont)?.family || fonts[0].family) 
                    } : {}}
                  >
                    {message.content}
                  </p>
                  {message.role === 'assistant' && message.content.length > 50 && (
                    <button
                      onClick={() => handleUseContent(message.content)}
                      className="mt-2 text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Use this content
                    </button>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-3 bottom-3 p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}