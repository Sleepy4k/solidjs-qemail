import { httpService } from "../../../shared/services/http.service";
import { API_ENDPOINTS } from "../../../shared/constants/api.constant";
import type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminStats,
  AdminDomain,
  CreateDomainRequest,
  UpdateDomainRequest,
  CfRule,
  AdminAccountsResponse,
  AdminLogsResponse,
  LogSortField,
  SortDir,
  LogActorType,
  LogStatus,
  Setting,
  UpdateSettingRequest,
} from "../types/admin.types";

class AdminService {
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await httpService.post<AdminLoginResponse>(
      API_ENDPOINTS.ADMIN.LOGIN,
      data,
    );
    return response.data;
  }

  async getStats(): Promise<AdminStats> {
    const response = await httpService.get<AdminStats>(
      API_ENDPOINTS.ADMIN.STATS,
    );
    return response.data;
  }

  async listDomains(): Promise<AdminDomain[]> {
    const response = await httpService.get<AdminDomain[]>(
      API_ENDPOINTS.ADMIN.DOMAINS,
    );
    return response.data;
  }

  async createDomain(data: CreateDomainRequest): Promise<AdminDomain> {
    const response = await httpService.post<AdminDomain>(
      API_ENDPOINTS.ADMIN.DOMAINS,
      data,
    );
    return response.data;
  }

  async updateDomain(
    id: number,
    data: UpdateDomainRequest,
  ): Promise<AdminDomain> {
    const response = await httpService.patch<AdminDomain>(
      `${API_ENDPOINTS.ADMIN.DOMAINS}/${id}`,
      data,
    );
    return response.data;
  }

  async deleteDomain(id: number): Promise<void> {
    await httpService.delete(`${API_ENDPOINTS.ADMIN.DOMAINS}/${id}`, {
      body: JSON.stringify({}),
    });
  }

  async getCfRules(id: number): Promise<CfRule[]> {
    const response = await httpService.get<CfRule[]>(
      `${API_ENDPOINTS.ADMIN.DOMAINS}/${id}/cf-rules`,
    );
    return response.data;
  }

  async listAccounts(
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<AdminAccountsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await httpService.get<AdminAccountsResponse>(
      `${API_ENDPOINTS.ADMIN.ACCOUNTS}?${params.toString()}`,
    );
    return response.data;
  }

  async getSettings(): Promise<Setting[]> {
    const response = await httpService.get<Setting[]>(
      API_ENDPOINTS.ADMIN.SETTINGS,
    );
    return response.data;
  }

  async updateSetting(data: UpdateSettingRequest): Promise<Setting> {
    const response = await httpService.put<Setting>(
      API_ENDPOINTS.ADMIN.SETTINGS,
      data,
    );
    return response.data;
  }

  async getLogs(params: {
    page?: number;
    limit?: number;
    search?: string | string[];
    actor_type?: LogActorType;
    action?: string;
    status?: LogStatus;
    resource_type?: string;
    sort_by?: LogSortField;
    sort_dir?: SortDir;
  }): Promise<AdminLogsResponse> {
    const query = new URLSearchParams({
      page: (params.page ?? 1).toString(),
      limit: (params.limit ?? 50).toString(),
    });

    const searchValue = Array.isArray(params.search)
      ? params.search[0]?.trim()
      : params.search?.trim();

    if (searchValue) query.append("search", searchValue);
    if (params.actor_type) query.append("actor_type", params.actor_type);
    if (params.action?.trim()) query.append("action", params.action.trim());
    if (params.status) query.append("status", params.status);
    if (params.resource_type?.trim())
      query.append("resource_type", params.resource_type.trim());
    if (params.sort_by) query.append("sort_by", params.sort_by);
    if (params.sort_dir) query.append("sort_dir", params.sort_dir);

    const response = await httpService.get<AdminLogsResponse>(
      `${API_ENDPOINTS.ADMIN.LOGS}?${query.toString()}`,
    );
    return response.data;
  }
}

export const adminService = new AdminService();
