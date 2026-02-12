
export type Platform = 'instagram' | 'x' | 'facebook' | 'linkedin';
export type ContactCategory = 'business' | 'friends' | 'general';
export type AutomationActionType = 'like' | 'comment' | 'dm' | 'block';

export interface IGContentResponse {
  caption: string;
  hashtags: string[];
  reelScript: {
    hook: string;
    body: string;
    cta: string;
  };
  bestPostingTime: string;
}

export interface IGAutomationItem {
  id: string;
  type: 'dm' | 'comment' | 'like' | 'block';
  user: string;
  category: ContactCategory;
  message?: string;
  aiSuggestedReply?: string;
  status: 'pending' | 'replied' | 'flagged' | 'auto_sent' | 'completed';
  timestamp: string;
  url?: string; // Link to the specific post or DM thread
}

export interface IGContact {
  id: string;
  username: string;
  category: ContactCategory;
  avatar: string;
}

export interface IGTrend {
  title: string;
  type: 'Reel Format' | 'Hashtag Trend' | 'Video Format' | 'Content Style';
  viralScore: string;
  audio: string;
  hashtags: string[];
  insight: string;
}

export type View = 'platform-selector' | 'ig-dashboard' | 'ig-scheduler' | 'ig-automation' | 'ig-analytics' | 'ig-trends' | 'ig-chat';
