import axios from 'axios';

// The old serverless host (api-inference.huggingface.co) has been retired --
// its DNS no longer resolves -- and was replaced by the Inference Providers
// router. Overridable so the model can be swapped without a code change.
const SUMMARIZATION_MODEL =
  process.env.HUGGINGFACE_SUMMARIZATION_MODEL || 'facebook/bart-large-cnn';
const SUMMARIZATION_ENDPOINT =
  process.env.HUGGINGFACE_SUMMARIZATION_URL ||
  `https://router.huggingface.co/hf-inference/models/${SUMMARIZATION_MODEL}`;

/**
 * Summarize text using Hugging Face API
 * Uses the facebook/bart-large-cnn model for summarization
 * @param {string} text - The text to summarize
 * @returns {Promise<string>} - The summarized text
 */
export const summarizeText = async (text) => {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      throw new Error('Hugging Face API key is not configured');
    }

    // Remove HTML tags from content for better summarization
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // Limit text length to avoid API limitations (max ~1024 tokens for most models)
    const maxLength = 4000; // Approximate character limit
    const textToSummarize = cleanText.length > maxLength 
      ? cleanText.substring(0, maxLength) + '...'
      : cleanText;

    const response = await axios.post(
      SUMMARIZATION_ENDPOINT,
      {
        inputs: textToSummarize,
        parameters: {
          max_length: 150,
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Handle response format
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].summary_text || response.data[0].generated_text;
    }

    throw new Error('Unexpected response format from Hugging Face API');
  } catch (error) {
    console.error('Summarization error:', error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 503) {
      throw new Error('Summarization model is loading. Please try again in a few moments.');
    }

    if (error.response?.status === 401) {
      throw new Error('Invalid Hugging Face API key');
    }

    if (error.response?.status === 403) {
      throw new Error(
        'This Hugging Face token cannot call Inference Providers. Give the token ' +
          'the "Make calls to Inference Providers" permission, or use a Read token.'
      );
    }

    if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      throw new Error('Could not reach the summarization service.');
    }

    throw new Error(error.message || 'Failed to summarize text');
  }
};
