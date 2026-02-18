export interface Domain {
  id: number;
  name: string;
}

export interface GenerateEmailRequest {
  domain_id: number;
  username?: string;
  password?: string;
  is_custom?: boolean;
  forward_to?: string;
}

export interface GenerateEmailResponse {
  email: string;
  session_token: string;
  token: string | null;
  expires_at: string;
}

export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface EmailLoginResponse {
  token: string;
  email: string;
  session_token: string;
}

export interface EmailMessage {
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

export interface EmailMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface InboxResponse {
  data: EmailMessage[];
  meta: EmailMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
