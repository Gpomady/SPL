export type ComplianceStatus = 'conforme' | 'pendente' | 'vencido' | 'avencer' | 'nao_aplicavel' | 'nao_avaliado';
export type RiskLevel = 'baixo' | 'medio' | 'alto' | 'critico';
export type Priority = 'baixa' | 'media' | 'alta' | 'critica';
export type ActionPlanStatus = 'pendente' | 'em_andamento' | 'concluido' | 'atrasado' | 'cancelado';
export type DocumentStatus = 'valido' | 'avencer' | 'vencido' | 'pendente';
export type LegalActType = 'lei' | 'decreto' | 'resolucao' | 'portaria' | 'instrucao_normativa' | 'norma_regulamentadora';
export type LegalScope = 'federal' | 'estadual' | 'municipal';

export interface Address {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais?: string;
}

export interface CNAE {
  codigo: string;
  descricao: string;
  principal?: boolean;
}

export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnaesPrincipais: CNAE[];
  cnaesSecundarios: CNAE[];
  endereco: Address;
  telefone?: string;
  email?: string;
  dataAbertura?: string;
  situacaoCadastral?: string;
  naturezaJuridica?: string;
  capitalSocial?: number;
  porte?: string;
  logo?: string;
}

export interface OperationalProfile {
  id: string;
  companyId: string;
  estadosAtuacao: string[];
  municipiosAtuacao: string[];
  riscos: OperationalRisk[];
  atividades: string[];
  certificacoes?: string[];
  funcionarios?: number;
  faturamentoAnual?: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface OperationalRisk {
  id: string;
  tipo: string;
  descricao: string;
  nivel: RiskLevel;
  ativo: boolean;
}

export interface LegalRequirement {
  id: string;
  codigo: string;
  tipo: 'OL' | 'RL';
  descricao: string;
  fundamentoLegal: string;
  linkLegislacao?: string;
  escopo: string[];
  tema: string;
  subtema?: string;
  area: string;
  subarea?: string;
  risco: RiskLevel;
  periodicidade?: string;
  prazo?: string;
  orgaoFiscalizador?: string;
  multa?: string;
  requisitosRelacionados: string[];
  dataVigencia: string;
  dataAtualizacao: string;
  textoLegal?: string;
}

export interface Obligation {
  id: string;
  requirementId: string;
  companyId: string;
  status: ComplianceStatus;
  responsavel: string;
  responsavelId: string;
  areaResponsavel: string;
  dataAvaliacao?: string;
  dataProximaAvaliacao?: string;
  observacoes?: string;
  evidencias: Evidence[];
  historico: ObligationHistory[];
}

export interface Evidence {
  id: string;
  obligationId: string;
  tipo: 'documento' | 'foto' | 'certificado' | 'licenca' | 'relatorio' | 'outro';
  nome: string;
  descricao?: string;
  arquivo: string;
  dataUpload: string;
  uploadPor: string;
  validade?: string;
  numero?: string;
  categoria?: string;
  tamanho?: number;
  mimeType?: string;
}

export interface ObligationHistory {
  id: string;
  data: string;
  usuario: string;
  acao: string;
  statusAnterior?: ComplianceStatus;
  statusNovo?: ComplianceStatus;
  observacao?: string;
}

export interface ActionPlan {
  id: string;
  titulo: string;
  descricao?: string;
  area: string;
  responsavel: string;
  responsavelId: string;
  prazo: string;
  status: ActionPlanStatus;
  progresso: number;
  prioridade: Priority;
  origemTipo: 'OL' | 'RL' | 'auditoria' | 'outro';
  origemId?: string;
  tarefas?: ActionPlanTask[];
  dataCriacao: string;
  dataAtualizacao: string;
  dataConclusao?: string;
}

export interface ActionPlanTask {
  id: string;
  descricao: string;
  responsavel: string;
  prazo: string;
  concluida: boolean;
  dataConclusao?: string;
}

export interface LegalUpdate {
  id: string;
  data: string;
  tipo: LegalActType;
  escopo: LegalScope;
  area: string;
  titulo: string;
  resumo: string;
  impacto: RiskLevel;
  linkOriginal?: string;
  relacionadoA: 'OL' | 'RL';
  novo: boolean;
  lida: boolean;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  cargo: string;
  area: string;
  permissoes: string[];
  ativo: boolean;
  dataCadastro: string;
  ultimoAcesso?: string;
}

export interface Area {
  id: string;
  nome: string;
  parentId?: string;
  responsavelId?: string;
  cor?: string;
  colaboradores?: number;
}

export interface Questionnaire {
  id: string;
  nome: string;
  descricao?: string;
  area: string;
  respondente?: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  perguntas: Question[];
  dataCriacao: string;
  dataResposta?: string;
  progresso: number;
}

export interface Question {
  id: string;
  texto: string;
  tipo: 'sim_nao' | 'multipla_escolha' | 'texto' | 'numero' | 'data';
  opcoes?: string[];
  resposta?: string | boolean | number | Date;
  obrigatoria: boolean;
  ajuda?: string;
}

export interface Notification {
  id: string;
  tipo: 'alerta' | 'info' | 'sucesso' | 'erro' | 'lembrete';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  link?: string;
  prioridade: Priority;
}

export interface DashboardStats {
  totalObrigacoes: number;
  conformes: number;
  pendentes: number;
  vencidas: number;
  aVencer: number;
  naoAplicaveis: number;
  taxaConformidade: number;
}

export interface CNPJResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  data_abertura: string;
  situacao_cadastral: string;
  natureza_juridica: string;
  porte: string;
  capital_social: number;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  cnaes_secundarios: Array<{ codigo: string; descricao: string }>;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone?: string;
  email?: string;
}

export interface OnboardingStep {
  id: number;
  titulo: string;
  descricao: string;
  concluido: boolean;
  atual: boolean;
}

export interface OnboardingData {
  cnpj: string;
  empresa?: Company;
  perfilOperacional?: Partial<OperationalProfile>;
  etapaAtual: number;
  concluido: boolean;
}
