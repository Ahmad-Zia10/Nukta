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
import { authenticate } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', listPosts);
router.get('/:slug', getPost);
router.get('/:slug/summarize', summarizePost);

// Protected routes
router.post('/', authenticate, upload.single('featuredImage'), createPost);
router.put('/:slug', authenticate, upload.single('featuredImage'), updatePost);
router.delete('/:slug', authenticate, deletePost);
router.get('/user/my-posts', authenticate, getMyPosts);

export default router;
