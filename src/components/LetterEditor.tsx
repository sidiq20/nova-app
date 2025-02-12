import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Trash2, Download, FileImage, File as FilePdf, Share2, Menu } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetterStore } from '../store/letterStore';
import Sidebar from './Sidebar';
import EditorToolbar from './EditorToolbar';
import StickerModal from './modals/StickerModal';
import SettingsModal from './modals/SettingsModal';
import ShareModal from './modals/ShareModal';
import { papers } from '../data/papers';
import { stickers } from '../data/stickers';
import { colors } from '../data/colors';
import { downloadAsImage, downloadAsPDF } from '../utils/downloadUtils';

interface Sticker {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

export default function LetterEditor() {
  const [content, setContent] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedFont, setSelectedFont] = useState('great-vibes');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [placedStickers, setPlacedStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [settings, setSettings] = useState({
    username: 'User',
    isDarkMode: false,
    autoSave: true,
    fontSize: 14,
  });
  const signaturePadRef = useRef<SignaturePad>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStickerClick = (sticker: Sticker) => {
    setSelectedSticker(sticker);
  };

  const handleStickerDuplicate = () => {
    if (selectedSticker && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newSticker = {
        ...selectedSticker,
        id: Math.random().toString(),
        x: 50, // Center horizontally
        y: 50  // Center vertically
      };
      setPlacedStickers([...placedStickers, newSticker]);
    }
  };

  const handleStickerDelete = () => {
    if (selectedSticker) {
      setPlacedStickers(placedStickers.filter(s => s.id !== selectedSticker.id));
      setSelectedSticker(null);
    }
  };

  const handleStickerSizeChange = (size: number) => {
    if (selectedSticker) {
      setPlacedStickers(stickers =>
        stickers.map(s =>
          s.id === selectedSticker.id ? { ...s, size } : s
        )
      );
      setSelectedSticker(prev => prev ? { ...prev, size } : null);
    }
  };

  const handleStickerMove = (x: number, y: number) => {
    if (selectedSticker) {
      setPlacedStickers(stickers =>
        stickers.map(s =>
          s.id === selectedSticker.id ? { ...s, x, y } : s
        )
      );
      setSelectedSticker(prev => prev ? { ...prev, x, y } : null);
    }
  };

  const addSticker = (type: string) => {
    const newSticker = {
      id: Math.random().toString(),
      type,
      x: 50,
      y: 50,
      rotation: Math.random() * 30 - 15,
      size: 1
    };
    setPlacedStickers([...placedStickers, newSticker]);
  };

  const handleStickerDrag = (e: React.DragEvent, stickerId: string) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    setPlacedStickers(stickers =>
      stickers.map(s =>
        s.id === stickerId ? { ...s, x, y } : s
      )
    );
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleDownload = async (type: 'pdf' | 'image') => {
    if (!containerRef.current) return;
    const color = colors.find(c => c.id === selectedColor)?.value || '#ffffff';
    containerRef.current.style.backgroundColor = color;

    if (type === 'pdf') {
      await downloadAsPDF(containerRef);
    } else {
      await downloadAsImage(containerRef);
    }

    containerRef.current.style.backgroundColor = '';
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Nova Letter</h1>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar */}
        <div className={`
          fixed inset-0 z-40 lg:relative lg:z-0
          ${showSidebar ? 'block' : 'hidden lg:block'}
        `}>
          <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowSidebar(false)} />
          <div className="relative z-50 w-80 h-full bg-white">
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>

        <div className="flex-1">
          <EditorToolbar
            alignment={alignment}
            setAlignment={setAlignment}
            selectedPaper={selectedPaper}
            setSelectedPaper={setSelectedPaper}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            onAddSticker={addSticker}
            onOpenSettings={() => setShowSettings(true)}
            onShare={() => setShowShareModal(true)}
          />

          <div className="max-w-[1920px] mx-auto p-4 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Editor Section */}
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                <TextareaAutosize
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your letter here..."
                  className="w-full resize-none border-0 focus:ring-0 focus:outline-none"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${settings.fontSize}px`
                  }}
                  minRows={10}
                />

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Your Signature</label>
                    <button
                      onClick={clearSignature}
                      className="text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="border rounded-xl overflow-hidden">
                    <SignaturePad
                      ref={signaturePadRef}
                      canvasProps={{
                        className: 'w-full h-40'
                      }}
                    />
                  </div>
                </div>

                {/* Download Options */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <FilePdf className="w-5 h-5" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload('image')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                  >
                    <FileImage className="w-5 h-5" />
                    Download Image
                  </button>
                </div>
              </div>

              {/* Preview Section */}
              <div
                ref={containerRef}
                className={`rounded-2xl p-4 lg:p-8 transition-colors duration-200 border-2 ${
                  colors.find(c => c.id === selectedColor)?.border || 'border-gray-200'
                }`}
                onDragOver={(e) => e.preventDefault()}
              >
                <div
                  ref={previewRef}
                  className="bg-white rounded-2xl shadow-lg min-h-[600px] relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${papers[selectedPaper].full})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-white/90">
                    <div
                      className="p-8 whitespace-pre-wrap"
                      style={{
                        textAlign: alignment,
                        fontFamily: selectedFont,
                        fontSize: `${settings.fontSize * 1.5}px`
                      }}
                    >
                      {content || 'Your letter preview will appear here...'}
                    </div>

                    {/* Placed Stickers */}
                    {placedStickers.map((sticker) => (
                      <div
                        key={sticker.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', sticker.id);
                          setIsDragging(true);
                        }}
                        onDrag={(e) => handleStickerDrag(e, sticker.id)}
                        onDragEnd={() => setIsDragging(false)}
                        onClick={() => handleStickerClick(sticker)}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move hover:scale-110 transition-transform ${
                          selectedSticker?.id === sticker.id ? 'ring-2 ring-rose-500 ring-offset-2 rounded-full' : ''
                        }`}
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.size})`,
                          fontSize: '2rem'
                        }}
                      >
                        {stickers.find(s => s.id === sticker.type)?.emoji}
                      </div>
                    ))}

                    {signaturePadRef.current?.toDataURL() && (
                      <div className="absolute bottom-8 right-8 max-w-[200px]">
                        <img
                          src={signaturePadRef.current.toDataURL()}
                          alt="Signature"
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StickerModal
        sticker={selectedSticker}
        onClose={() => setSelectedSticker(null)}
        onDuplicate={handleStickerDuplicate}
        onDelete={handleStickerDelete}
        onSizeChange={handleStickerSizeChange}
        onMove={handleStickerMove}
        size={selectedSticker?.size || 1}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        letterUrl={window.location.href}
      />
    </div>
  );
}