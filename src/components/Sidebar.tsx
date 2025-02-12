import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Clock, Settings, Heart, X } from 'lucide-react';
import { useLetterStore } from '../store/letterStore';
import { format } from 'date-fns';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const letters = useLetterStore(state => state.letters);
  const currentLetter = useLetterStore(state => state.currentLetter);
  const searchQuery = useLetterStore(state => state.searchQuery);
  const setCurrentLetter = useLetterStore(state => state.setCurrentLetter);
  const setSearchQuery = useLetterStore(state => state.setSearchQuery);
  const fetchLetters = useLetterStore(state => state.fetchLetters);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const filteredLetters = letters.filter(letter =>
    letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    letter.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-full h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
              <User className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="font-semibold">My Letters</h2>
              <p className="text-sm text-gray-500">{letters.length} letters written</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search letters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-rose-500 border-t-transparent"></div>
        </div>
      ) : (
        /* Letter History */
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {filteredLetters.map((letter) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  currentLetter?.id === letter.id
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-rose-300'
                }`}
                onClick={() => {
                  setCurrentLetter(letter);
                  if (onClose) onClose();
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{letter.title || 'Untitled Letter'}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{letter.content}</p>
                  </div>
                  {letter.favorite && (
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-4 h-4" />
                  {format(new Date(letter.updatedAt), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </motion.aside>
  );
}