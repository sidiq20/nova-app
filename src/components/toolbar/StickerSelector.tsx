import React, { useState } from 'react';
import { Sticker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stickers } from '../../data/stickers';

interface StickerSelectorProps {
  onSelect: (stickerId: string) => void;
}

export default function StickerSelector({ onSelect }: StickerSelectorProps) {
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
        <Sticker className="w-5 h-5" />
        <span>Stickers</span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-100"
          >
            <div className="grid grid-cols-3 gap-3">
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => onSelect(sticker.id)}
                  className="p-3 text-2xl hover:bg-rose-50 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  {sticker.emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}