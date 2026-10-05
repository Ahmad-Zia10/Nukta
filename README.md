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
- 📝 **Rich Text Editor** - Write posts with TinyMCE
- 🖼️ **Image Uploads** - Featured images stored on Cloudinary and served from its CDN
- 👤 **User Authentication** - Signup, login and sessions via httpOnly cookies
- 📊 **My Posts** - Your own posts in one place, drafts included
- 📄 **Drafts** - Save a post as inactive; only its author can see it
- 🤖 **AI Summaries** - Generate a summary of any post (cached after the first run)
- 📑 **Pagination** - Paged listings on the home page and your dashboard

### Technical Features
- 🔐 **JWT Authentication** - Signed tokens delivered only as httpOnly cookies
- 🗄️ **MongoDB Database** - Mongoose ODM
- ☁️ **Cloud File Storage** - Cloudinary, so images survive redeploys
- 🚀 **RESTful API** - Consistent `{ success, message, data }` envelope
- 🧼 **HTML Sanitization** - Post bodies are sanitized server-side before storage
- 🚦 **Rate Limiting** - On auth endpoints, the summarizer, and the API overall
- ⚠️ **Error Handling** - Centralized error middleware
- 🔄 **State Management** - Redux Toolkit with RTK Query

### Not implemented yet
- Full-text search
- Comments
- Tags or categories
- Password reset / email verification
- Server-side rendering (so per-post link previews and SEO are limited)

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

- ✅ **Password Hashing** - bcryptjs, hashed in a Mongoose pre-save hook
- ✅ **JWT Authentication** - Token issued only as an httpOnly cookie, never in the response body
- ✅ **Same-origin Cookies** - `sameSite=strict`; the API is proxied under the app's own origin
- ✅ **Stored XSS Protection** - Post HTML sanitized with an allowlist before it is stored
- ✅ **Draft Privacy** - Unpublished posts 404 for everyone except their author
- ✅ **Rate Limiting** - Failed logins throttled; summarizer and API capped
- ✅ **File Type Validation** - Declared MIME type *and* magic-number byte check
- ✅ **File Size Limits** - Max 10MB per upload
- ✅ **Ownership Checks** - Only a post's author may edit or delete it

### Known gaps

- No CSRF token. Protection currently relies on `sameSite=strict` and the
  same-origin setup; a cross-origin deployment would need one.
- Logout is client-side only. A stolen token stays valid until it expires,
  since there is no server-side revocation list.
- No email verification, so addresses are unconfirmed.

### Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Regular dependency updates** - Keep packages up to date
5. **Environment-specific configs** - Different settings for dev/prod

---

## 🌍 Deployment

The frontend and backend deploy separately, but the browser only ever talks to
**one origin**: Vercel rewrites `/api/*` through to the backend. That keeps the
auth cookie first-party, so it can stay `sameSite=strict` and CORS never enters
the picture.

### 1. MongoDB Atlas

1. Create a cluster and a database user.
2. Network Access → allow `0.0.0.0/0`. Free hosting tiers have no static
   outbound IP, so there is no narrower option; the database password is the
   real access control.
3. Copy the connection string. It must **not** end with the database name —
   `src/db/index.js` appends `/Nukta` itself.

### 2. Cloudinary

Create a free account and copy `CLOUDINARY_URL` from the dashboard
(Product Environment Credentials). Images are uploaded straight there, so no
persistent disk is needed on the API host.

### 3. Backend (Render)

`Backend/render.yaml` is a Render blueprint: **New → Blueprint →** pick this
repo and it fills in the service for you.

Secrets to supply in the dashboard:

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | Atlas connection string |
| `FRONTEND_URL` | The Vercel URL (CORS fallback only) |
| `HUGGINGFACE_API_KEY` | Needs the *Make calls to Inference Providers* permission |
| `CLOUDINARY_URL` | `cloudinary://<key>:<secret>@<cloud_name>` |

`JWT_SECRET` is generated by Render; `NODE_ENV=production` is set by the
blueprint, which switches on `secure` cookies and `trust proxy`.

Verify with `curl https://<service>.onrender.com/health`. On the free tier the
first request after an idle period takes ~50s to wake the instance.

### 4. Point the proxy at the backend

In `Frontend/vercel.json`, replace `REPLACE-WITH-BACKEND-HOST` with the Render
hostname. The `/api` rule **must** stay above the SPA catch-all, or every API
call returns `index.html`.

### 5. Frontend (Vercel)

Import the repo with `Frontend` as the root directory, then set:

| Variable | Value |
| --- | --- |
| `VITE_BACKEND_API_URL` | **empty** (or leave it unset) |
| `VITE_TINYMCE_API_KEY` | Your TinyMCE cloud key |

A non-empty `VITE_BACKEND_API_URL` sends requests cross-origin and the auth
cookie is dropped — you will appear to log in and then be logged out on the
next request. Vite inlines env vars at build time, so redeploy after changing
them.

---

## 🔧 Troubleshooting

### Port already in use

```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### Generating a JWT secret

Use a different random secret per environment:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### MongoDB connection failures

- Check `MONGODB_URI` in `Backend/.env`. It should **not** end with the database
  name — `src/db/index.js` appends `/Nukta` itself.
- Confirm your IP is allowed under MongoDB Atlas → Network Access.

### Logged out after every refresh

`VITE_BACKEND_API_URL` is set to a non-empty value. The app is served
same-origin: `/api` is proxied to the backend (Vercel rewrites in production,
the Vite dev proxy locally), which keeps the auth cookie first-party. Setting an
absolute URL sends requests cross-origin, and the `sameSite=strict` cookie is
then dropped. Leave the variable empty.

### `/api/*` returns the HTML page instead of JSON

The rewrite in `Frontend/vercel.json` is missing, still contains the
`REPLACE-WITH-BACKEND-HOST` placeholder, or is ordered after the SPA catch-all.
The `/api` rule must come first.

### Image upload fails with "Image storage is not configured"

Set `CLOUDINARY_URL` (or `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_CLOUD_API_KEY` +
`CLOUDINARY_CLOUD_API_SECRET`) in `Backend/.env` and restart the server.

### Summarization returns 403

The Hugging Face token is missing the **Make calls to Inference Providers**
permission. Edit it at <https://huggingface.co/settings/tokens>, or use a Read
token.

---

## 🧪 Testing

### Automated tests

There are none yet. `npm test` in `Backend/` is still the npm placeholder that
exits with an error, and the frontend has no test runner configured. Adding a
suite is the most useful next contribution.

What *is* wired up:

```bash
cd Frontend
npm run lint     # ESLint, currently clean
npm run build    # production build
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

<div align="center">
  <p>Made with ❤️ and ☕</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
