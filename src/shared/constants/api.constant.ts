import { APP_CONFIG } from '../config/app.config';

export const API_BASE_URL = APP_CONFIG.apiUrl;

export const API_ENDPOINTS = {
  ADMIN: {
    LOGIN: '/v1/admin/login',
    STATS: '/v1/admin/stats',
    DOMAINS: '/v1/admin/domains',
    ACCOUNTS: '/v1/admin/accounts',
    SETTINGS: '/v1/admin/settings',
    LOGS: '/v1/admin/logs',
  },
  
  EMAIL: {
    DOMAINS: '/v1/email/domains',
    GENERATE: '/v1/email/generate',
    LOGIN: '/v1/email/login',
    INBOX: '/v1/email/inbox',
  },
} as const;

export const API_TIMEOUT = 30000;
export const API_RETRY_COUNT = 3;
