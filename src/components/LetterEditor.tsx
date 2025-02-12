import React, { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Trash2, Download, FileImage, File as FilePdf, Share2, Menu, Sparkles } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { motion, AnimatePresence } from 'framer-motion';
import { useLetterStore } from '../store/letterStore';
import Sidebar from './Sidebar';
import EditorToolbar from './EditorToolbar';
import StickerModal from './modals/StickerModal';
import SettingsModal from './modals/SettingsModal';
import ShareModal from './modals/ShareModal';
import GenerateLetterModal from './modals/GenerateLetterModal';
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
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
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

  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current) {
        const width = previewRef.current.offsetWidth;
        const height = width * 1.4142; // A4 ratio
        previewRef.current.style.height = `${height}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleStickerClick = (sticker: Sticker, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSticker(sticker);
  };

  const handleStickerMove = (stickerId: string, x: number, y: number) => {
    setPlacedStickers(stickers =>
      stickers.map(s =>
        s.id === stickerId ? { ...s, x, y } : s
      )
    );
  };

  const handleStickerDuplicate = () => {
    if (selectedSticker) {
      const newSticker = {
        ...selectedSticker,
        id: Math.random().toString(),
        x: 50,
        y: 50
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

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleDownload = async (type: 'pdf' | 'image') => {
    if (!containerRef.current) return;
    if (type === 'pdf') {
      await downloadAsPDF(containerRef);
    } else {
      await downloadAsImage(containerRef);
    }
  };

  const selectedColorData = colors.find(c => c.id === selectedColor);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownload('pdf')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FilePdf className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleDownload('image')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <FileImage className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={`
          fixed inset-0 z-40 lg:relative lg:z-0
          ${showSidebar ? 'block' : 'hidden lg:block'}
        `}>
          <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setShowSidebar(false)} />
          <div className="relative z-50 w-80 h-full bg-white">
            <Sidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
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
            onDownload={() => handleDownload('pdf')}
          />

          <div className="max-w-[1920px] mx-auto p-4 lg:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
                <TextareaAutosize
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your letter here..."
                  className="w-full resize-none border-0 focus:ring-0 focus:outline-none whitespace-pre-wrap break-words"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${settings.fontSize}px`
                  }}
                  minRows={10}
                />

                <div className="mt-4">
                  <button
                    onClick={() => setShowGenerateModal(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg hover:from-rose-500 hover:to-rose-600 transition-all duration-200 group"
                  >
                    <Sparkles className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Add More Content</span>
                  </button>
                </div>

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

              <div
                ref={containerRef}
                style={{
                  backgroundColor: selectedColorData?.value || '#ffffff',
                  padding: 'clamp(1rem, 3vw, 2rem)',
                  borderRadius: '1rem',
                  transition: 'background-color 0.3s ease'
                }}
                className="relative w-full"
              >
                <motion.div
                  ref={previewRef}
                  className="preview-content relative bg-white rounded-xl shadow-2xl overflow-visible w-full"
                  style={{
                    backgroundImage: `url(${papers[selectedPaper].full})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <motion.div
                    className="p-6 md:p-12 whitespace-pre-wrap break-words mx-auto relative z-10"
                    style={{
                      maxWidth: '90%',
                      textAlign: alignment,
                      fontFamily: `${selectedFont}, serif`,
                      fontSize: `clamp(${settings.fontSize}px, 2vw, ${settings.fontSize * 1.5}px)`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {content || (
                      <motion.span
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-400"
                      >
                        Your letter preview will appear here...
                      </motion.span>
                    )}
                  </motion.div>

                  {signaturePadRef.current?.toDataURL() && (
                    <motion.div
                      className="absolute bottom-12 right-12"
                      style={{
                        maxWidth: 'min(200px, 30%)',
                        zIndex: 10,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <img
                        src={signaturePadRef.current.toDataURL()}
                        alt="Signature"
                        className="w-full filter drop-shadow-md"
                        draggable={false}
                      />
                    </motion.div>
                  )}

                  <div className="absolute inset-0">
                    <div className="relative w-full h-full">
                      {placedStickers.map((sticker) => (
                        <motion.div
                          key={sticker.id}
                          className="sticker absolute cursor-move"
                          style={{
                            left: `${sticker.x}%`,
                            top: `${sticker.y}%`,
                            fontSize: 'clamp(1rem, 3vw, 2rem)',
                            zIndex: 20,
                          }}
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{
                            scale: sticker.size,
                            rotate: sticker.rotation,
                          }}
                          whileHover={{
                            scale: sticker.size * 1.1,
                          }}
                          drag
                          dragMomentum={false}
                          onDrag={(e, info) => {
                            if (!previewRef.current) return;
                            const rect = previewRef.current.getBoundingClientRect();
                            const x = ((info.point.x - rect.left) / rect.width) * 100;
                            const y = ((info.point.y - rect.top) / rect.height) * 100;
                            const clampedX = Math.max(0, Math.min(100, x));
                            const clampedY = Math.max(0, Math.min(100, y));
                            handleStickerMove(sticker.id, clampedX, clampedY);
                          }}
                          onClick={(e) => handleStickerClick(sticker, e)}
                        >
                          <motion.div
                            className="filter drop-shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {stickers.find(s => s.id === sticker.type)?.emoji}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        onUpdateSettings={setSettings}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        letterUrl={window.location.href}
      />

      <GenerateLetterModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerated={(generatedContent) => {
          setContent(content ? `${content}\n\n${generatedContent}` : generatedContent);
        }}
      />
    </div>
  );
}