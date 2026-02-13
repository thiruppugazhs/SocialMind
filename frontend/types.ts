export type Platform = 'instagram' | 'x' | 'facebook' | 'linkedin';
export type ContactCategory = 'business' | 'friends';
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
  url?: string;
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

// API Response Types
export interface IGUserProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  profile_picture_url?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export interface IGInsights {
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  likes: number;
  saves: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
