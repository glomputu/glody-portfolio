const envValue = (value: string | undefined) => value?.trim() ?? '';

export const siteConfig = {
  owner: {
    name: 'GloDi MPUTU',
    roles: ['Software Engineer', 'Back-End Developer', 'IT Manager'],
    email: envValue(import.meta.env.VITE_OWNER_EMAIL),
    phone: envValue(import.meta.env.VITE_OWNER_PHONE),
    location: envValue(import.meta.env.VITE_OWNER_LOCATION),
  },
  social: {
    linkedIn: envValue(import.meta.env.VITE_LINKEDIN_URL),
    github: envValue(import.meta.env.VITE_GITHUB_URL),
  },
  portrait: {
    avif: '/images/profile/gm.avif',
    webp: '/api/media/profile.webp',
    fallback: '/images/profile/gm.jpg',
    source: '/images/profile/gm.jpeg',
  },
  resume: {
    fr: '/documents/GloDi-MPUTU-CV-FR.pdf',
    en: '/documents/GloDi-MPUTU-Resume-EN.pdf',
  },
  contactEndpoint: '/api/contact',
  siteUrl: envValue(import.meta.env.VITE_SITE_URL),
} as const;
