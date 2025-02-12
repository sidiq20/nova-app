import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface GenerateLetterParams {
  recipient: string;
  occasion?: string;
  tone?: 'romantic' | 'playful' | 'poetic' | 'formal';
  length?: 'short' | 'medium' | 'long';
}

export async function generateLetter({
  recipient,
  occasion = 'love letter',
  tone = 'romantic',
  length = 'medium'
}: GenerateLetterParams): Promise<string> {
  try {
    // First try OpenAI
    try {
      const completion = await openai.chat.completions.create({
        messages: [{
          role: "system",
          content: "You are an expert love letter writer who can create beautiful, heartfelt messages."
        }, {
          role: "user",
          content: `Write a ${length} ${tone} love letter for ${recipient}${occasion ? ` for ${occasion}` : ''}.`
        }],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI error:', error);

      // Fallback to HuggingFace
      const response = await hf.textGeneration({
        model: 'gpt2',
        inputs: `Dear ${recipient},\n\nThis is a ${tone} love letter for ${occasion}:\n\n`,
        parameters: {
          max_new_tokens: length === 'short' ? 100 : length === 'medium' ? 200 : 300,
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      return response.generated_text;
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate letter. Please try again.');
  }
}