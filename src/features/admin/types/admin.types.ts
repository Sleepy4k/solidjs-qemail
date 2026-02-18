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
  cf_api_token?: string;
  cf_account_id?: string;
  cf_worker_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDomainRequest {
  name: string;
  cloudflare_zone_id?: string;
  cf_api_token?: string;
  cf_account_id?: string;
  cf_worker_name?: string;
}

export interface UpdateDomainRequest {
  is_active?: boolean;
  cloudflare_zone_id?: string;
  cf_api_token?: string;
  cf_account_id?: string;
  cf_worker_name?: string;
}

export interface CfRule {
  id: string;
  type: string;
  enabled: boolean;
  pattern?: string;
  action?: string;
  [key: string]: unknown;
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

export interface AdminLog {
  id: number;
  actor_type: 'user' | 'admin' | 'system';
  actor_id: string | null;
  actor_label: string;
  action: string;
  status: 'success' | 'failure';
  resource_type: string;
  resource_id: string;
  meta: Record<string, unknown>;
  ip_address: string;
  error: string | null;
  created_at: string;
}

export interface AdminLogsMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AdminLogsResponse {
  data: AdminLog[];
  meta: AdminLogsMeta;
}

export type LogSortField = 'created_at' | 'action' | 'actor_label' | 'status';
export type SortDir = 'asc' | 'desc';
export type LogActorType = 'user' | 'admin' | 'system';
export type LogStatus = 'success' | 'failure';
