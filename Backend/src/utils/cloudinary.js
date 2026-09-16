import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary configuration and helpers.
 *
 * Images used to be written to `Backend/uploads` on local disk. Hosting
 * platforms give the app an ephemeral filesystem, so that directory is wiped on
 * every deploy and every cold start, taking every uploaded image with it.
 * Uploading straight to Cloudinary keeps images independent of the app's
 * lifecycle and serves them from a CDN.
 *
 * Configuration comes from CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud>),
 * which the SDK reads on its own, or from the three discrete variables below.
 */

// Both spellings are accepted: Cloudinary's dashboard labels these "API Key"
// and "API Secret", but it is natural to prefix them with CLOUDINARY_CLOUD_,
// and silently ignoring one spelling is a confusing way to fail.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_CLOUD_API_KEY;
const apiSecret =
  process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_CLOUD_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  // Falls back to CLOUDINARY_URL, which the SDK reads from the environment.
  cloudinary.config({ secure: true });
}

/** Folder all post images live under, so the Cloudinary media library stays tidy. */
export const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || 'nukta/posts';

/**
 * True when the SDK has enough configuration to talk to Cloudinary. Lets the
 * callers fail with a clear message instead of a confusing SDK error.
 */
export const isCloudinaryConfigured = () => {
  const { cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret } = cloudinary.config();
  return Boolean(cloudName && apiKey && apiSecret);
};

/**
 * Upload an in-memory file buffer to Cloudinary.
 *
 * @param {Buffer} buffer - File contents, from multer's memory storage.
 * @param {object} [options]
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImageBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      reject(new Error('Image storage is not configured. Set CLOUDINARY_URL.'));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: 'image',
        // Strip any embedded scripts/metadata and normalise very large uploads.
        transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message || 'Image upload failed'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });

/**
 * Delete a previously uploaded image. Never throws: a failed cleanup must not
 * fail the request that triggered it, since the post change itself succeeded.
 *
 * @param {string} publicId
 * @returns {Promise<boolean>} whether the delete was accepted
 */
export const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured()) return false;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    return result?.result === 'ok' || result?.result === 'not found';
  } catch (error) {
    console.error('Cloudinary delete failed:', error.message);
    return false;
  }
};

/**
 * Recover the Cloudinary public id from a stored secure URL, for images saved
 * before the public id was persisted alongside them.
 *
 * @param {string} url
 * @returns {string|null}
 */
export const publicIdFromUrl = (url) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return null;

  // .../upload/v1234567890/<folder>/<name>.<ext>  ->  <folder>/<name>
  const match = /\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i.exec(url);
  return match ? match[1] : null;
};

export default cloudinary;
