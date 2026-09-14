import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize post body HTML before it is stored.
 *
 * Post content is authored in TinyMCE and rendered on the client with
 * `html-react-parser`, which does not escape anything. TinyMCE's own filtering
 * is client-side only and is bypassed entirely by posting straight to the API,
 * so the allowlist below is the only thing standing between an author and
 * stored XSS affecting every reader.
 *
 * The allowlist is built to preserve what the configured TinyMCE toolbar can
 * actually produce (headings, lists, links, images, tables, alignment and
 * forecolor) and drop everything else.
 */

// Inline styles the editor emits via the alignment / forecolor controls.
// Anything not listed here is stripped, so `style` cannot be used to smuggle
// behaviour (e.g. `expression()`, `url(javascript:...)`).
const allowedStyles = {
  '*': {
    'text-align': [/^(left|right|center|justify)$/],
    color: [/^#(0x)?[0-9a-f]+$/i, /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/i],
    'background-color': [
      /^#(0x)?[0-9a-f]+$/i,
      /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/i,
    ],
  },
};

const options = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'div', 'span',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sub', 'sup', 'mark',
    'blockquote', 'pre', 'code',
    'ul', 'ol', 'li',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
  ],

  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    td: ['colspan', 'rowspan', 'style'],
    th: ['colspan', 'rowspan', 'scope', 'style'],
    col: ['span', 'width'],
    table: ['style'],
    '*': ['style'],
  },

  // Block `javascript:` and friends. `data:` is excluded for href so that
  // `data:text/html` cannot be used as a navigation payload.
  allowedSchemes: ['http', 'https', 'mailto'],
  // Inline base64 images are how TinyMCE pastes screenshots, so allow data:
  // for image sources only.
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  allowProtocolRelative: false,

  allowedStyles,

  // Drop the contents of these outright rather than leaving orphaned text.
  nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript'],

  transformTags: {
    // Any link that opens a new tab must not hand the opener over to the
    // destination page, and external links should not pass referrer data.
    a: (tagName, attribs) => {
      const out = { ...attribs };
      if (out.target === '_blank') {
        out.rel = 'noopener noreferrer';
      }
      return { tagName, attribs: out };
    },
  },
};

/**
 * @param {string} html - Untrusted HTML from the editor.
 * @returns {string} HTML safe to store and render.
 */
export const sanitizePostContent = (html) => {
  if (typeof html !== 'string' || html.length === 0) return '';
  return sanitizeHtml(html, options);
};

/**
 * Strip every tag, leaving only text. Used for fields that are rendered as
 * plain text (titles) but could still be fed HTML by a direct API call.
 *
 * @param {string} value
 * @returns {string}
 */
export const stripTags = (value) => {
  if (typeof value !== 'string' || value.length === 0) return '';
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
};

export default sanitizePostContent;
