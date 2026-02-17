import { APP_CONFIG } from '../config/app.config';

export const API_BASE_URL = APP_CONFIG.apiUrl;

export const API_ENDPOINTS = {
  ADMIN: {
    LOGIN: '/api/v1/admin/login',
    STATS: '/api/v1/admin/stats',
    DOMAINS: '/api/v1/admin/domains',
    ACCOUNTS: '/api/v1/admin/accounts',
    SETTINGS: '/api/v1/admin/settings',
  },
  
  EMAIL: {
    DOMAINS: '/api/v1/email/domains',
    GENERATE: '/api/v1/email/generate',
    LOGIN: '/api/v1/email/login',
    INBOX: '/api/v1/email/inbox',
  },
} as const;

export const API_TIMEOUT = 30000;
export const API_RETRY_COUNT = 3;
