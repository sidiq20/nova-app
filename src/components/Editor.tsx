import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion } from 'framer-motion';
import { Save, Download, Share } from 'lucide-react';
import { useLetterStore } from '../store/letterStore';

export default function Editor() {
  const { currentLetter, updateLetter } = useLetterStore();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentLetter) {
      updateLetter(currentLetter.id, { content: e.target.value });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Editor Toolbar */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="h-16 border-b border-gray-200 flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-4">
          <select className="border border-gray-200 rounded-lg px-3 py-1.5">
            <option>Serif</option>
            <option>Sans Serif</option>
            <option>Monospace</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-1.5">
            <option>Classic Paper</option>
            <option>Parchment</option>
            <option>Modern White</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Save className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Writing Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <TextareaAutosize
            value={currentLetter?.content || ''}
            onChange={handleContentChange}
            placeholder="Dear friend..."
            className="w-full resize-none border-0 focus:ring-0 font-serif text-lg"
            minRows={20}
          />
        </div>
      </div>
    </div>
  );
}