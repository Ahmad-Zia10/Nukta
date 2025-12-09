const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

/**
 * Summarize a post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object>} - The summary data
 */
export const summarizePost = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/posts/${slug}/summarize`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to summarize post');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
