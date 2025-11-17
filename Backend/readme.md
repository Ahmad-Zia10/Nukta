# Nukta Backend

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

Create a `.env` file in the Backend directory:
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
NODE_ENV=development
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

## Project Structure

```
Backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── db/            # Database connection
│   ├── middlewares/   # Custom middlewares
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── app.js         # Express app configuration
│   ├── constants.js   # App constants
│   └── index.js       # Entry point
├── .env               # Environment variables
└── package.json
```
