import axios from 'axios';

const INSTAGRAM_GRAPH_API = 'https://graph.instagram.com/v18.0';

export interface IGProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

export interface IGMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface IGInsights {
  followers_count: number;
  reach: number;
  impressions: number;
  engagement: number;
  likes: number;
  saves: number;
}

export class InstagramService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Get the authenticated user's profile information
   */
  async getUserProfile(): Promise<IGProfile | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/me`, {
        params: {
          fields: 'id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count',
          access_token: this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  /**
   * Get user's media
   */
  async getUserMedia(userId: string, limit: number = 25): Promise<IGMedia[] | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${userId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,timestamp,like_count,comments_count',
          limit,
          access_token: this.accessToken
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch media:', error);
      return null;
    }
  }

  /**
   * Get insights for a specific media item
   */
  async getMediaInsights(mediaId: string): Promise<any | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${mediaId}/insights`, {
        params: {
          metric: 'engagement,impressions,reach,saved,likes,comments',
          access_token: this.accessToken
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch media insights:', error);
      return null;
    }
  }

  /**
   * Get user insights
   */
  async getUserInsights(userId: string): Promise<IGInsights | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${userId}/insights`, {
        params: {
          metric: 'impressions,reach,follower_count,profile_views,phone_clicks,text_message_clicks',
          period: 'day',
          access_token: this.accessToken
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user insights:', error);
      return null;
    }
  }

  /**
   * Search for hashtags
   */
  async searchHashtags(hashtag: string): Promise<any | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/ig_hashtag_search`, {
        params: {
          user_id: 'me',
          fields: 'id,name',
          search_string: hashtag,
          access_token: this.accessToken
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to search hashtags:', error);
      return null;
    }
  }

  /**
   * Get media metadata
   */
  async getMediaDetails(mediaId: string): Promise<IGMedia | null> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/${mediaId}`, {
        params: {
          fields: 'id,caption,media_type,media_url,timestamp,like_count,comments_count',
          access_token: this.accessToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch media details:', error);
      return null;
    }
  }

  /**
   * Publish a photo or carousel
   */
  async publishMedia(userId: string, mediaPayload: any): Promise<any | null> {
    try {
      const response = await axios.post(
        `${INSTAGRAM_GRAPH_API}/${userId}/media`,
        mediaPayload,
        {
          params: { access_token: this.accessToken }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to publish media:', error);
      return null;
    }
  }

  /**
   * Schedule a post
   */
  async schedulePost(userId: string, imageUrl: string, caption: string, scheduledTime: Date): Promise<any | null> {
    try {
      const response = await axios.post(
        `${INSTAGRAM_GRAPH_API}/${userId}/media`,
        {
          image_url: imageUrl,
          caption: caption,
          scheduled_publish_time: Math.floor(scheduledTime.getTime() / 1000),
          user_tags: []
        },
        {
          params: { access_token: this.accessToken }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to schedule post:', error);
      return null;
    }
  }

  /**
   * Verify access token validity
   */
  async verifyToken(): Promise<boolean> {
    try {
      const response = await axios.get(`${INSTAGRAM_GRAPH_API}/me`, {
        params: {
          fields: 'id',
          access_token: this.accessToken
        }
      });
      return !!response.data.id;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }
}

export default InstagramService;
