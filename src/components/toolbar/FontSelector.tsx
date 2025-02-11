import React, { useState } from 'react';
import { Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = [
  { id: 'great-vibes', name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { id: 'dancing-script', name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { id: 'parisienne', name: 'Parisienne', family: "'Parisienne', cursive" },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif" },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif" }
];

interface FontSelectorProps {
  selected: string;
  onSelect: (font: string) => void;
}

export default function FontSelector({ selected, onSelect }: FontSelectorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const selectedFont = fonts.find(f => f.id === selected) || fonts[0];

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="flex items-center space-x-2 hover:text-rose-500 rounded-lg px-3 py-2 transition-colors"
      >
        <Type className="w-5 h-5" />
        <span>Font</span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-100"
          >
            <div className="space-y-2">
              {fonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onSelect(font.id)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all duration-200
                    hover:bg-rose-50 hover:scale-[1.02]
                    ${selected === font.id ? 'bg-rose-100 shadow-sm' : ''}
                  `}
                >
                  <span style={{ fontFamily: font.family }} className="text-lg">
                    {font.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}