import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Moon, Sun, Save, Type } from 'lucide-react';

interface Settings {
  username: string;
  isDarkMode: boolean;
  autoSave: boolean;
  fontSize: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  if (!isOpen) return null;

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
          className="bg-white rounded-lg shadow-xl p-6 w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold mb-6">Settings</h2>

          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => onUpdateSettings({ username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Type className="w-5 h-5" />
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Small</span>
                <span>{settings.fontSize}px</span>
                <span>Large</span>
              </div>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Auto Save</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ autoSave: !settings.autoSave })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${settings.autoSave ? 'bg-rose-500' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${settings.autoSave ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Dark Mode</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ isDarkMode: !settings.isDarkMode })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${settings.isDarkMode ? 'bg-rose-500' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${settings.isDarkMode ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}