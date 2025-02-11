import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { LetterData } from '../types';

const fonts: Record<string, { family: string }> = {
  'great-vibes': { family: "'Great Vibes', cursive" },
  'dancing-script': { family: "'Dancing Script', cursive" },
  'parisienne': { family: "'Parisienne', cursive" },
  'playfair': { family: "'Playfair Display', serif" },
  'roboto': { family: "'Roboto', sans-serif" }
};

const templates: Record<string, { 
  bgImage: string;
  lineStyle: string;
  lineColor: string;
  lineSpacing: number;
}> = {
  classic: {
    bgImage: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?auto=format&fit=crop&q=80&w=2000',
    lineStyle: 'solid',
    lineColor: '#94424f',
    lineSpacing: 2.5
  },
  minimal: {
    bgImage: 'https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?auto=format&fit=crop&q=80&w=2000',
    lineStyle: 'dotted',
    lineColor: '#666666',
    lineSpacing: 2
  },
  vintage: {
    bgImage: 'https://images.unsplash.com/photo-1597336374828-43e9de844c61?auto=format&fit=crop&q=80&w=2000',
    lineStyle: 'double',
    lineColor: '#8b4513',
    lineSpacing: 3
  }
};

const stickers: Record<string, { emoji: string }> = {
  heart: { emoji: '❤️' },
  rose: { emoji: '🌹' },
  kiss: { emoji: '💋' },
  ring: { emoji: '💍' },
  dove: { emoji: '🕊️' },
  cupid: { emoji: '👼' }
};

export const generatePDF = async (letterData: LetterData) => {
  const element = document.createElement('div');
  const template = templates[letterData.template];
  
  element.innerHTML = `
    <div style="
      padding: 40px; 
      font-family: ${fonts[letterData.font].family};
      background-image: url(${template.bgImage});
      background-size: cover;
      background-position: center;
      min-height: 100vh;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.9);
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: 40px;
          background-image: repeating-linear-gradient(
            transparent,
            transparent ${template.lineSpacing - 0.1}rem,
            ${template.lineColor} ${template.lineSpacing - 0.1}rem,
            ${template.lineColor} ${template.lineSpacing}rem
          );
          opacity: 0.2;
          pointer-events: none;
        "></div>
        
        <div style="
          white-space: pre-wrap;
          font-size: 20px;
          line-height: ${template.lineSpacing}rem;
          position: relative;
          z-index: 1;
        ">${letterData.content}</div>

        ${letterData.signature ? `
          <img 
            src="${letterData.signature}" 
            style="max-width: 200px; margin-left: auto; display: block; margin-top: 20px; position: relative; z-index: 1;" 
          />
        ` : ''}

        ${letterData.stickers.map(sticker => `
          <div style="
            position: absolute;
            left: ${sticker.x}%;
            top: ${sticker.y}%;
            transform: translate(-50%, -50%) rotate(${sticker.rotation}deg);
            font-size: 2rem;
            z-index: 2;
          ">${stickers[sticker.type].emoji}</div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(element);

  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    logging: false,
    allowTaint: true,
    backgroundColor: null
  });
  document.body.removeChild(element);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('valentine-letter.pdf');
};