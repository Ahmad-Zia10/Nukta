import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  /**
   * Create a new user account
   * @param {Object} data - {name, email, password}
   * @returns {Promise<Object>} - User data with token
   */
  async createAccount({ name, email, password }) {
    const response = await apiClient.post('/api/auth/signup', { name, email, password });
    return response.data.data; // Returns { user, token }
  },

  /**
   * Login user
   * @param {Object} data - {email, password}
   * @returns {Promise<Object>} - User data with token
   */
  async logIn({ email, password }) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data.data; // Returns { user, token }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} - Current user data
   */
  async getCurrentUser() {
    const response = await apiClient.get('/api/auth/me');
    return response.data.data.user;
  },

  /**
   * Logout user
   * @returns {Promise<Object>} - Logout response
   */
  async logout() {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },
};

// ============================================
// POST SERVICES
// ============================================

export const postService = {
  /**
   * Create a new post
   * @param {Object} data - {title, slug, content, featuredImage (File), status}
   * @returns {Promise<Object>} - Created post
   */
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('status', status || 'active');
    
    if (featuredImage instanceof File) {
      formData.append('featuredImage', featuredImage);
    }

    const response = await apiClient.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.post;
  },

  /**
   * Update a post
   * @param {string} slug - Post slug
   * @param {Object} data - {title, content, featuredImage (File), status}
   * @returns {Promise<Object>} - Updated post
   */
  async updatePost(slug, { title, content, featuredImage, status }) {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (content) formData.append('content', content);
    if (status) formData.append('status', status);
    
    if (featuredImage instanceof File) {
      formData.append('featuredImage', featuredImage);
    }

    const response = await apiClient.put(`/api/posts/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.post;
  },

  /**
   * Delete a post
   * @param {string} slug - Post slug
   * @returns {Promise<boolean>} - Success status
   */
  async deletePost(slug) {
    const response = await apiClient.delete(`/api/posts/${slug}`);
    return response.data.success;
  },

  /**
   * Get a single post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object>} - Post data
   */
  async getPost(slug) {
    const response = await apiClient.get(`/api/posts/${slug}`);
    return response.data.data.post;
  },

  /**
   * List posts with optional filters
   * @param {Object} queries - Query parameters {status: 'active'}
   * @returns {Promise<Object>} - {total, posts}
   */
  async listPosts(queries = {}) {
    // Convert queries to query string
    const params = new URLSearchParams();
    if (queries.status) params.append('status', queries.status);
    if (queries.userId) params.append('userId', queries.userId);
    
    const response = await apiClient.get(`/api/posts?${params.toString()}`);
    return response.data.data; // Returns { total, posts }
  },

  /**
   * Get posts by current user
   * @returns {Promise<Object>} - {total, posts}
   */
  async getMyPosts() {
    const response = await apiClient.get('/api/posts/user/my-posts');
    return response.data.data;
  },

  /**
   * Summarize a post by slug
   * @param {string} slug - The post slug
   * @returns {Promise<Object>} - The summary data
   */
  async summarizePost(slug) {
    const response = await apiClient.get(`/api/posts/${slug}/summarize`);
    return response.data.data; // Returns { summary, postTitle }
  },
};

// ============================================
// FILE SERVICES
// ============================================

export const fileService = {
  /**
   * Get file URL for viewing
   * @param {string} filePath - The file path from backend (e.g., /uploads/filename.jpg)
   * @returns {string} - Full URL to the file
   */
  getFileView(filePath) {
    if (!filePath) return '';
    return `${API_BASE_URL}${filePath}`;
  },
};

// Export default client for custom requests
export default apiClient;
