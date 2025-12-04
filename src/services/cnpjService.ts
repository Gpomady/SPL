import type { CNPJResponse, Company, CNAE, Address } from '../types';

const CNPJ_API_BASE = 'https://brasilapi.com.br/api/cnpj/v1';

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cleanCNPJ(cnpj);
  if (cleaned.length !== 14) return false;
  
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cleaned[12]) !== digit) return false;
  
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cleaned[13]) !== digit) return false;
  
  return true;
}

export async function fetchCNPJData(cnpj: string): Promise<CNPJResponse> {
  const cleaned = cleanCNPJ(cnpj);
  
  if (!validateCNPJ(cleaned)) {
    throw new Error('CNPJ inválido. Verifique os dígitos informados.');
  }
  
  try {
    const response = await fetch(`${CNPJ_API_BASE}/${cleaned}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado na base da Receita Federal.');
      }
      if (response.status === 429) {
        throw new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.');
      }
      throw new Error('Erro ao consultar CNPJ. Tente novamente.');
    }
    
    const data = await response.json();
    return data as CNPJResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
}

export function cnpjResponseToCompany(response: CNPJResponse): Company {
  const cnaesPrincipais: CNAE[] = [{
    codigo: response.cnae_fiscal,
    descricao: response.cnae_fiscal_descricao,
    principal: true
  }];
  
  const cnaesSecundarios: CNAE[] = (response.cnaes_secundarios || []).map(cnae => ({
    codigo: cnae.codigo,
    descricao: cnae.descricao,
    principal: false
  }));
  
  const endereco: Address = {
    logradouro: response.logradouro,
    numero: response.numero,
    complemento: response.complemento,
    bairro: response.bairro,
    cidade: response.municipio,
    estado: response.uf,
    cep: response.cep
  };
  
  return {
    id: crypto.randomUUID(),
    cnpj: formatCNPJ(response.cnpj),
    razaoSocial: response.razao_social,
    nomeFantasia: response.nome_fantasia || response.razao_social,
    cnaesPrincipais,
    cnaesSecundarios,
    endereco,
    telefone: response.telefone,
    email: response.email,
    dataAbertura: response.data_abertura,
    situacaoCadastral: response.situacao_cadastral,
    naturezaJuridica: response.natureza_juridica,
    capitalSocial: response.capital_social,
    porte: response.porte
  };
}

export async function searchCompanyByCNPJ(cnpj: string): Promise<Company> {
  const response = await fetchCNPJData(cnpj);
  return cnpjResponseToCompany(response);
}
