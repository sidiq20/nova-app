import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadAsImage = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return;

  const canvas = await html2canvas(elementRef.current, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
    onclone: (clonedDoc, element) => {
      const stickers = element.querySelectorAll('[draggable="true"]');
      stickers.forEach((sticker: any) => {
        sticker.style.opacity = '1';
        sticker.style.visibility = 'visible';
      });
    }
  });

  const link = document.createElement('a');
  link.download = 'valentine-letter.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const downloadAsPDF = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return;

  const canvas = await html2canvas(elementRef.current, {
    useCORS: true,
    scale: 2,
    backgroundColor: null,
    onclone: (clonedDoc, element) => {
      const stickers = element.querySelectorAll('[draggable="true"]');
      stickers.forEach((sticker: any) => {
        sticker.style.opacity = '1';
        sticker.style.visibility = 'visible';
      });
    }
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('valentine-letter.pdf');
};