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
    // Try DeepSeek first
    if (import.meta.env.VITE_DEEPSEEK_API_KEY) {
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
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
          })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (error) {
        console.warn('DeepSeek error, falling back to OpenAI:', error);
      }
    }

    // Try OpenAI second
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true
        });

        const completion = await openai.chat.completions.create({
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

        const content = completion.choices[0]?.message?.content;
        if (content) return content;
      } catch (error) {
        console.warn('OpenAI error, falling back to HuggingFace:', error);
      }
    }

    // Fallback to HuggingFace
    if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      throw new Error('No API keys configured');
    }

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

    let text = response.generated_text;
    text = text.replace(/\[INST\].*?\[\/INST\]/s, '').trim();
    text = text.replace(/<s>|<\/s>/g, '').trim();

    if (!text) {
      throw new Error('Empty response from AI');
    }

    return text;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}