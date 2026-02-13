import { GoogleGenAI, Type } from '@google/genai';

export class ContentGenerationService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  /**
   * Generate Instagram content using Gemini AI
   */
  async generateInstagramContent(prompt: {
    topic: string;
    target: string;
    tone: string;
  }): Promise<any | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate Instagram content for:
      Post about: ${prompt.topic}
      Target Audience: ${prompt.target}
      Tone: ${prompt.tone}
      
      Include a compelling caption, 20 trending hashtags, a full reel script (hook, body, cta), and the mathematically best time to post based on this niche.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              reelScript: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  body: { type: Type.STRING },
                  cta: { type: Type.STRING }
                }
              },
              bestPostingTime: { type: Type.STRING }
            },
            required: ['caption', 'hashtags', 'reelScript', 'bestPostingTime']
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('Content generation failed:', error);
      return null;
    }
  }

  /**
   * Generate AI reply
   */
  async generateAIReply(context: string, incomingMessage: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an AI Social Media Assistant. 
      Context: ${context}
      Incoming message: "${incomingMessage}"
      Generate a short, friendly, and helpful reply that sounds human. Use emojis. Max 2 sentences.`
      });

      return (response.text || '').trim();
    } catch (error) {
      console.error('AI reply generation failed:', error);
      return "Thanks for reaching out! We'll get back to you shortly. ✨";
    }
  }

  /**
   * Generate account audit
   */
  async generateFullAudit(stats: any): Promise<any | null> {
    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Perform a professional Instagram Account Audit for the following weekly metrics:
      Followers: ${stats.followers}
      Reach: ${stats.reach}
      Impressions: ${stats.impressions}
      Engagement Rate: ${stats.engagement}
      Likes: ${stats.likes}
      
      Provide a health score (0-100), a concise summary, 3 strengths, 3 weaknesses, and 3 high-impact recommendations for growth.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['score', 'summary', 'strengths', 'weaknesses', 'recommendations']
          }
        }
      });

      const text = response.text;
      return text ? JSON.parse(text) : null;
    } catch (error) {
      console.error('Audit generation failed:', error);
      return null;
    }
  }
}

export default ContentGenerationService;
