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

// The declared Content-Type is supplied by the client, so it is a hint rather
// than proof. It is checked here to reject the obvious cases early; the bytes
// themselves are verified after the upload completes (see `assertRealImage`).
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

/**
 * Magic-number signatures for the formats we accept. A file whose bytes do not
 * begin with one of these is not the image it claims to be, whatever
 * Content-Type or extension the client supplied.
 */
const IMAGE_SIGNATURES = [
  { format: 'jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    format: 'png',
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  { format: 'gif', test: (b) => b.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/) !== null },
  {
    format: 'webp',
    test: (b) =>
      b.subarray(0, 4).toString('ascii') === 'RIFF' &&
      b.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

/**
 * Verify an uploaded buffer really is one of the allowed image formats.
 *
 * @param {Buffer} buffer
 * @returns {{ok: true, format: string} | {ok: false, reason: string}}
 */
export const assertRealImage = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return { ok: false, reason: 'The uploaded file is empty or too small to be an image.' };
  }

  const match = IMAGE_SIGNATURES.find((sig) => sig.test(buffer));
  if (!match) {
    return {
      ok: false,
      reason: 'That file is not a valid JPEG, PNG, GIF or WebP image.',
    };
  }

  return { ok: true, format: match.format };
};
