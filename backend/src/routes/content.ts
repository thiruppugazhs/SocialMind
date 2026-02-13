import { Router, Request, Response } from 'express';
import ContentGenerationService from '../services/contentService.js';

const router = Router();

/**
 * POST /api/content/generate
 * Generate Instagram content using AI
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topic, target, tone } = req.body;
    
    if (!topic || !target || !tone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: topic, target, tone' 
      });
    }
    
    const service = new ContentGenerationService();
    const content = await service.generateInstagramContent({
      topic,
      target,
      tone
    });
    
    if (!content) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to generate content' 
      });
    }
    
    res.json({ success: true, data: content });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai/reply
 * Generate AI reply for a message
 */
router.post('/reply', async (req: Request, res: Response) => {
  try {
    const { context, incomingMessage } = req.body;
    
    if (!context || !incomingMessage) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: context, incomingMessage' 
      });
    }
    
    const service = new ContentGenerationService();
    const reply = await service.generateAIReply(context, incomingMessage);
    
    res.json({ success: true, data: { reply } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
