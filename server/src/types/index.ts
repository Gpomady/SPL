import { Request } from 'express';

export type GlobalRole = 'MASTER' | 'PLATFORM_SUPPORT' | 'USER';
export type CompanyRole = 'ADMIN' | 'MANAGER' | 'COLLABORATOR' | 'VIEWER';
export type MembershipStatus = 'pending' | 'active' | 'suspended';
export type CompanyStatus = 'pending_setup' | 'active' | 'suspended' | 'cancelled';

export interface JwtPayload {
  userId: string;
  email: string;
  globalRole: GlobalRole;
  activeCompanyId?: string;
  companyRole?: CompanyRole;
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
  companyId?: string;
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
  adminEmail: string;
  adminName: string;
  slaTier?: string;
  billingEmail?: string;
  notes?: string;
}

export interface InviteUserRequest {
  email: string;
  name: string;
  companyId: string;
  companyRole: CompanyRole;
}

export interface AcceptInvitationRequest {
  token: string;
  password: string;
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

export interface UserWithMemberships {
  id: string;
  email: string;
  name: string;
  globalRole: GlobalRole;
  avatar: string | null;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  memberships: {
    id: string;
    companyId: string;
    companyRole: CompanyRole;
    status: MembershipStatus;
    company: {
      id: string;
      razaoSocial: string;
      nomeFantasia: string | null;
      cnpj: string;
      status: CompanyStatus;
    };
  }[];
}
