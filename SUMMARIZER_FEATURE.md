# Post Summarization Feature

## Overview
The post summarization feature uses the Hugging Face API to generate AI-powered summaries of blog posts. It leverages the `facebook/bart-large-cnn` model for high-quality abstractive summarization.

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Get your Hugging Face API key from: https://huggingface.co/settings/tokens
   - Add the API key to your `.env` file:
   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```

3. **Start the Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure Environment Variables**
   - Update your `.env` file with the backend API URL:
   ```
   VITE_BACKEND_API_URL=http://localhost:3000
   ```

3. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. Navigate to any blog post in your application
2. Click the "Summarize Post" button below the post title
3. Wait for the AI to generate the summary (typically 5-15 seconds)
4. The summary will appear in a blue highlighted box above the post content

## API Endpoint

### Summarize Post
- **Endpoint**: `GET /api/posts/:slug/summarize`
- **Description**: Generates a summary of the post content
- **Parameters**: 
  - `slug` (path parameter): The unique slug of the post
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "summary": "AI-generated summary text...",
      "postTitle": "The post title"
    }
  }
  ```

## Features

- **Smart Text Cleaning**: Automatically removes HTML tags from content before summarization
- **Length Optimization**: Generates concise summaries (30-150 words)
- **Error Handling**: Graceful error messages for API issues or model loading
- **Loading States**: Visual feedback during summary generation
- **Beautiful UI**: Clean, modern interface with color-coded summary display

## Technical Details

### Backend
- **Model**: facebook/bart-large-cnn (Hugging Face)
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Text Processing**: Regex-based HTML tag removal

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState)
- **API Communication**: Fetch API

## Troubleshooting

### "Model is loading" Error
If you receive this error, the Hugging Face model is initializing. Wait 30-60 seconds and try again.

### "Invalid API key" Error
Verify that:
1. Your Hugging Face API key is correct
2. The key is properly set in the `.env` file
3. You've restarted the backend server after adding the key

### CORS Issues
Ensure that:
1. The backend CORS is configured to allow requests from your frontend URL
2. The frontend `.env` has the correct backend API URL

## Future Enhancements

- [ ] Cache summaries to avoid redundant API calls
- [ ] Add summary length customization
- [ ] Support multiple summarization models
- [ ] Add summary export/share functionality
- [ ] Implement rate limiting to manage API costs
