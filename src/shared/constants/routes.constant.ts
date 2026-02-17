export const ROUTES = {
  HOME: '/',
  INBOX: '/inbox',

  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    DOMAINS: '/admin/domains',
    ACCOUNTS: '/admin/accounts',
    SETTINGS: '/admin/settings',
  },
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
