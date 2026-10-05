import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    // Cloudinary public id for `featuredImage`, kept so the remote asset can be
    // deleted without having to parse it back out of the delivery URL.
    featuredImagePublicId: {
      type: String,
      default: '',
    },
    // Cached AI summary. The summarizer calls a metered third-party API, so the
    // result is stored and reused until the content changes.
    summary: {
      type: String,
      default: '',
    },
    summaryGeneratedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// `slug` already has an index from `unique: true`; declaring it again makes
// Mongoose warn about a duplicate.
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
