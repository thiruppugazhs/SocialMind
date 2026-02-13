import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

/**
 * POST /api/trends/analyze
 * Analyze trends for a niche
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { niche } = req.body;
    
    if (!niche) {
      return res.status(400).json({ 
        success: false, 
        error: 'Niche parameter required' 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze current social media trends for the niche: "${niche}". 
      Identify 3 viral reel/content formats and 10 trending hashtags. 
      For each trend, provide a viral score percentage, a trending audio suggestion, and a brief insight.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Reel Format', 'Hashtag Trend', 'Video Format', 'Content Style'] },
                  viralScore: { type: Type.STRING },
                  audio: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  insight: { type: Type.STRING }
                },
                required: ['title', 'type', 'viralScore', 'audio', 'insight']
              }
            },
            globalHashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['trends', 'globalHashtags']
        }
      }
    });

    const text = response.text;
    const data = text ? JSON.parse(text) : null;

    if (!data) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to analyze trends' 
      });
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Trend analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
