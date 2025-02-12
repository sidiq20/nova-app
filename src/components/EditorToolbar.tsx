import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Download, Share2, Settings } from 'lucide-react';
import FontSelector from './toolbar/FontSelector';
import ColorSelector from './toolbar/ColorSelector';
import PaperSelector from './toolbar/PaperSelector';
import StickerSelector from './toolbar/StickerSelector';

interface EditorToolbarProps {
  alignment: 'left' | 'center' | 'right';
  setAlignment: (alignment: 'left' | 'center' | 'right') => void;
  selectedPaper: string;
  setSelectedPaper: (paper: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  onAddSticker: (type: string) => void;
  onDownload: () => void;
  onOpenSettings: () => void;
  onShare: () => void;
}

export default function EditorToolbar({
  alignment,
  setAlignment,
  selectedPaper,
  setSelectedPaper,
  selectedColor,
  setSelectedColor,
  selectedFont,
  setSelectedFont,
  onAddSticker,
  onDownload,
  onOpenSettings,
  onShare
}: EditorToolbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center space-x-2 lg:space-x-6">
            {/* Mobile view - only icons */}
            <div className="lg:hidden flex items-center space-x-2">
              <FontSelector selected={selectedFont} onSelect={setSelectedFont} mobileView={true} />
              <ColorSelector selected={selectedColor} onSelect={setSelectedColor} mobileView={true} />
              <PaperSelector selected={selectedPaper} onSelect={setSelectedPaper} mobileView={true} />
              <StickerSelector onSelect={onAddSticker} mobileView={true} />
            </div>

            {/* Desktop view - icons with text */}
            <div className="hidden lg:flex items-center space-x-6">
              <FontSelector selected={selectedFont} onSelect={setSelectedFont} mobileView={false} />
              <ColorSelector selected={selectedColor} onSelect={setSelectedColor} mobileView={false} />
              <PaperSelector selected={selectedPaper} onSelect={setSelectedPaper} mobileView={false} />

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center space-x-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => setAlignment(align as typeof alignment)}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      hover:bg-rose-50 hover:text-rose-500
                      ${alignment === align ? 'bg-rose-100 text-rose-600' : ''}
                    `}
                  >
                    {align === 'left' && <AlignLeft className="w-5 h-5" />}
                    {align === 'center' && <AlignCenter className="w-5 h-5" />}
                    {align === 'right' && <AlignRight className="w-5 h-5" />}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <StickerSelector onSelect={onAddSticker} mobileView={false} />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 lg:px-4 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden lg:inline">Download</span>
            </button>
            <button
              onClick={onShare}
              className="p-2 lg:px-4 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden lg:inline">Share</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}