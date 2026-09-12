# Nukta App - Development Guide

## Quick Start

### Option 1: Run Everything Together (Recommended)
From the Frontend directory:
```bash
cd Frontend
npm start
```

This will start both:
- Backend server on `http://localhost:3000`
- Frontend server on `http://localhost:5173`

### Option 2: Run Separately
**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

## Environment Setup

Copy the example files and fill in your own values. Never commit real
credentials — `.env` files are gitignored for this reason.

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

### Backend (`Backend/.env`)
See `Backend/.env.example` for the full list. Required:

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `3000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `NODE_ENV` | `development` or `production` |
| `JWT_SECRET` | Signing secret — generate a random one per environment |
| `JWT_EXPIRY` | Token lifetime (e.g. `7d`) |
| `FRONTEND_URL` | Allowed CORS origin |
| `HUGGINGFACE_API_KEY` | API key for the post summarizer |

Generate a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Frontend (`Frontend/.env`)
See `Frontend/.env.example`. Required: `VITE_BACKEND_API_URL`.

## Available Scripts

### Frontend
- `npm start` - Run both frontend & backend concurrently
- `npm run dev` - Run frontend only
- `npm run server` - Run backend only
- `npm run client` - Alias for dev
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Run with nodemon (auto-reload)
- `npm start` - Run production mode

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - List all posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:slug` - Update post (protected)
- `DELETE /api/posts/:slug` - Delete post (protected)
- `GET /api/posts/user/my-posts` - Get user's posts (protected)

## Tech Stack

### Frontend
- React 19
- Vite 6
- Redux Toolkit (RTK Query)
- React Router v7
- TailwindCSS v4
- TinyMCE Editor
- React Hook Form

### Backend
- Node.js
- Express 5
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)

## Troubleshooting

### Ports Already in Use
```bash
# Windows PowerShell - Kill process on port
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### MongoDB Connection Issues
- Check if MongoDB URI is correct in `Backend/.env`
- Ensure IP whitelist includes your IP in MongoDB Atlas

### CORS Errors
- Verify `FRONTEND_URL` in `Backend/.env` matches frontend URL
- Check that credentials are included in API requests
