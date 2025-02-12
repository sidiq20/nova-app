import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';

interface GenerateLetterParams {
  prompt: string;
  context?: string;
}

export async function generateLetter({
  prompt,
  context = ''
}: GenerateLetterParams): Promise<string> {
  try {
    // Try OpenAI first if API key is available
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that writes thoughtful, personal letters. Your responses should be warm, genuine, and well-structured."
            },
            {
              role: "user",
              content: `Previous context:\n${context}\n\nWrite a letter response for: ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        return response.choices[0]?.message?.content || '';
      } catch (error) {
        console.warn('OpenAI error, falling back to HuggingFace:', error);
      }
    }

    // Always fallback to HuggingFace if OpenAI fails or is not configured
    const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

    const response = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      inputs: `<s>[INST] Write a thoughtful letter response.

Previous context:
${context}

Request: ${prompt}

Write a well-structured, coherent response that would be appropriate for a letter. [/INST]</s>`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.2,
        do_sample: true
      }
    });

    // Clean up the response
    let text = response.generated_text;
    text = text.replace(/\[INST\].*?\[\/INST\]/s, '').trim();
    text = text.replace(/<s>|<\/s>/g, '').trim();

    return text;
  } catch (error) {
    console.error('AI generation error:', error);
    return "I apologize, but I'm having trouble generating content right now. You can try writing your message manually, or try again later.";
  }
}