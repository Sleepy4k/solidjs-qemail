export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface AdminStats {
  total_accounts: number;
  active_accounts: number;
  total_emails: number;
  total_domains: number;
}

export interface AdminDomain {
  id: number;
  name: string;
  cloudflare_zone_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainRequest {
  name: string;
  cloudflare_zone_id?: string;
}

export interface UpdateDomainRequest {
  is_active?: boolean;
  cloudflare_zone_id?: string;
}

export interface AdminAccount {
  id: string;
  address: string;
  type: 'temporary' | 'custom';
  ip_address: string;
  created_at: string;
  expires_at?: string;
}

export interface AdminAccountsResponse {
  data: AdminAccount[];
  total: number;
  page: number;
  limit: number;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  updated_at: string;
}

export interface UpdateSettingRequest {
  key: string;
  value: string;
}
