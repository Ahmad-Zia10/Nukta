# Frontend Migration: Appwrite → Backend API with RTK Query

## Overview
This document outlines the complete migration from Appwrite BaaS to a custom Node.js/Express backend with MongoDB, using RTK Query for state management and API calls.

## What Changed

### Architecture
- **Before**: Frontend → Appwrite Cloud Services
- **After**: Frontend → Custom Backend API → MongoDB

### Technology Stack
- **Removed**: Appwrite SDK
- **Added**: RTK Query (from Redux Toolkit)
- **Kept**: axios (for potential custom requests)

## Key Improvements

### 1. **RTK Query Integration**
- Automatic caching and invalidation
- Built-in loading and error states
- Optimistic updates support
- Automatic refetching on focus/reconnect
- Better TypeScript support (if migrated)

### 2. **Backend Features**
- Cookie-based authentication (httpOnly cookies)
- JWT token management
- File upload handling with multer
- MongoDB for data persistence
- Hugging Face AI integration for post summarization

### 3. **API Structure**

#### Auth Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Post Endpoints
- `GET /api/posts` - List all posts (with filters)
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:slug` - Update post (authenticated)
- `DELETE /api/posts/:slug` - Delete post (authenticated)
- `GET /api/posts/user/my-posts` - Get user's posts (authenticated)
- `GET /api/posts/:slug/summarize` - AI summarize post

## Migration Steps Performed

### 1. Dependencies
```bash
npm install axios  # Already had it
npm uninstall appwrite  # Removed Appwrite
```

### 2. Created RTK Query API Slice
**File**: `Frontend/src/store/apiSlice.js`

Features:
- Centralized API configuration
- Auto-generated hooks for all endpoints
- Request/response transformations
- Tag-based cache invalidation

### 3. Updated Redux Store
**File**: `Frontend/src/store/store.js`

Added RTK Query middleware and reducer

### 4. Updated Components

#### Auth Components
- `Login.jsx` - Uses `useLoginMutation`
- `SignUp.jsx` - Uses `useSignupMutation`
- `LogoutBtn.jsx` - Uses `useLogoutMutation`

#### Post Components
- `PostForm.jsx` - Uses `useCreatePostMutation` & `useUpdatePostMutation`
- `PostCard.jsx` - Uses `getFileView` helper

#### Pages
- `App.jsx` - Uses `useLazyGetCurrentUserQuery`
- `Home.jsx` - Uses `useListPostsQuery`
- `AllPosts.jsx` - Uses `useListPostsQuery`
- `Post.jsx` - Uses `useGetPostQuery`, `useDeletePostMutation`, `useLazySummarizePostQuery`
- `EditPost.jsx` - Uses `useGetPostQuery`

### 5. Data Model Changes

#### User Object
```javascript
// Before (Appwrite)
{
  $id: "...",
  email: "...",
  name: "..."
}

// After (Backend)
{
  _id: "...",
  email: "...",
  name: "...",
  createdAt: "..."
}
```

#### Post Object
```javascript
// Before (Appwrite)
{
  $id: "...",
  title: "...",
  content: "...",
  featuredImage: "fileId",
  status: "active",
  userId: "userId"
}

// After (Backend)
{
  _id: "...",
  slug: "post-slug",
  title: "...",
  content: "...",
  featuredImage: "/uploads/filename.jpg",
  status: "active",
  userId: { _id: "...", name: "...", email: "..." },
  createdAt: "...",
  updatedAt: "..."
}
```

### 6. Removed Files/Folders
- `Frontend/src/appwrite/` - All Appwrite service files
- `Frontend/src/config/` - Appwrite configuration
- `Frontend/src/services/api.js` - Old axios service (replaced by RTK Query)
- `Frontend/public/` - Unused Appwrite-related files

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

4. Start the backend:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
VITE_BACKEND_API_URL=http://localhost:3000
```

4. Start the frontend:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Auth state persists on refresh
- [ ] Create new post with image upload
- [ ] View all posts
- [ ] View single post detail
- [ ] Edit own post
- [ ] Delete own post
- [ ] Post summarization feature works
- [ ] Only post authors can edit/delete their posts
- [ ] File uploads display correctly
- [ ] Loading states show properly
- [ ] Error messages display appropriately

## RTK Query Benefits

### 1. **Automatic Caching**
```javascript
// First call - fetches from API
const { data } = useGetPostQuery('my-slug');

// Second call with same slug - returns cached data
const { data } = useGetPostQuery('my-slug');
```

### 2. **Automatic Refetching**
RTK Query automatically refetches data when:
- Window regains focus
- Network reconnects
- Manual invalidation via tags

### 3. **Optimistic Updates** (can be added)
```javascript
// Update UI immediately, rollback on error
const [updatePost] = useUpdatePostMutation();
await updatePost({ slug, ...data });
```

### 4. **Loading States**
```javascript
const { data, isLoading, isError, error } = useGetPostQuery(slug);

if (isLoading) return <Loading />;
if (isError) return <Error message={error.message} />;
return <Post data={data} />;
```

## Troubleshooting

### CORS Issues
Ensure backend CORS is configured for frontend URL:
```javascript
// Backend: src/app.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Cookie Issues
Ensure:
1. `credentials: 'include'` in RTK Query config
2. `httpOnly` cookies enabled in backend
3. Same domain or proper CORS for cookies

### Image Upload Issues
Check:
1. `multer` configured correctly in backend
2. `uploads/` directory exists
3. FormData sent with correct headers

## Future Enhancements

1. **TypeScript Migration**: Add type safety
2. **Infinite Scrolling**: For post lists
3. **Real-time Updates**: WebSockets for live data
4. **Optimistic Updates**: Better UX for mutations
5. **Offline Support**: RTK Query + Service Workers
6. **Image Optimization**: Compress before upload
7. **Pagination**: Backend + frontend pagination
8. **Search**: Full-text search with MongoDB

## Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
