import { httpService } from '../../../shared/services/http.service';
import { API_ENDPOINTS } from '../../../shared/constants/api.constant';
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminStats,
  AdminDomain,
  CreateDomainRequest,
  UpdateDomainRequest,
  AdminAccountsResponse,
  Setting,
  UpdateSettingRequest,
} from '../types/admin.types';

class AdminService {
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await httpService.post<AdminLoginResponse>(
      API_ENDPOINTS.ADMIN.LOGIN,
      data
    );
    return response.data;
  }

  async getStats(): Promise<AdminStats> {
    const response = await httpService.get<AdminStats>(API_ENDPOINTS.ADMIN.STATS);
    return response.data;
  }

  async listDomains(): Promise<AdminDomain[]> {
    const response = await httpService.get<AdminDomain[]>(API_ENDPOINTS.ADMIN.DOMAINS);
    return response.data;
  }

  async createDomain(data: CreateDomainRequest): Promise<AdminDomain> {
    const response = await httpService.post<AdminDomain>(
      API_ENDPOINTS.ADMIN.DOMAINS,
      data
    );
    return response.data;
  }

  async updateDomain(id: number, data: UpdateDomainRequest): Promise<AdminDomain> {
    const response = await httpService.patch<AdminDomain>(
      `${API_ENDPOINTS.ADMIN.DOMAINS}/${id}`,
      data
    );
    return response.data;
  }

  async deleteDomain(id: number): Promise<void> {
    await httpService.delete(`${API_ENDPOINTS.ADMIN.DOMAINS}/${id}`, {
      body: JSON.stringify({}),
    });
  }

  async listAccounts(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<AdminAccountsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await httpService.get<AdminAccountsResponse>(
      `${API_ENDPOINTS.ADMIN.ACCOUNTS}?${params.toString()}`
    );
    return response.data;
  }

  async getSettings(): Promise<Setting[]> {
    const response = await httpService.get<Setting[]>(API_ENDPOINTS.ADMIN.SETTINGS);
    return response.data;
  }

  async updateSetting(data: UpdateSettingRequest): Promise<Setting> {
    const response = await httpService.put<Setting>(
      API_ENDPOINTS.ADMIN.SETTINGS,
      data
    );
    return response.data;
  }
}

export const adminService = new AdminService();
