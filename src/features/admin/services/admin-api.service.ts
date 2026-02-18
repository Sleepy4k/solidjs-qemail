import { httpService } from "../../../shared/services/http.service";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminStats,
  AdminDomain,
  CreateDomainRequest,
  UpdateDomainRequest,
  AdminAccountsResponse,
  AdminInboxResponse,
  AdminEmailItem,
  Setting,
  UpdateSettingRequest,
  PaginationQuery,
} from "../../../shared/types/admin.types";

class AdminApiService {
  private readonly baseUrl = "/api/v1/admin";

  async getHealth(): Promise<{ status: string; uptime: number; timestamp: string }> {
    const response = await httpService.get<{ status: string; uptime: number; timestamp: string }>("/health");
    return response.data;
  }

  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await httpService.post<AdminLoginResponse>(`${this.baseUrl}/login`, data);
    return response.data;
  }

  async getStats(): Promise<AdminStats> {
    const response = await httpService.get<AdminStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  async getDomains(): Promise<AdminDomain[]> {
    const response = await httpService.get<AdminDomain[]>(`${this.baseUrl}/domains`);
    return response.data;
  }

  async createDomain(data: CreateDomainRequest): Promise<AdminDomain> {
    const response = await httpService.post<AdminDomain>(`${this.baseUrl}/domains`, data);
    return response.data;
  }

  async updateDomain(id: number, data: UpdateDomainRequest): Promise<AdminDomain> {
    const response = await httpService.patch<AdminDomain>(`${this.baseUrl}/domains/${id}`, data);
    return response.data;
  }

  async deleteDomain(id: number): Promise<void> {
    await httpService.delete(`${this.baseUrl}/domains/${id}`, {
      body: JSON.stringify({}),
    });
  }

  async getAccounts(params?: PaginationQuery): Promise<AdminAccountsResponse> {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const response = await httpService.get<AdminAccountsResponse>(`${this.baseUrl}/accounts${queryString}`);
    return response.data;
  }

  async getAccountInbox(accountId: number, params?: PaginationQuery): Promise<AdminInboxResponse> {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";
    const response = await httpService.get<AdminInboxResponse>(
      `${this.baseUrl}/accounts/${accountId}/inbox${queryString}`
    );
    return response.data;
  }

  async getAccountMessage(accountId: number, messageId: string): Promise<AdminEmailItem> {
    const response = await httpService.get<AdminEmailItem>(
      `${this.baseUrl}/accounts/${accountId}/inbox/${messageId}`
    );
    return response.data;
  }

  async getSettings(): Promise<Setting[]> {
    const response = await httpService.get<Setting[]>(`${this.baseUrl}/settings`);
    return response.data;
  }

  async updateSetting(data: UpdateSettingRequest): Promise<Setting> {
    const response = await httpService.put<Setting>(`${this.baseUrl}/settings`, data);
    return response.data;
  }
}

export const adminApiService = new AdminApiService();
