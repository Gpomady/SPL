import { z } from 'zod';

export const emailSchema = z.string().email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');

export const cnpjSchema = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'CNPJ inválido')
  .transform((val) => val.replace(/\D/g, ''));

export const cnaeSchema = z
  .string()
  .regex(/^\d{7}$|^\d{4}-\d\/\d{2}$/, 'CNAE inválido')
  .transform((val) => val.replace(/\D/g, ''));

export const uuidSchema = z.string().uuid('ID inválido');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(255),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const companySchema = z.object({
  cnpj: cnpjSchema,
  razaoSocial: z.string().min(2, 'Razão social é obrigatória').max(255),
  nomeFantasia: z.string().max(255).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  city: z.string().min(2, 'Cidade é obrigatória').max(100),
  address: z.string().optional(),
  cnaePrincipal: cnaeSchema,
  cnaesSecundarios: z.array(cnaeSchema).optional().default([]),
});

export const obligationSchema = z.object({
  companyId: uuidSchema,
  code: z.string().min(1).max(50),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(100),
  subcategory: z.string().max(100).optional(),
  agency: z.string().min(1).max(100),
  frequency: z.string().max(50).optional(),
  deadline: z.string().datetime().optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  responsible: z.string().max(255).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  let sum = 0;
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weight[i];
  }
  
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cnpj[12]) !== digit1) return false;
  
  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weight[i];
  }
  
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cnpj[13]) === digit2;
}

export function formatCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/\D/g, '');
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>\"\'&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    });
}
