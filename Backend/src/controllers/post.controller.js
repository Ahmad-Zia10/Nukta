import Post from '../models/post.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create a new post
 */
export const createPost = async (req, res) => {
  try {
    const { title, slug, content, status } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, and content are required',
      });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(409).json({
        success: false,
        message: 'Post with this slug already exists',
      });
    }

    // Handle featured image if uploaded
    let featuredImage = '';
    if (req.file) {
      featuredImage = `/uploads/${req.file.filename}`;
    }

    // Create post
    const post = await Post.create({
      title,
      slug,
      content,
      featuredImage,
      status: status || 'active',
      userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message,
    });
  }
};

/**
 * Update a post
 */
export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, status } = req.body;
    const userId = req.user._id;

    // Find post
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    // Handle new featured image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (post.featuredImage) {
        const oldImagePath = path.join(__dirname, '../../', post.featuredImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.featuredImage = `/uploads/${req.file.filename}`;
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (status) post.status = status;

    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    console.error('Update post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message,
    });
  }
};

/**
 * Delete a post
 */
export const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;

    // Find post
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete featured image if exists
    if (post.featuredImage) {
      const imagePath = path.join(__dirname, '../../', post.featuredImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete post
    await Post.deleteOne({ slug });

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message,
    });
  }
};

/**
 * Get a single post by slug
 */
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug }).populate('userId', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message,
    });
  }
};

/**
 * List posts with optional filters
 */
export const listPosts = async (req, res) => {
  try {
    const { status, userId } = req.query;

    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.userId = userId;
    }

    const posts = await Post.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        total: posts.length,
        posts,
      },
    });
  } catch (error) {
    console.error('List posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message,
    });
  }
};

/**
 * Get posts by current user
 */
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Post.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        total: posts.length,
        posts,
      },
    });
  } catch (error) {
    console.error('Get my posts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching your posts',
      error: error.message,
    });
  }
};
