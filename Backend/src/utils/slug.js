import Post from '../models/post.model.js';

/**
 * Slug generation.
 *
 * Slugs are a post's public identity, so they are normalised on the server
 * rather than trusted from the client: the frontend's slug field is a
 * suggestion, and a direct API call could otherwise store anything.
 */

/** Maximum slug length before the uniqueness suffix is appended. */
const MAX_SLUG_LENGTH = 80;

/**
 * Normalise arbitrary text into a URL-safe slug.
 *
 * @param {string} value
 * @returns {string} lowercase, hyphen-separated, ASCII-only
 */
export const slugify = (value) => {
  if (typeof value !== 'string') return '';

  return value
    .normalize('NFKD') // split accented characters into base + diacritic
    .replace(/[̀-ͯ]/g, '') // drop the diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // any run of non-alphanumerics becomes one hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, ''); // the slice may have left a trailing hyphen
};

/**
 * Build a slug that is not already taken, appending -2, -3, ... on collision.
 *
 * Slugs are global, so two authors writing "Hello World" would otherwise
 * collide and the second would be rejected with a 409 they cannot act on.
 *
 * @param {string} desired - Requested slug or title to derive one from.
 * @param {string} [fallback] - Used when `desired` normalises to nothing
 *   (e.g. a title that is entirely punctuation or non-Latin script).
 * @returns {Promise<string>} a slug that is free at time of checking
 */
export const generateUniqueSlug = async (desired, fallback = 'post') => {
  const base = slugify(desired) || slugify(fallback) || 'post';

  // The common case: nothing is using it.
  const taken = await Post.findOne({ slug: base }).select('_id').lean();
  if (!taken) return base;

  // Look at everything sharing the base so the next free suffix can be picked
  // in one query rather than probing one candidate at a time.
  const existing = await Post.find({ slug: new RegExp(`^${escapeRegex(base)}(-\\d+)?$`) })
    .select('slug')
    .lean();

  const used = new Set(existing.map((p) => p.slug));
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;

  return `${base}-${n}`;
};

/** Escape a string for safe use inside a RegExp. */
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default generateUniqueSlug;
