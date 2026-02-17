export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'QEmail - Temporary Email Service',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
} as const;
