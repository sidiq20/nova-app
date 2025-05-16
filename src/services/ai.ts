import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';

interface GenerateLetterParams {
  prompt: string;
  context?: string;
}

// Fallback template responses when external APIs fail
const fallbackLetterTemplates = [
  {
    type: 'love',
    content: `My Dearest,

As I sit down to write this letter, I find myself overwhelmed with the depth of my feelings for you. Every day with you is a gift that I cherish more than words can express.

Your smile brightens even my darkest days, and your laughter is the sweetest melody I've ever heard. The way you understand me, sometimes better than I understand myself, makes me feel truly seen and appreciated.

I promise to stand by your side through all of life's joys and challenges, to be your biggest supporter and most honest friend. The journey we're on together is the greatest adventure of my life.

With all my heart and soul,
[Your Name]`
  },
  {
    type: 'friendship',
    content: `Dear Friend,

Some people come into our lives and leave footprints on our hearts, and you have certainly left yours on mine. I wanted to take a moment to express how much your friendship means to me.

Through laughter and tears, celebrations and challenges, you've been there with unwavering support and genuine care. Your kindness, wisdom, and the way you always know just what to say have made such a difference in my life.

Thank you for being the amazing person you are, for accepting me with all my flaws, and for making this journey called life so much more meaningful.

With gratitude and affection,
[Your Name]`
  },
  {
    type: 'gratitude',
    content: `Dear [Recipient],

I've been reflecting lately on the people who have made a significant impact on my life, and you are certainly among them. I wanted to express my heartfelt gratitude for everything you've done.

Your generosity, kindness, and support have meant more to me than you may ever know. The way you [specific action or quality] has inspired me and helped me grow in ways I never expected.

Sometimes the most important things go unsaid, but today I want you to know that I appreciate you deeply and am truly thankful that our paths have crossed in this life.

With sincere appreciation,
[Your Name]`
  },
  {
    type: 'general',
    content: `Dear [Recipient],

I hope this letter finds you well. I've been thinking about you lately and felt compelled to put my thoughts into words.

Life moves so quickly sometimes that we forget to pause and express what's in our hearts. Today, I wanted to take that pause and let you know how much you matter.

Your presence in my life has been a source of [joy/strength/inspiration], and I'm grateful for every moment we've shared. The way you [specific quality or action] continues to impress and move me.

I look forward to many more meaningful moments together in the future.

Warmest regards,
[Your Name]`
  },
  {
    type: 'encouragement',
    content: `Dear [Recipient],
  
  I know things might be tough right now, but I want you to remember how strong and resilient you are. You've faced challenges before and come through them with grace, and I believe in you completely.
  
  Sometimes we all need a reminder that storms don’t last forever—and there’s always light ahead. You’ve got this, and I’m here cheering you on every step of the way.
  
  With unwavering belief in you,
  [Your Name]`
  },
  {
    type: 'apology',
    content: `Dear [Recipient],
  
  I'm writing this letter to say I'm truly sorry. I know that I hurt you, and that was never my intention. Looking back, I can see how my actions affected you, and I deeply regret it.
  
  I value our relationship and hope we can find a path forward. Please know that I'm committed to making things right and learning from this.
  
  With remorse and sincerity,
  [Your Name]`
  },
  {
    type: 'congratulations',
    content: `Dear [Recipient],
  
  Congratulations on your amazing accomplishment! Your hard work, dedication, and passion have truly paid off, and I couldn't be happier for you.
  
  This milestone is just one of many more to come. Keep reaching for the stars—you’ve shown that you have everything it takes to shine.
  
  Proudly cheering you on,
  [Your Name]`
  },
  {
    type: 'birthday',
    content: `Dear [Recipient],
  
  Happy Birthday! Today is a celebration of you—your life, your journey, and everything that makes you the wonderful person you are.
  
  May this year bring you laughter, love, and all the beautiful moments your heart desires. Here's to many more amazing birthdays to come.
  
  Warm wishes,
  [Your Name]`
  },
  {
    type: 'sympathy',
    content: `Dear [Recipient],
  
  I was heartbroken to hear about your loss. Please accept my deepest condolences during this difficult time.
  
  There are no perfect words, but know that you are surrounded by love and support. I'm here for you, whether you need a shoulder to lean on or someone to simply sit beside you in silence.
  
  With heartfelt sympathy,
  [Your Name]`
  },
  {
    type: 'new_beginning',
    content: `Dear [Recipient],
  
  A new chapter is unfolding for you, and I couldn’t be more excited to see where it leads. Every ending brings with it a new beginning, full of potential and promise.
  
  Embrace this transition with courage and curiosity. I’ll be cheering you on every step of the way.
  
  To fresh starts and bold steps,
  [Your Name]`
  },
  {
    type: 'appreciation',
    content: `Dear [Recipient],
  
  I just wanted to take a moment to say thank you. Your presence in my life has made such a positive impact, and I don't say it enough—I appreciate you more than words can express.
  
  Whether it's your constant support, your patience, or just your smile, you make life better.
  
  With heartfelt thanks,
  [Your Name]`
  },
  {
    type: 'just_because',
    content: `Dear [Recipient],
  
  No special occasion—just a letter from me to you to say I'm thinking of you. Sometimes the best notes come for no reason at all, and this is one of them.
  
  You're important to me, and I hope today brings a moment of peace and a reason to smile.
  
  Fondly,
  [Your Name]`
  },
  {
    type: 'farewell',
    content: `Dear [Recipient],
  
  Saying goodbye is never easy, but I wanted to leave you with words from the heart. Our time together has meant so much to me, and the memories we’ve created will stay with me always.
  
  As you step into a new chapter, I wish you joy, growth, and every kind of success. This isn’t the end—just a new beginning.
  
  With all my best,
  [Your Name]`
  },
  {
    type: 'motivation',
    content: `Dear [Recipient],
  
  I know you’ve been working so hard lately, and I just wanted to send you a note of encouragement. You have what it takes to achieve your goals, and I believe in you completely.
  
  Keep pushing forward—your efforts are not in vain. Every step brings you closer to your dreams.
  
  You’ve got this,
  [Your Name]`
  },
  {
    type: 'reflection',
    content: `Dear [Recipient],
  
  I’ve been doing some thinking lately, and you’ve come to mind more than once. Sometimes, we move so quickly that we forget to appreciate how far we’ve come—and who’s been with us along the way.
  
  Thank you for being part of my journey. You’ve made it richer, fuller, and more meaningful.
  
  With gratitude,
  [Your Name]`
  },
  {
    type: 'long_distance',
    content: `Dear [Recipient],
  
  Even though we’re miles apart, please know that you're close to my heart every single day. Distance can’t change how much you mean to me.
  
  Until we meet again, I’ll carry your smile with me and count the days until we’re together.
  
  With love across the miles,
  [Your Name]`
  },
  {
    type: 'get_well',
    content: `Dear [Recipient],
  
  I heard you’re not feeling your best, and I just wanted to send a little sunshine your way. Take all the time you need to rest and heal—you deserve all the care in the world.
  
  Wishing you comfort, strength, and a speedy recovery.
  
  Warm hugs,
  [Your Name]`
  },
  {
    type: 'admiration',
    content: `Dear [Recipient],
  
  I just wanted to say how much I admire you. The way you handle challenges, the way you care for others, and your unwavering strength truly inspire me.
  
  You are someone who makes a difference, and I hope you know how deeply you are appreciated.
  
  With deep respect,
  [Your Name]`
  },
  {
    type: 'welcome',
    content: `Dear [Recipient],
  
  Welcome! Whether this is a new home, a new role, or a new chapter, I’m thrilled to have you here. I’m excited for all the great things that lie ahead and grateful to be part of this moment with you.
  
  Here’s to new beginnings and bright futures.
  
  Warmly,
  [Your Name]`
  },
  {
    type: 'missing_you',
    content: `Dear [Recipient],
  
  I’ve been thinking about you a lot lately and just wanted to say—I miss you. Life isn’t quite the same without your energy and presence.
  
  I hope we can reconnect soon, but until then, know you’re in my heart.
  
  Fondly,
  [Your Name]`
  },
  {
    type: 'forgiveness',
    content: `Dear [Recipient],
  
  I’ve been reflecting on the past, and I want to ask for your forgiveness. I know I’ve made mistakes, and I’m truly sorry for the hurt I’ve caused.
  
  I hope we can move forward with honesty and renewed understanding. You matter to me deeply.
  
  Humbly,
  [Your Name]`
  },
  {
    type: 'support',
    content: `Dear [Recipient],
  
  Whatever you're going through, I want you to know that you're not alone. I'm here for you—not just in words, but in action, for as long as you need.
  
  Lean on me. I’ve got your back.
  
  With care and solidarity,
  [Your Name]`
  },
  {
    type: 'holiday',
    content: `Dear [Recipient],
  
  Wishing you peace, joy, and all the warmth this holiday season brings. I hope it’s a time of reflection, connection, and creating beautiful memories.
  
  May the coming year be filled with love and good fortune.
  
  Season's greetings,
  [Your Name]`
  },
  {
    type: 'inspiration',
    content: `Dear [Recipient],
  
  You have so much light within you—don’t ever forget that. The world is better because you’re in it, and your potential is limitless.
  
  Whatever you're striving for, keep going. You’re capable of more than you know.
  
  With belief in you,
  [Your Name]`
  }  
    
];

// Helper function to get a template based on prompt keywords
function getFallbackTemplate(prompt: string): string {
  prompt = prompt.toLowerCase();
  
  if (prompt.includes('love') || prompt.includes('romantic') || prompt.includes('partner') || 
      prompt.includes('girlfriend') || prompt.includes('boyfriend') || prompt.includes('spouse') || 
      prompt.includes('wife') || prompt.includes('husband')) {
    return fallbackLetterTemplates.find(t => t.type === 'love')?.content || fallbackLetterTemplates[3].content;
  }
  
  if (prompt.includes('friend') || prompt.includes('friendship') || prompt.includes('buddy') || 
      prompt.includes('pal') || prompt.includes('mate')) {
    return fallbackLetterTemplates.find(t => t.type === 'friendship')?.content || fallbackLetterTemplates[3].content;
  }
  
  if (prompt.includes('thank') || prompt.includes('grateful') || prompt.includes('appreciate') || 
      prompt.includes('gratitude')) {
    return fallbackLetterTemplates.find(t => t.type === 'gratitude')?.content || fallbackLetterTemplates[3].content;
  }
  
  return fallbackLetterTemplates.find(t => t.type === 'general')?.content || fallbackLetterTemplates[3].content;
}

export async function generateLetter({
  prompt,
  // Using context in the prompt if provided
  context = ''
}: GenerateLetterParams): Promise<string> {
  // Track if we've tried all external services
  let externalServicesAttempted = false;
  
  try {
    // Try HuggingFace first with Mistral-7B-Instruct
    if (import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      try {
        const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

        // Try Mistral-7B-Instruct first
        try {
          const response = await hf.textGeneration({
            model: 'mistralai/Mistral-7B-Instruct-v0.1',
            inputs: `[INST] You are a thoughtful and empathetic letter writer. Write a heartfelt letter that is:
- Genuine and personal
- Emotionally resonant
- Well-structured
- Appropriate for the relationship
- Focused on expressing authentic feelings

Write a letter for this context: ${prompt} [/INST]`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              top_p: 0.9,
              repetition_penalty: 1.2,
              do_sample: true
            }
          });

          if (response.generated_text) {
            return response.generated_text.trim();
          }
        } catch (mistralError) {
          console.warn('Mistral model error, trying Llama:', mistralError);

          // Try Llama-2 as fallback
          try {
            const response = await hf.textGeneration({
              model: 'meta-llama/Llama-2-7b-chat-hf',
              inputs: `<s>[INST] <<SYS>> You are a thoughtful letter writer who creates genuine, emotionally resonant messages. <</SYS>>
Write a heartfelt letter for this context: ${prompt} [/INST]`,
              parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                repetition_penalty: 1.2,
                do_sample: true
              }
            });

            if (response.generated_text) {
              return response.generated_text.trim();
            }
          } catch (llamaError) {
            console.warn('Llama model error, trying Bloom:', llamaError);

            // Final HuggingFace attempt with Bloom
            try {
              const response = await hf.textGeneration({
                model: 'bigscience/bloom',
                inputs: `Write a heartfelt letter that expresses genuine emotions and personal connection. Context: ${prompt}`,
                parameters: {
                  max_new_tokens: 500,
                  temperature: 0.7,
                  top_p: 0.9,
                  repetition_penalty: 1.2,
                  do_sample: true
                }
              });

              if (response.generated_text) {
                return response.generated_text.trim();
              }
            } catch (bloomError) {
              console.warn('Bloom model error:', bloomError);
            }
          }
        }
      } catch (error) {
        console.warn('HuggingFace error, falling back to OpenAI:', error);
      }
    }

    // Try OpenAI as fallback
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
              content: `You are an empathetic letter-writing assistant who creates:
- Genuine and heartfelt messages
- Emotionally resonant content
- Well-structured and clear writing
- Personal and meaningful expressions
- Appropriate tone for the relationship
Always focus on authentic emotional connection.`
            },
            {
              role: "user",
              content: `Write a heartfelt letter for this context: ${prompt}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        const content = completion.choices[0]?.message?.content;
        if (content) return content;
      } catch (error) {
        console.warn('OpenAI error, falling back to DeepSeek:', error);
      }
    }

    // Try DeepSeek as final external API fallback
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
                content: "You are an empathetic letter writer who creates genuine, emotionally resonant messages."
              },
              {
                role: "user",
                content: `Write a heartfelt letter for this context: ${prompt}`
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) return content;
        } else {
          console.warn('DeepSeek error:', await response.text());
        }
      } catch (error) {
        console.warn('DeepSeek error:', error);
      }
    }

    // Mark that we've tried all external services
    externalServicesAttempted = true;
    
    // If all external services failed, use our fallback template system
    console.log('All external AI services failed, using fallback template');
    return getFallbackTemplate(prompt);
    
  } catch (error) {
    console.error('AI generation error:', error);
    
    // If we haven't tried the fallback yet, use it
    if (externalServicesAttempted) {
      return getFallbackTemplate(prompt);
    }
    
    throw new Error('Failed to generate letter content. Please try again later.');
  }
}