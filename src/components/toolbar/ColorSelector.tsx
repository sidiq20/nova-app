import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../data/colors';

interface ColorSelectorProps {
  selected: string;
  onSelect: (color: string) => void;
}

export default function ColorSelector({ selected, onSelect }: ColorSelectorProps) {
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
        <Palette className="w-5 h-5" />
        <span>Color</span>
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
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onSelect(color.id)}
                  className={`
                    relative p-4 rounded-xl transition-all duration-200
                    border-2 hover:scale-105 ${color.border}
                    ${selected === color.id ? 'ring-2 ring-rose-500 ring-offset-2' : ''}
                  `}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="sr-only">{color.name}</span>
                  {selected === color.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}