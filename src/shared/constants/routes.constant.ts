export const ROUTES = {
  HOME: '/',
  INBOX: '/inbox',

  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    DOMAINS: '/admin/domains',
    ACCOUNTS: '/admin/accounts',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
  },
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
