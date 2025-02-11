import React from 'react';
import { motion } from 'framer-motion';
import { useLetterStore } from '../store/letterStore';

export default function Preview() {
  const { currentLetter } = useLetterStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[600px] h-screen border-l border-gray-200 bg-gray-50 p-8"
    >
      <div
        className="w-full h-full bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none"
        style={{
          fontFamily: currentLetter?.fontFamily || 'serif',
          backgroundImage: `url(${currentLetter?.paperStyle})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="whitespace-pre-wrap">
          {currentLetter?.content || 'Start writing to see your letter preview...'}
        </div>
      </div>
    </motion.div>
  );
}