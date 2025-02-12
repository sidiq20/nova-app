import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadAsImage = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return;

  try {
    const canvas = await html2canvas(elementRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      onclone: (clonedDoc, element) => {
        // Ensure stickers are visible and properly positioned
        const stickers = element.querySelectorAll('.sticker');
        stickers.forEach((sticker: any) => {
          sticker.style.transform = sticker.style.transform.replace('scale(0)', '');
        });
      }
    });

    const link = document.createElement('a');
    link.download = 'letter.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

export const downloadAsPDF = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return;

  try {
    const canvas = await html2canvas(elementRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      onclone: (clonedDoc, element) => {
        // Ensure stickers are visible and properly positioned
        const stickers = element.querySelectorAll('.sticker');
        stickers.forEach((sticker: any) => {
          sticker.style.transform = sticker.style.transform.replace('scale(0)', '');
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
    pdf.save('letter.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};