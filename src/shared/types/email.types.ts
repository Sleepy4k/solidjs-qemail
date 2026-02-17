export interface Domain {
  id: number;
  name: string;
}

export interface GenerateEmailRequest {
  domain_id: number;
  username?: string;
  password?: string;
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
  recipient: string;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  raw_headers: string | null;
  is_read: boolean;
  received_at: string;
}

export interface InboxResponse {
  emails: EmailMessage[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
