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
  total_emails: number;
  total_domains: number;
  active_accounts: number;
}

export interface AdminDomain {
  id: number;
  name: string;
  cloudflare_zone_id: string | null;
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
  id: number;
  email_address: string;
  domain_id: number;
  domain_name: string;
  is_custom: boolean;
  ip_address: string | null;
  expires_at: string | null;
  created_at: string;
  email_count?: number;
}

export interface AdminAccountsResponse {
  accounts: AdminAccount[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AdminEmailItem {
  id: number;
  message_id: string;
  sender: string;
  sender_name: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  is_read: boolean;
  received_at: string;
}

export interface AdminInboxResponse {
  account: {
    id: number;
    email_address: string;
    domain_name: string;
    is_custom: boolean;
  };
  emails: AdminEmailItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface UpdateSettingRequest {
  key: string;
  value: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}
