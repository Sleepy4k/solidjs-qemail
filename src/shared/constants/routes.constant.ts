export const ROUTES = {
  HOME: "/",
  INBOX: "/inbox",
  EMAIL_LOGIN: "/inbox/login",

  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin",
    DOMAINS: "/admin/domains",
    ACCOUNTS: "/admin/accounts",
    SETTINGS: "/admin/settings",
    LOGS: "/admin/logs",
  },
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
