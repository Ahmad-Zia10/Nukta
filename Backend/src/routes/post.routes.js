import express from 'express';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  listPosts,
  getMyPosts,
  summarizePost,
} from '../controllers/post.controller.js';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.middleware.js';
import { summarizeLimiter } from '../middlewares/rateLimit.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', listPosts);
// Optional auth: an author may fetch their own draft; everyone else gets 404.
router.get('/:slug', optionalAuthenticate, getPost);
// Authenticated + rate limited: this proxies to a metered third-party API.
router.get('/:slug/summarize', authenticate, summarizeLimiter, summarizePost);

// Protected routes
router.post('/', authenticate, upload.single('featuredImage'), createPost);
router.put('/:slug', authenticate, upload.single('featuredImage'), updatePost);
router.delete('/:slug', authenticate, deletePost);
router.get('/user/my-posts', authenticate, getMyPosts);

export default router;
