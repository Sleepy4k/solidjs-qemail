import { httpService } from "./http.service";
import type {
  Domain,
  GenerateEmailRequest,
  GenerateEmailResponse,
  EmailLoginRequest,
  EmailLoginResponse,
  InboxResponse,
  EmailMessage,
  PaginationParams,
} from "../types/email.types";

class EmailService {
  private readonly baseUrl = "/api/v1/email";

  async getDomains(): Promise<Domain[]> {
    const response = await httpService.get<Domain[]>(`${this.baseUrl}/domains`);
    return response.data;
  }

  async generateEmail(data: GenerateEmailRequest): Promise<GenerateEmailResponse> {
    const response = await httpService.post<GenerateEmailResponse>(`${this.baseUrl}/generate`, data);
    return response.data;
  }

  async loginEmail(data: EmailLoginRequest): Promise<EmailLoginResponse> {
    const response = await httpService.post<EmailLoginResponse>(`${this.baseUrl}/login`, data);
    return response.data;
  }

  async getInbox(token: string, params?: PaginationParams): Promise<InboxResponse> {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const response = await httpService.get<InboxResponse>(`${this.baseUrl}/inbox/${token}${queryString}`);
    return response.data;
  }

  async getMessage(token: string, messageId: string): Promise<EmailMessage> {
    const response = await httpService.get<EmailMessage>(`${this.baseUrl}/inbox/${token}/${messageId}`);
    return response.data;
  }

  async deleteMessage(token: string, messageId: string): Promise<void> {
    await httpService.delete(`${this.baseUrl}/inbox/${token}/${messageId}`);
  }
}

export const emailService = new EmailService();
