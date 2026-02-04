// API Configuration
// Change this to your backend subdomain URL after deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (password: string) =>
    apiCall<{ success: boolean; token: string; expiresIn: number }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  verify: () =>
    apiCall<{ valid: boolean }>('/api/auth/verify', {
      method: 'POST',
    }),
};

// Posts API
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  author_id: number;
  author_name?: string;
  author_avatar?: string;
  tags: string[];
  keywords: string[];
  youtube_id?: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export const postsApi = {
  getAll: (params?: { category?: string; featured?: boolean; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.featured) query.set('featured', 'true');
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    return apiCall<Post[]>(`/api/posts?${query}`);
  },
  getTrending: () => apiCall<Post[]>('/api/posts/trending'),
  getBySlug: (slug: string) => apiCall<Post>(`/api/posts/${slug}`),
  getStats: () => apiCall<{ totalPosts: number; totalViews: number; totalCategories: number; totalVideos: number }>('/api/posts/stats/overview'),
  create: (post: Partial<Post>) =>
    apiCall<{ id: number; message: string }>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    }),
  update: (id: number, post: Partial<Post>) =>
    apiCall<{ message: string }>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    }),
  delete: (id: number) =>
    apiCall<{ message: string }>(`/api/posts/${id}`, {
      method: 'DELETE',
    }),
};

// Categories API
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  post_count: number;
  created_at: string;
}

export const categoriesApi = {
  getAll: () => apiCall<Category[]>('/api/categories'),
  getBySlug: (slug: string) => apiCall<Category>(`/api/categories/${slug}`),
  create: (category: Partial<Category>) =>
    apiCall<{ id: number; message: string }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  update: (id: number, category: Partial<Category>) =>
    apiCall<{ message: string }>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),
  delete: (id: number) =>
    apiCall<{ message: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
    }),
};

// YouTube API
export interface YouTubeVideo {
  id: number;
  video_id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  views: string;
  is_live: boolean;
  display_order: number;
  created_at: string;
}

export const youtubeApi = {
  getAll: (params?: { category?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.limit) query.set('limit', String(params.limit));
    return apiCall<YouTubeVideo[]>(`/api/youtube?${query}`);
  },
  create: (video: Partial<YouTubeVideo>) =>
    apiCall<{ id: number; message: string }>('/api/youtube', {
      method: 'POST',
      body: JSON.stringify(video),
    }),
  update: (id: number, video: Partial<YouTubeVideo>) =>
    apiCall<{ message: string }>(`/api/youtube/${id}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    }),
  delete: (id: number) =>
    apiCall<{ message: string }>(`/api/youtube/${id}`, {
      method: 'DELETE',
    }),
};

// Live Stream API
export interface LiveSettings {
  id: number;
  channel_id: string;
  live_video_id: string;
  live_url: string;
  is_live: boolean;
  live_title: string;
  updated_at: string;
}

export const liveApi = {
  getSettings: () => apiCall<LiveSettings>('/api/live'),
  updateSettings: (settings: Partial<LiveSettings>) =>
    apiCall<{ message: string }>('/api/live', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  goLive: (video_id: string, title?: string) =>
    apiCall<{ message: string }>('/api/live/go-live', {
      method: 'POST',
      body: JSON.stringify({ video_id, title }),
    }),
  endLive: () =>
    apiCall<{ message: string }>('/api/live/end-live', {
      method: 'POST',
    }),
};

// Health check
export const healthApi = {
  check: () => apiCall<{ status: string; database: string }>('/api/health'),
};
