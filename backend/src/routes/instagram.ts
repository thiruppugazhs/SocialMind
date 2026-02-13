import { Router, Request, Response } from 'express';
import InstagramService from '../services/instagramService.js';

const router = Router();

// Middleware to extract access token from header
const getAccessToken = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('No access token provided');
  return authHeader.replace('Bearer ', '');
};

/**
 * GET /api/instagram/profile/:userId
 * Get user's Instagram profile
 */
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const service = new InstagramService(accessToken);
    const profile = await service.getUserProfile();
    
    if (!profile) {
      return res.status(400).json({ success: false, error: 'Failed to fetch profile' });
    }
    
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/instagram/insights/:userId
 * Get user's Instagram insights
 */
router.get('/insights/:userId', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const service = new InstagramService(accessToken);
    const insights = await service.getUserInsights(req.params.userId);
    
    res.json({ success: true, data: insights });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/instagram/media/:userId
 * Get user's media
 */
router.get('/media/:userId', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const service = new InstagramService(accessToken);
    const limit = parseInt(req.query.limit as string) || 25;
    const media = await service.getUserMedia(req.params.userId, limit);
    
    res.json({ success: true, data: media });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/instagram/publish
 * Publish a media post
 */
router.post('/publish', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const { userId, imageUrl, caption } = req.body;
    
    if (!userId || !imageUrl || !caption) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId, imageUrl, caption' 
      });
    }
    
    const service = new InstagramService(accessToken);
    const result = await service.publishMedia(userId, {
      image_url: imageUrl,
      caption: caption,
      user_tags: req.body.userTags || []
    });
    
    if (!result) {
      return res.status(400).json({ success: false, error: 'Failed to publish media' });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/instagram/schedule
 * Schedule a post for later
 */
router.post('/schedule', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const { userId, imageUrl, caption, scheduledTime } = req.body;
    
    if (!userId || !imageUrl || !caption || !scheduledTime) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }
    
    const service = new InstagramService(accessToken);
    const result = await service.schedulePost(
      userId,
      imageUrl,
      caption,
      new Date(scheduledTime)
    );
    
    if (!result) {
      return res.status(400).json({ success: false, error: 'Failed to schedule post' });
    }
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/instagram/hashtags
 * Search for hashtags
 */
router.get('/hashtags', async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessToken(req);
    const { search } = req.query;
    
    if (!search) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query required' 
      });
    }
    
    const service = new InstagramService(accessToken);
    const hashtags = await service.searchHashtags(search as string);
    
    res.json({ success: true, data: hashtags });
  } catch (error: any) {
    res.status(401).json({ success: false, error: error.message });
  }
});

export default router;
