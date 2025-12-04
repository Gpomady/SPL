import type { CNAE } from '../types';

const CNAE_API_BASE = 'https://servicodados.ibge.gov.br/api/v2/cnae';

export interface CNAESection {
  id: string;
  descricao: string;
}

export interface CNAEDivision {
  id: string;
  descricao: string;
  secao: { id: string; descricao: string };
}

export interface CNAEGroup {
  id: string;
  descricao: string;
  divisao: { id: string; descricao: string };
}

export interface CNAEClass {
  id: string;
  descricao: string;
  grupo: { id: string; descricao: string };
}

export interface CNAESubclass {
  id: string;
  descricao: string;
  classe: { id: string; descricao: string };
}

export async function fetchCNAESections(): Promise<CNAESection[]> {
  try {
    const response = await fetch(`${CNAE_API_BASE}/secoes`);
    if (!response.ok) throw new Error('Erro ao buscar seções CNAE');
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar seções CNAE:', error);
    return [];
  }
}

export async function fetchCNAEDivisions(sectionId?: string): Promise<CNAEDivision[]> {
  try {
    const url = sectionId 
      ? `${CNAE_API_BASE}/secoes/${sectionId}/divisoes`
      : `${CNAE_API_BASE}/divisoes`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar divisões CNAE');
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar divisões CNAE:', error);
    return [];
  }
}

export async function fetchCNAEGroups(divisionId?: string): Promise<CNAEGroup[]> {
  try {
    const url = divisionId
      ? `${CNAE_API_BASE}/divisoes/${divisionId}/grupos`
      : `${CNAE_API_BASE}/grupos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar grupos CNAE');
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar grupos CNAE:', error);
    return [];
  }
}

export async function fetchCNAEClasses(groupId?: string): Promise<CNAEClass[]> {
  try {
    const url = groupId
      ? `${CNAE_API_BASE}/grupos/${groupId}/classes`
      : `${CNAE_API_BASE}/classes`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar classes CNAE');
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar classes CNAE:', error);
    return [];
  }
}

export async function fetchCNAESubclasses(classId: string): Promise<CNAESubclass[]> {
  try {
    const response = await fetch(`${CNAE_API_BASE}/classes/${classId}/subclasses`);
    if (!response.ok) throw new Error('Erro ao buscar subclasses CNAE');
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar subclasses CNAE:', error);
    return [];
  }
}

export async function searchCNAE(query: string): Promise<CNAE[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${CNAE_API_BASE}/subclasses`);
    if (!response.ok) throw new Error('Erro ao buscar CNAEs');
    
    const data: CNAESubclass[] = await response.json();
    const queryLower = query.toLowerCase();
    
    return data
      .filter(item => 
        item.id.includes(query) || 
        item.descricao.toLowerCase().includes(queryLower)
      )
      .slice(0, 20)
      .map(item => ({
        codigo: item.id,
        descricao: item.descricao,
        principal: false
      }));
  } catch (error) {
    console.error('Erro ao buscar CNAEs:', error);
    return [];
  }
}

export function formatCNAECode(code: string): string {
  const cleaned = code.replace(/\D/g, '');
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 5)}/${cleaned.slice(5)}`;
  }
  return code;
}

export function getRisksByMainCNAE(cnaeCode: string): string[] {
  const cnaePrefix = cnaeCode.slice(0, 2);
  
  const riskMappings: Record<string, string[]> = {
    '01': ['Agrotóxicos', 'Resíduos orgânicos', 'Segurança rural'],
    '05': ['Resíduos de mineração', 'Impacto ambiental', 'Segurança em minas'],
    '10': ['Segurança alimentar', 'Efluentes industriais', 'Resíduos orgânicos'],
    '19': ['Combustíveis', 'Produtos inflamáveis', 'Emissões atmosféricas'],
    '20': ['Produtos químicos', 'Resíduos perigosos', 'Segurança química'],
    '23': ['Minerais não metálicos', 'Poeira', 'Ruído ocupacional'],
    '24': ['Metalurgia', 'Emissões atmosféricas', 'Resíduos metálicos'],
    '29': ['Veículos', 'Óleos e lubrificantes', 'Ruído industrial'],
    '30': ['Embarcações', 'Poluição aquática', 'Segurança naval'],
    '35': ['Energia elétrica', 'NR-10', 'Impacto ambiental'],
    '41': ['Construção', 'Resíduos de construção', 'Segurança em altura'],
    '46': ['Comércio atacadista', 'Armazenagem', 'Logística'],
    '49': ['Transporte terrestre', 'Emissões veiculares', 'Segurança viária'],
    '50': ['Transporte aquaviário', 'Poluição aquática', 'Segurança naval'],
    '86': ['Saúde', 'Resíduos de serviço de saúde', 'Biossegurança'],
    '87': ['Serviços sociais', 'Segurança do trabalho', 'Acessibilidade'],
  };
  
  return riskMappings[cnaePrefix] || ['Segurança do trabalho', 'Meio ambiente'];
}
