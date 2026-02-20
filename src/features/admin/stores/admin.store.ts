import { createSignal } from "solid-js";
import { adminService } from "../services/admin.service";
import type { AdminUser, AdminLoginRequest } from "../types/admin.types";
import { ROUTES } from "../../../shared/constants/routes.constant";

const STORAGE_KEYS = {
  TOKEN: "admin_token",
  USER: "admin_user",
} as const;

const [token, setToken] = createSignal<string | null>(
  localStorage.getItem(STORAGE_KEYS.TOKEN),
);

const [adminUser, setAdminUser] = createSignal<AdminUser | null>(
  (() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  })(),
);

export const isAuthenticated = () => {
  return !!token() && !!adminUser();
};

export const getAdminUser = () => adminUser();

export const getToken = () => token();

export const login = async (credentials: AdminLoginRequest): Promise<void> => {
  const response = await adminService.login(credentials);
  const user: AdminUser = {
    id: 0,
    username: response.username,
    email: "",
    role: response.role,
  };

  setToken(response.token);
  setAdminUser(user);

  localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const logout = () => {
  setToken(null);
  setAdminUser(null);

  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);

  window.location.href = ROUTES.ADMIN.LOGIN;
};

export const updateUser = (updates: Partial<AdminUser>) => {
  const currentUser = adminUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...updates };
  setAdminUser(updatedUser);

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
};

export const adminStore = {
  isAuthenticated,
  getAdminUser,
  getToken,
  login,
  logout,
  updateUser,
};
