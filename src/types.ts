export type LetterTemplate = 'classic' | 'minimal' | 'vintage';
export type FontStyle = 'great-vibes' | 'dancing-script' | 'parisienne' | 'playfair' | 'roboto';
export type Sticker = 'heart' | 'rose' | 'kiss' | 'ring' | 'dove' | 'cupid';

export interface LetterData {
  content: string;
  template: LetterTemplate;
  signature: string;
  font: FontStyle;
  stickers: Array<{
    type: Sticker;
    x: number;
    y: number;
    rotation: number;
  }>;
}