# Nukta Backend

A custom Node.js/Express backend for the Nukta blogging application, replacing Appwrite services.

## Features

- ✅ JWT-based authentication
- ✅ User registration and login
- ✅ Post CRUD operations
- ✅ Image upload with Multer
- ✅ MongoDB database with Mongoose
- ✅ CORS and cookie-based sessions
- ✅ Centralized error handling

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use existing)
3. Click "Connect" on your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Paste the connection string in `.env` file as `MONGODB_URI`

### 3. Environment Variables

Create a `.env` file in the Backend directory (use `.env.example` as reference):
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/signup
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

### Post Endpoints

#### Create Post
```
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- title: "My Blog Post"
- slug: "my-blog-post"
- content: "Post content here..."
- status: "active" (or "inactive")
- featuredImage: [file]
```

#### Get All Posts
```
GET /api/posts
Query params (optional):
- status: "active" or "inactive"
- userId: "user_id"
```

#### Get Single Post
```
GET /api/posts/:slug
```

#### Get My Posts
```
GET /api/posts/user/my-posts
Authorization: Bearer <token>
```

#### Update Post
```
PUT /api/posts/:slug
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (form-data):
- title: "Updated Title"
- content: "Updated content..."
- status: "active"
- featuredImage: [file] (optional)
```

#### Delete Post
```
DELETE /api/posts/:slug
Authorization: Bearer <token>
```

### Health Check
```
GET /health
```

## Project Structure

```
Backend/
├── src/
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   └── post.controller.js
│   ├── db/                  # Database connection
│   │   └── index.js
│   ├── middlewares/         # Custom middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── models/              # Mongoose models
│   │   ├── user.model.js
│   │   └── post.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   └── post.routes.js
│   ├── utils/               # Utility functions
│   │   └── jwt.js
│   ├── app.js               # Express app configuration
│   ├── constants.js         # App constants
│   └── index.js             # Entry point
├── uploads/                 # Uploaded images
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── readme.md
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing
- **cookie-parser** - Cookie handling

## Migration from Appwrite

This backend replaces the following Appwrite services:
- **Authentication** - Now using JWT tokens
- **Database** - Now using MongoDB
- **Storage** - Now using local file system with Multer

The API structure mirrors the original Appwrite implementation for easier frontend migration.
