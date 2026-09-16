import multer from 'multer';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../constants.js';

/**
 * Multer configuration for post images.
 *
 * Files are held in memory and streamed to Cloudinary by the controller rather
 * than written to disk. Hosting platforms give the app an ephemeral filesystem,
 * so anything written locally disappears on the next deploy or cold start.
 * Keeping the bytes in memory also means a request that fails validation never
 * leaves an orphaned file behind.
 */

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

export default upload;
