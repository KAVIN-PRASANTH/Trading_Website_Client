// Dynamically discover all feedback screenshot images in public/feedback
const feedbackGlob = import.meta.glob('/public/feedback/*.{jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Extract the URL strings and strip leading '/public' if present
const globUrls = (Object.values(feedbackGlob) as string[]).map((url) =>
  url.startsWith('/public/') ? url.replace(/^\/public/, '') : url
)

// Fallback list of known feedback images in case glob behaves differently in production vs dev
const fallbackUrls = [
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.16.06 PM (1).jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.16.06 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.17.21 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.18.32 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.18.56 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.21.29 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.24.00 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.24.39 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.31.59 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.32.02 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.32.12 PM.jpeg'),
  '/feedback/' + encodeURIComponent('WhatsApp Image 2026-09-13 at 10.32.21 PM.jpeg'),
]

export const FEEDBACK_IMAGE_URLS: string[] =
  globUrls.length > 0 ? globUrls : fallbackUrls
