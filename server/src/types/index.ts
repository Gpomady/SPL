import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = any> {
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

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface CompanyCreateRequest {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  email?: string;
  phone?: string;
  state: string;
  city: string;
  address?: string;
  cnaePrincipal: string;
  cnaesSecundarios?: string[];
}

export interface ObligationCreateRequest {
  companyId: string;
  code: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  agency: string;
  frequency?: string;
  deadline?: string;
  riskLevel?: string;
  responsible?: string;
  priority?: string;
}
