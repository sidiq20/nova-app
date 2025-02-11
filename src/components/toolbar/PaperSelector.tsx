import React, { useState } from 'react';
import { ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { papers } from '../../data/papers';

interface PaperSelectorProps {
  selected: string;
  onSelect: (paper: string) => void;
}

export default function PaperSelector({ selected, onSelect }: PaperSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="flex items-center space-x-2 hover:text-rose-500 rounded-lg px-3 py-2 transition-colors"
      >
        <ScrollText className="w-5 h-5" />
        <span>Paper</span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-100"
          >
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(papers).map(([key, { name, preview }]) => (
                <button
                  key={key}
                  onClick={() => onSelect(key)}
                  className={`
                    group relative rounded-xl overflow-hidden aspect-video
                    transition-all duration-200 hover:scale-105
                    ${selected === key ? 'ring-2 ring-rose-500 ring-offset-2' : 'ring-1 ring-gray-200'}
                  `}
                >
                  <img 
                    src={preview} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{name}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}