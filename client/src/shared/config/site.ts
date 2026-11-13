/**
 * Public site contact and brand strings.
 * Override at build time via VITE_* variables for each deployment.
 */
export const siteConfig = {
  name: 'Vaidik Theory',
  contactEmail: String(import.meta.env.VITE_CONTACT_EMAIL ?? 'consult@vaidiktheory.com'),
  contactPhone: String(import.meta.env.VITE_CONTACT_PHONE ?? '+91 98765 43210'),
  consultationHours: 'Monday–Saturday, 10:00 – 19:00 IST',
  consultationNote: 'Sunday closed, except scheduled report follow-ups.',
  social: {
    instagram: String(import.meta.env.VITE_SOCIAL_INSTAGRAM ?? 'https://www.instagram.com/'),
    facebook: String(import.meta.env.VITE_SOCIAL_FACEBOOK ?? 'https://www.facebook.com/'),
    youtube: String(import.meta.env.VITE_SOCIAL_YOUTUBE ?? 'https://www.youtube.com/'),
  },
} as const;
