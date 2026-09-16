import Post from '../models/post.model.js';
import { summarizeText } from '../utils/summarizer.js';
import { sanitizePostContent, stripTags } from '../utils/sanitize.js';
import { uploadImageBuffer, deleteImage, publicIdFromUrl } from '../utils/cloudinary.js';

/**
 * Distinguishes "the image could not be stored" from any other failure, so the
 * caller gets an actionable message rather than a generic 500.
 */
const isImageStorageError = (error) =>
  /not configured|CLOUDINARY|Image upload failed/i.test(error?.message || '');

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

    // Upload the featured image before creating the post, so a failed upload
    // never leaves a post pointing at an image that does not exist.
    let featuredImage = '';
    let featuredImagePublicId = '';
    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer);
      featuredImage = uploaded.url;
      featuredImagePublicId = uploaded.publicId;
    }

    // Sanitize author-supplied HTML before it is stored. TinyMCE filters on the
    // client only, which a direct API call bypasses entirely.
    const cleanContent = sanitizePostContent(content);
    const cleanTitle = stripTags(title);

    if (!cleanTitle || !cleanContent) {
      return res.status(400).json({
        success: false,
        message: 'Title and content must contain readable text',
      });
    }

    // Create post
    const post = await Post.create({
      title: cleanTitle,
      slug,
      content: cleanContent,
      featuredImage,
      featuredImagePublicId,
      status: status === 'inactive' ? 'inactive' : 'active',
      userId,
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    console.error('Create post error:', error);
    // An image that could not be stored is a configuration/upstream problem,
    // not a generic failure: say which, so it is actionable.
    if (isImageStorageError(error)) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }
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

    // Upload the replacement first and remember the old asset: the previous
    // image is only removed after the post has been saved successfully, so a
    // failed save can never leave the post pointing at a deleted image.
    let replacedImagePublicId = null;
    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer);
      replacedImagePublicId =
        post.featuredImagePublicId || publicIdFromUrl(post.featuredImage);
      post.featuredImage = uploaded.url;
      post.featuredImagePublicId = uploaded.publicId;
    }

    // Update fields (sanitizing anything author-supplied, as on create)
    if (title !== undefined) {
      const cleanTitle = stripTags(title);
      if (!cleanTitle) {
        return res.status(400).json({
          success: false,
          message: 'Title must contain readable text',
        });
      }
      post.title = cleanTitle;
    }
    if (content !== undefined) {
      const cleanContent = sanitizePostContent(content);
      if (!cleanContent) {
        return res.status(400).json({
          success: false,
          message: 'Content must contain readable text',
        });
      }
      post.content = cleanContent;
    }
    if (status === 'active' || status === 'inactive') post.status = status;

    await post.save();

    // Best-effort cleanup; a failure here must not fail the update.
    if (replacedImagePublicId) {
      await deleteImage(replacedImagePublicId);
    }

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    console.error('Update post error:', error);
    if (isImageStorageError(error)) {
      return res.status(502).json({
        success: false,
        message: error.message,
      });
    }
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

    // Delete the post first: an orphaned image is a far smaller problem than a
    // post whose image has been removed while the post itself survived.
    await Post.deleteOne({ _id: post._id });

    const publicId = post.featuredImagePublicId || publicIdFromUrl(post.featuredImage);
    if (publicId) {
      await deleteImage(publicId);
    }

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

    // Inactive posts are drafts: only their author may read them. Respond 404
    // rather than 403 so the existence of a draft is not disclosed.
    if (post.status !== 'active') {
      const requesterId = req.user?._id?.toString();
      const authorId = post.userId?._id ? post.userId._id.toString() : post.userId?.toString();
      if (!requesterId || requesterId !== authorId) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }
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
    const { userId } = req.query;

    // The public listing only ever returns published posts. The client used to
    // choose the status, which meant drafts were one query parameter away from
    // being public. Authors read their own drafts via /api/posts/user/my-posts.
    const query = { status: 'active' };
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

/**
 * Summarize a post using Hugging Face API
 */
export const summarizePost = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find post
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post has content
    if (!post.content || post.content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content is empty',
      });
    }

    // Generate summary
    const summary = await summarizeText(post.content);

    return res.status(200).json({
      success: true,
      data: {
        summary,
        postTitle: post.title,
      },
    });
  } catch (error) {
    console.error('Summarize post error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error summarizing post',
    });
  }
};
