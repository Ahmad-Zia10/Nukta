<div align="center">
  <h1>✍️ Nukta</h1>
  <p><strong>A modern, full-stack blogging platform built with React and Node.js</strong></p>
  
  ![License](https://img.shields.io/badge/license-ISC-blue.svg)
  ![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
  ![React](https://img.shields.io/badge/react-19.0.0-61dafb.svg)
  ![Express](https://img.shields.io/badge/express-5.1.0-lightgrey.svg)
  ![MongoDB](https://img.shields.io/badge/mongodb-8.0-green.svg)

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>

---

## 📖 About

**Nukta** is a feature-rich blogging platform that allows users to create, edit, and share blog posts with rich text formatting and image uploads. Originally built with Appwrite, it has been migrated to a custom Node.js/Express backend for greater flexibility and control.

### 🎯 Key Highlights

- **Custom Backend**: Migrated from Appwrite to a production-ready Node.js/Express API
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Rich Text Editor**: Powered by TinyMCE for a seamless writing experience
- **Image Management**: Built-in file upload system with size and type validation
- **State Management**: Redux Toolkit for predictable state updates
- **Modern UI**: Built with React 19 and Tailwind CSS

---

## ✨ Features

### User Features
- 📝 **Rich Text Editor** - Create beautiful blog posts with TinyMCE
- 🖼️ **Image Uploads** - Featured images with automatic optimization
- 👤 **User Authentication** - Secure signup, login, and session management
- 📊 **Personal Dashboard** - Manage all your posts in one place
- 🔍 **Post Discovery** - Browse and search through published posts
- ⚡ **Real-time Updates** - Instant content updates across the platform

### Technical Features
- 🔐 **JWT Authentication** - Secure, stateless authentication
- 🗄️ **MongoDB Database** - Scalable NoSQL database with Mongoose ODM
- 📦 **File Storage** - Local file system with Multer middleware
- 🚀 **RESTful API** - Clean, well-documented API endpoints
- 🛡️ **Input Validation** - Comprehensive validation and sanitization
- ⚠️ **Error Handling** - Centralized error handling with detailed responses
- 🌐 **CORS Support** - Configurable cross-origin resource sharing
- 🔄 **State Management** - Redux Toolkit for client-side state

---

## 🛠️ Tech Stack

### Frontend
```
React 19.0        - UI Library
Redux Toolkit     - State Management
React Router 7    - Client-side routing
TailwindCSS 4     - Utility-first CSS
TinyMCE          - Rich text editor
React Hook Form  - Form validation
Vite 6           - Build tool & dev server
```

### Backend
```
Node.js          - Runtime environment
Express 5        - Web framework
MongoDB          - NoSQL database
Mongoose 8       - ODM for MongoDB
JWT              - Authentication tokens
bcryptjs         - Password hashing
Multer 2         - File upload handling
CORS             - Cross-origin support
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmad-Zia10/Nukta.git
   cd Nukta
   ```

2. **Backend Setup**

   Navigate to the backend directory:
   ```bash
   cd Backend
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Configure environment variables in `.env`:
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

   Start the backend server:
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:3000`

3. **Frontend Setup**

   Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Create `.env` file:
   ```bash
   cp .env.example .env
   ```

   Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

4. **Access the Application**

   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
Nukta/
├── Backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   └── post.controller.js
│   │   ├── db/               # Database connection
│   │   │   └── index.js
│   │   ├── middlewares/      # Custom middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   └── post.model.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.js
│   │   │   └── post.routes.js
│   │   ├── utils/            # Utility functions
│   │   │   └── jwt.js
│   │   ├── app.js           # Express app setup
│   │   ├── constants.js     # App constants
│   │   └── index.js         # Entry point
│   ├── uploads/             # Uploaded files
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── readme.md
│
├── Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md                # This file
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Post Endpoints

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "My Blog Post"
- slug: "my-blog-post"
- content: "Post content with HTML..."
- status: "active"
- featuredImage: [file]
```

#### Get All Posts
```http
GET /api/posts?status=active&userId=...
```

#### Get Single Post
```http
GET /api/posts/:slug
```

#### Update Post
```http
PUT /api/posts/:slug
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Post
```http
DELETE /api/posts/:slug
Authorization: Bearer <token>
```

#### Get User's Posts
```http
GET /api/posts/user/my-posts
Authorization: Bearer <token>
```

For complete API documentation, see [Backend README](Backend/readme.md).

---

## 🔒 Security

### Implemented Security Features

- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **HTTP-only Cookies** - Prevents XSS attacks
- ✅ **CORS Configuration** - Whitelist allowed origins
- ✅ **Input Validation** - Mongoose schema validation
- ✅ **File Type Validation** - Only allowed image formats
- ✅ **File Size Limits** - Max 5MB per upload
- ✅ **SQL Injection Protection** - MongoDB query sanitization

### Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Regular dependency updates** - Keep packages up to date
5. **Environment-specific configs** - Different settings for dev/prod

---

## 🌍 Deployment

### Backend Deployment (Railway / Render / Heroku)

1. **Set environment variables** in your hosting platform:
   ```
   PORT=3000
   MONGODB_URI=<your-mongodb-atlas-uri>
   NODE_ENV=production
   JWT_SECRET=<strong-secret-key>
   JWT_EXPIRY=7d
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Deploy commands:**
   ```bash
   npm install
   npm start
   ```

3. **Configure static file serving** for uploaded images

### Frontend Deployment (Vercel / Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Set environment variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

3. **Deploy** the `dist` folder

### MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your application IP addresses
3. Create a database user
4. Get the connection string and add to `.env`

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

### API Testing
Use tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- [Insomnia](https://insomnia.rest/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Ahmad Zia**
- GitHub: [@Ahmad-Zia10](https://github.com/Ahmad-Zia10)

---

## 🙏 Acknowledgments

- [TinyMCE](https://www.tiny.cloud/) for the rich text editor
- [MongoDB](https://www.mongodb.com/) for the database
- [React](https://react.dev/) team for the amazing framework
- [Express](https://expressjs.com/) community for the web framework

---

## 📞 Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/Ahmad-Zia10/Nukta/issues)
- Contact via email: [your-email@example.com]

---

<div align="center">
  <p>Made with ❤️ and ☕</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
