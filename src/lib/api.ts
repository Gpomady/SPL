const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  clearTokens() {
    this.accessToken = null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data: ApiResponse<{ accessToken: string }> = await response.json();
      
      if (data.success && data.data) {
        this.accessToken = data.data.accessToken;
        return true;
      }

      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchOptions } = options;

    let url = `${API_BASE_URL}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, { ...fetchOptions, headers, credentials: 'include' });
        }
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        throw new ApiError(data.message || 'Erro na requisição', response.status, data.errors);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Erro de conexão com o servidor', 0);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const api = new ApiClient();

export type GlobalRole = 'MASTER' | 'PLATFORM_SUPPORT' | 'USER';
export type CompanyRole = 'ADMIN' | 'MANAGER' | 'COLLABORATOR' | 'VIEWER';

export interface CompanyMembership {
  id: string;
  companyId: string;
  companyRole: CompanyRole;
  status: 'pending' | 'active' | 'suspended';
  company: {
    id: string;
    razaoSocial: string;
    nomeFantasia: string | null;
    cnpj: string;
    status: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  globalRole?: GlobalRole;
  memberships?: CompanyMembership[];
  isActive?: boolean;
  mustChangePassword?: boolean;
}

export const authApi = {
  login: (data: { email: string; password: string; companyId?: string }) =>
    api.post<{ user: User; accessToken: string; companies?: any[] }>('/auth/login', data),
  
  register: (email: string, password: string, name: string) =>
    api.post<{ user: User; accessToken: string }>('/auth/register', { email, password, name }),
  
  logout: () => api.post('/auth/logout'),
  
  getProfile: () => api.get<User>('/auth/profile'),
  
  refreshToken: () => api.post<{ accessToken: string }>('/auth/refresh'),
  
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.patch<User>('/auth/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

export const companiesApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<any[]>('/companies', params),
  
  get: (id: string) => api.get<any>(`/companies/${id}`),
  
  create: (data: any) => api.post<any>('/companies', data),
  
  update: (id: string, data: any) => api.patch<any>(`/companies/${id}`, data),
  
  delete: (id: string) => api.delete(`/companies/${id}`),
  
  getStats: () => api.get<any>('/companies/stats'),
  
  lookupCnpj: (cnpj: string) => api.get<any>(`/companies/lookup/cnpj/${cnpj}`),
  
  lookupCnae: (cnae: string) => api.get<any>(`/companies/lookup/cnae/${cnae}`),
  
  getObligations: (companyId: string, params?: any) =>
    api.get<any[]>(`/companies/${companyId}/obligations`, params),
  
  generateObligations: (companyId: string) =>
    api.post<any>(`/companies/${companyId}/generate-obligations`),
};

export const obligationsApi = {
  list: (params?: { page?: number; limit?: number; status?: string; riskLevel?: string }) =>
    api.get<any[]>('/obligations', params),
  
  get: (id: string) => api.get<any>(`/obligations/${id}`),
  
  create: (data: any) => api.post<any>('/obligations', data),
  
  update: (id: string, data: any) => api.patch<any>(`/obligations/${id}`, data),
  
  updateStatus: (id: string, status: string) =>
    api.patch<any>(`/obligations/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/obligations/${id}`),
};
