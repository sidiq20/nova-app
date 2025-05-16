import React from 'react';
import { Copy, Trash2, Move, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sticker {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

interface StickerModalProps {
  sticker: Sticker | null;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSizeChange: (size: number) => void;
  onMove: (stickerId: string, x: number, y: number) => void;
  size: number;
}

export default function StickerModal({
  sticker,
  onClose,
  onDuplicate,
  onDelete,
  onSizeChange,
  onMove,
  size
}: StickerModalProps) {
  if (!sticker) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-80 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Sticker Options</h3>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scrollbar">
            {/* Size Control */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Maximize className="w-4 h-4" />
                Size
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={size}
                onChange={(e) => onSizeChange(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Position Controls */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Move className="w-4 h-4" />
                Position
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">X Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sticker.x}
                    onChange={(e) => onMove(sticker.id, parseFloat(e.target.value), sticker.y)}
                    className="w-full accent-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y Position</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sticker.y}
                    onChange={(e) => onMove(sticker.id, sticker.x, parseFloat(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onDuplicate}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span>Duplicate Sticker</span>
            </button>

            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Sticker</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}