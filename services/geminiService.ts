
import { GoogleGenAI, Type } from "@google/genai";
import { IGContentResponse, IGTrend } from "../types";

export interface IGAuditResponse {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// Initializing ai inside each function to ensure the latest API key is used from process.env.API_KEY
export const generateInstagramContent = async (prompt: {
  topic: string;
  target: string;
  tone: string;
}): Promise<IGContentResponse | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate Instagram content for:
      Post about: ${prompt.topic}
      Target Audience: ${prompt.target}
      Tone: ${prompt.tone}
      
      Include a compelling caption, 20 trending hashtags, a full reel script (hook, body, cta), and the mathematically best time to post based on this niche.`,
      config: {
        responseMimeType: "application/json",
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
          required: ["caption", "hashtags", "reelScript", "bestPostingTime"]
        }
      }
    });

    // Safely extract text output from response property
    const text = response.text;
    return text ? (JSON.parse(text) as IGContentResponse) : null;
  } catch (error) {
    console.error("Gemini content generation failed:", error);
    return null;
  }
};

export const getTrendingTrends = async (niche: string): Promise<{trends: IGTrend[], globalHashtags: string[]} | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze current social media trends for the niche: "${niche}". 
      Identify 3 viral reel/content formats and 10 trending hashtags. 
      For each trend, provide a viral score percentage, a trending audio suggestion, and a brief insight.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["Reel Format", "Hashtag Trend", "Video Format", "Content Style"] },
                  viralScore: { type: Type.STRING },
                  audio: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  insight: { type: Type.STRING }
                },
                required: ["title", "type", "viralScore", "audio", "insight"]
              }
            },
            globalHashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["trends", "globalHashtags"]
        }
      }
    });

    // Safely extract text output from response property
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Trend hunting failed:", error);
    return null;
  }
};

export const generateAIReply = async (context: string, incomingMessage: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an AI Social Media Assistant. 
      Context: ${context}
      Incoming message: "${incomingMessage}"
      Generate a short, friendly, and helpful reply that sounds human. Use emojis. Max 2 sentences.`,
    });
    // response.text is a property, returning string | undefined
    return (response.text || '').trim();
  } catch (error) {
    return "Thanks for reaching out! We'll get back to you shortly. ✨";
  }
};

export const generateFullAudit = async (stats: any): Promise<IGAuditResponse | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a professional Instagram Account Audit for the following weekly metrics:
      Followers: ${stats.followers}
      Reach: ${stats.reach}
      Impressions: ${stats.impressions}
      Engagement Rate: ${stats.engagement}
      Likes: ${stats.likes}
      
      Provide a health score (0-100), a concise summary, 3 strengths, 3 weaknesses, and 3 high-impact recommendations for growth.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "summary", "strengths", "weaknesses", "recommendations"]
        }
      }
    });

    // Safely extract text output from response property
    const text = response.text;
    return text ? (JSON.parse(text) as IGAuditResponse) : null;
  } catch (error) {
    console.error("Audit generation failed:", error);
    return null;
  }
};
