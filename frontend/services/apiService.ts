import axios, { AxiosInstance } from 'axios';
import { IGContentResponse, IGTrend, APIResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('instagram_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Instagram Content Generation
export const generateInstagramContent = async (prompt: {
  topic: string;
  target: string;
  tone: string;
}): Promise<IGContentResponse | null> => {
  try {
    const response = await apiClient.post<APIResponse<IGContentResponse>>(
      '/content/generate',
      prompt
    );
    return response.data.data || null;
  } catch (error) {
    console.error('Content generation failed:', error);
    return null;
  }
};

// Get Trending Trends
export const getTrendingTrends = async (niche: string): Promise<{trends: IGTrend[], globalHashtags: string[]} | null> => {
  try {
    const response = await apiClient.post<APIResponse<{trends: IGTrend[], globalHashtags: string[]}>>(
      '/trends/analyze',
      { niche }
    );
    return response.data.data || null;
  } catch (error) {
    console.error('Trend hunting failed:', error);
    return null;
  }
};

// Generate AI Reply
export const generateAIReply = async (context: string, incomingMessage: string): Promise<string> => {
  try {
    const response = await apiClient.post<APIResponse<{reply: string}>>(
      '/ai/reply',
      { context, incomingMessage }
    );
    return (response.data.data?.reply || '').trim();
  } catch (error) {
    console.error('AI reply generation failed:', error);
    return "Thanks for reaching out! We'll get back to you shortly. ✨";
  }
};

// Generate Account Audit
export interface IGAuditResponse {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const generateFullAudit = async (stats: any): Promise<IGAuditResponse | null> => {
  try {
    const response = await apiClient.post<APIResponse<IGAuditResponse>>(
      '/analytics/audit',
      stats
    );
    return response.data.data || null;
  } catch (error) {
    console.error('Audit generation failed:', error);
    return null;
  }
};

// Instagram API Methods
export const getInstagramProfile = async (userId: string) => {
  try {
    const response = await apiClient.get(`/instagram/profile/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return null;
  }
};

export const getInstagramInsights = async (userId: string) => {
  try {
    const response = await apiClient.get(`/instagram/insights/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch insights:', error);
    return null;
  }
};

export const publishInstagramPost = async (accessToken: string, payload: any) => {
  try {
    const response = await apiClient.post('/instagram/publish', { accessToken, payload });
    return response.data.data;
  } catch (error) {
    console.error('Failed to publish post:', error);
    return null;
  }
};

export const getInstagramMedia = async (userId: string) => {
  try {
    const response = await apiClient.get(`/instagram/media/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return null;
  }
};

export const scheduleInstagramPost = async (payload: any) => {
  try {
    const response = await apiClient.post('/instagram/schedule', payload);
    return response.data.data;
  } catch (error) {
    console.error('Failed to schedule post:', error);
    return null;
  }
};

export default apiClient;
