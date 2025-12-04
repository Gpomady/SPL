import { AppError } from '../middleware/errorHandler';

interface BrasilApiCompany {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  email: string;
  telefone: string;
  uf: string;
  municipio: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios: Array<{ codigo: number; descricao: string }>;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_inicio_atividade: string;
  natureza_juridica: string;
  porte: string;
  capital_social: number;
}

interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  cnaePrincipal: string;
  cnaePrincipalDescricao: string;
  cnaesSecundarios: Array<{ codigo: string; descricao: string }>;
  situacao: string;
  dataAbertura: string;
  naturezaJuridica: string;
  porte: string;
  capitalSocial: number;
}

export class CnpjService {
  private readonly BRASIL_API_URL = 'https://brasilapi.com.br/api/cnpj/v1';
  private cache: Map<string, { data: CompanyData; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  async lookup(cnpj: string): Promise<CompanyData> {
    const cleanCnpj = cnpj.replace(/\D/g, '');

    if (cleanCnpj.length !== 14) {
      throw new AppError('CNPJ deve ter 14 dígitos', 400);
    }

    const cached = this.cache.get(cleanCnpj);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${this.BRASIL_API_URL}/${cleanCnpj}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 404) {
          throw new AppError('CNPJ não encontrado na base da Receita Federal', 404);
        }
        throw new AppError('Erro ao consultar CNPJ na Receita Federal', 502);
      }

      const data: BrasilApiCompany = await response.json();

      const companyData: CompanyData = {
        cnpj: data.cnpj,
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia || data.razao_social,
        email: data.email || '',
        phone: data.telefone || '',
        state: data.uf,
        city: data.municipio,
        address: [data.logradouro, data.numero, data.bairro].filter(Boolean).join(', '),
        cnaePrincipal: String(data.cnae_fiscal).padStart(7, '0'),
        cnaePrincipalDescricao: data.cnae_fiscal_descricao,
        cnaesSecundarios: (data.cnaes_secundarios || []).map(c => ({
          codigo: String(c.codigo).padStart(7, '0'),
          descricao: c.descricao,
        })),
        situacao: data.situacao_cadastral,
        dataAbertura: data.data_inicio_atividade,
        naturezaJuridica: data.natureza_juridica,
        porte: data.porte,
        capitalSocial: data.capital_social,
      };

      this.cache.set(cleanCnpj, { data: companyData, timestamp: Date.now() });

      return companyData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError('Tempo limite excedido ao consultar CNPJ', 504);
      }

      console.error('CNPJ lookup error:', error);
      throw new AppError('Erro ao consultar CNPJ. Tente novamente.', 502);
    }
  }

  async lookupCnae(cnae: string) {
    const cleanCnae = cnae.replace(/\D/g, '');
    
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v2/cnae/subclasses/${cleanCnae}`,
        {
          headers: { 'Accept': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new AppError('CNAE não encontrado', 404);
      }

      const data = await response.json();
      
      return {
        codigo: cleanCnae,
        descricao: data.descricao,
        classe: data.classe?.descricao,
        grupo: data.grupo?.descricao,
        divisao: data.divisao?.descricao,
        secao: data.secao?.descricao,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao consultar CNAE', 502);
    }
  }
}

export const cnpjService = new CnpjService();
