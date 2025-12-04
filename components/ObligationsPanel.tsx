import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  Eye,
  FileText,
  User,
  Calendar,
  Shield,
  Zap,
  Scale,
  MapPin,
  Building2,
  AlertCircle,
  CheckSquare,
  XSquare,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Paperclip
} from 'lucide-react';
import { Button } from './Button';

interface Obligation {
  id: string;
  type: 'OL' | 'RL';
  codigo: string;
  descricao: string;
  tema: string;
  subtema?: string;
  area: string;
  responsavel: string;
  status: 'conforme' | 'pendente' | 'vencido' | 'avencer' | 'nao_aplicavel' | 'nao_avaliado';
  risco: 'baixo' | 'medio' | 'alto' | 'critico';
  aplicabilidade: 'aplicavel' | 'nao_aplicavel' | 'avaliar';
  fundamentoLegal?: string;
  prazo?: string;
  evidencia?: string;
  requisitosRelacionados?: string[];
  dataUltimaAvaliacao?: string;
}

const MOCK_OBLIGATIONS: Obligation[] = [
  {
    id: '1',
    type: 'OL',
    codigo: 'OL-1',
    descricao: 'A organização possui licença ambiental (Licença de Operação - LO) válida para as suas atividades junto ao órgão ambiental competente?',
    tema: 'Licenciamento Ambiental',
    area: 'Meio Ambiente',
    responsavel: 'Cláudia Brandizzi',
    status: 'conforme',
    risco: 'alto',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Lei Estadual 3.785/2012 (AM) - Art. 12',
    prazo: '12/2026',
    evidencia: 'LO nº 452/2024 válida até 12/2026',
    requisitosRelacionados: ['RL-191', 'RL-90', 'RL-6743'],
    dataUltimaAvaliacao: '20/11/2024'
  },
  {
    id: '2',
    type: 'OL',
    codigo: 'OL-2',
    descricao: 'A organização publicou a concessão das licenças ambientais em diário oficial ou jornal de grande circulação?',
    tema: 'Licenciamento Ambiental',
    area: 'Meio Ambiente',
    responsavel: 'Cláudia Brandizzi',
    status: 'conforme',
    risco: 'alto',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Resolução CONAMA 281/2001',
    evidencia: 'Publicação DOE-AM edição 12.500 pág 34',
    requisitosRelacionados: ['RL-128'],
    dataUltimaAvaliacao: '15/10/2024'
  },
  {
    id: '3',
    type: 'OL',
    codigo: 'OL-3',
    descricao: 'A organização paga em dia as taxas de licenciamento ambiental para o órgão licenciador competente?',
    tema: 'Licenciamento Ambiental; Tributos',
    area: 'Meio Ambiente',
    responsavel: 'Cláudia Brandizzi',
    status: 'vencido',
    risco: 'alto',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Lei 3785/2012 (AM)',
    prazo: 'Mensal',
    evidencia: 'Pendente comprovante Out/2024',
    requisitosRelacionados: ['RL-55', 'RL-3207'],
    dataUltimaAvaliacao: '05/01/2025'
  },
  {
    id: '4',
    type: 'OL',
    codigo: 'OL-4',
    descricao: 'A organização possui outorga de uso de recursos hídricos válida?',
    tema: 'Recursos Hídricos',
    area: 'Meio Ambiente',
    responsavel: 'Walisson',
    status: 'avencer',
    risco: 'medio',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Lei 9.433/1997',
    prazo: '03/2025',
    requisitosRelacionados: ['RL-200', 'RL-201'],
    dataUltimaAvaliacao: '10/12/2024'
  },
  {
    id: '5',
    type: 'RL',
    codigo: 'RL-191',
    descricao: 'Portaria IPAAM 23/2010 - Dispõe sobre os procedimentos para licenciamento ambiental no Estado do Amazonas',
    tema: 'Licenciamento Ambiental',
    subtema: 'Procedimentos',
    area: 'Meio Ambiente',
    responsavel: 'Cláudia Brandizzi',
    status: 'conforme',
    risco: 'alto',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Portaria IPAAM 23/2010',
    requisitosRelacionados: ['OL-1'],
    dataUltimaAvaliacao: '20/11/2024'
  },
  {
    id: '6',
    type: 'RL',
    codigo: 'RL-128',
    descricao: 'Resolução CONAMA 281/2001 - Modelos de publicação de pedidos de licenciamento',
    tema: 'Licenciamento Ambiental',
    subtema: 'Publicação',
    area: 'Meio Ambiente',
    responsavel: 'Cláudia Brandizzi',
    status: 'conforme',
    risco: 'medio',
    aplicabilidade: 'aplicavel',
    fundamentoLegal: 'Resolução CONAMA 281/2001',
    requisitosRelacionados: ['OL-2'],
    dataUltimaAvaliacao: '15/10/2024'
  },
  {
    id: '7',
    type: 'RL',
    codigo: 'RL-NR10',
    descricao: 'NR-10 - Instalações elétricas devem possuir proteção contra incêndio e explosão',
    tema: 'Segurança do Trabalho',
    subtema: 'Instalações Elétricas',
    area: 'Manutenção',
    responsavel: 'Helisson Brandão',
    status: 'pendente',
    risco: 'critico',
    aplicabilidade: 'avaliar',
    fundamentoLegal: 'NR-10 item 10.9.1',
    dataUltimaAvaliacao: '01/12/2024'
  },
  {
    id: '8',
    type: 'OL',
    codigo: 'OL-5',
    descricao: 'A organização realiza destinação adequada de resíduos perigosos classe I?',
    tema: 'Resíduos',
    area: 'Meio Ambiente',
    responsavel: 'Walisson',
    status: 'nao_avaliado',
    risco: 'alto',
    aplicabilidade: 'avaliar',
    fundamentoLegal: 'Lei 12.305/2010 - PNRS',
    requisitosRelacionados: ['RL-300', 'RL-301'],
  },
  {
    id: '9',
    type: 'RL',
    codigo: 'RL-CBMAM',
    descricao: 'Instrução Técnica CBMAM - Vistoria anual de sistemas de combate a incêndio',
    tema: 'Segurança',
    subtema: 'Incêndio',
    area: 'Manutenção',
    responsavel: 'Fabio Gabriel',
    status: 'conforme',
    risco: 'alto',
    aplicabilidade: 'nao_aplicavel',
    fundamentoLegal: 'IT CBMAM 01/2020',
    dataUltimaAvaliacao: '15/09/2024'
  }
];

interface ObligationsPanelProps {
  filterType?: 'OL' | 'RL' | 'ALL';
  onNavigate?: (view: string, params?: any) => void;
}

export const ObligationsPanel: React.FC<ObligationsPanelProps> = ({ 
  filterType = 'ALL',
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedApplicability, setSelectedApplicability] = useState<string>('ALL');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredObligations = MOCK_OBLIGATIONS.filter(o => {
    if (filterType !== 'ALL' && o.type !== filterType) return false;
    if (selectedStatus !== 'ALL' && o.status !== selectedStatus) return false;
    if (selectedRisk !== 'ALL' && o.risco !== selectedRisk) return false;
    if (selectedApplicability !== 'ALL' && o.aplicabilidade !== selectedApplicability) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return o.descricao.toLowerCase().includes(term) || 
             o.codigo.toLowerCase().includes(term) ||
             o.tema.toLowerCase().includes(term);
    }
    return true;
  });

  const stats = {
    total: MOCK_OBLIGATIONS.filter(o => filterType === 'ALL' || o.type === filterType).length,
    conforme: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.status === 'conforme').length,
    pendente: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.status === 'pendente').length,
    vencido: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.status === 'vencido').length,
    avencer: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.status === 'avencer').length,
    aplicavel: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.aplicabilidade === 'aplicavel').length,
    naoAplicavel: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.aplicabilidade === 'nao_aplicavel').length,
    avaliar: MOCK_OBLIGATIONS.filter(o => (filterType === 'ALL' || o.type === filterType) && o.aplicabilidade === 'avaliar').length,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'conforme': return { label: 'Conforme', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 };
      case 'pendente': return { label: 'Pendente', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock };
      case 'vencido': return { label: 'Vencido', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: XCircle };
      case 'avencer': return { label: 'A Vencer', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle };
      case 'nao_aplicavel': return { label: 'N/A', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: XSquare };
      case 'nao_avaliado': return { label: 'Não Avaliado', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: HelpCircle };
      default: return { label: status, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', icon: Clock };
    }
  };

  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case 'critico': return { label: 'Crítico', color: 'text-rose-700', bg: 'bg-rose-100' };
      case 'alto': return { label: 'Alto', color: 'text-orange-700', bg: 'bg-orange-100' };
      case 'medio': return { label: 'Médio', color: 'text-amber-700', bg: 'bg-amber-100' };
      case 'baixo': return { label: 'Baixo', color: 'text-emerald-700', bg: 'bg-emerald-100' };
      default: return { label: risk, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const getApplicabilityConfig = (applicability: string) => {
    switch (applicability) {
      case 'aplicavel': return { label: 'Se Aplica', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckSquare };
      case 'nao_aplicavel': return { label: 'Não se Aplica', color: 'text-slate-500', bg: 'bg-slate-100', icon: XSquare };
      case 'avaliar': return { label: 'A Avaliar', color: 'text-amber-600', bg: 'bg-amber-50', icon: HelpCircle };
      default: return { label: applicability, color: 'text-slate-600', bg: 'bg-slate-100', icon: HelpCircle };
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div 
          onClick={() => setSelectedStatus('ALL')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedStatus === 'ALL' ? 'ring-2 ring-teal-500 border-teal-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <div className="text-xs text-slate-500 font-medium">Total</div>
        </div>
        <div 
          onClick={() => setSelectedStatus('conforme')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedStatus === 'conforme' ? 'ring-2 ring-emerald-500 border-emerald-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-emerald-600">{stats.conforme}</div>
          <div className="text-xs text-slate-500 font-medium">Conformes</div>
        </div>
        <div 
          onClick={() => setSelectedStatus('pendente')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedStatus === 'pendente' ? 'ring-2 ring-amber-500 border-amber-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-amber-600">{stats.pendente}</div>
          <div className="text-xs text-slate-500 font-medium">Pendentes</div>
        </div>
        <div 
          onClick={() => setSelectedStatus('vencido')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedStatus === 'vencido' ? 'ring-2 ring-rose-500 border-rose-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-rose-600">{stats.vencido}</div>
          <div className="text-xs text-slate-500 font-medium">Vencidos</div>
        </div>
        <div 
          onClick={() => setSelectedStatus('avencer')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedStatus === 'avencer' ? 'ring-2 ring-orange-500 border-orange-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-orange-600">{stats.avencer}</div>
          <div className="text-xs text-slate-500 font-medium">A Vencer</div>
        </div>
        <div 
          onClick={() => setSelectedApplicability('aplicavel')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedApplicability === 'aplicavel' ? 'ring-2 ring-teal-500 border-teal-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-teal-600">{stats.aplicavel}</div>
          <div className="text-xs text-slate-500 font-medium">Aplicáveis</div>
        </div>
        <div 
          onClick={() => setSelectedApplicability('avaliar')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${selectedApplicability === 'avaliar' ? 'ring-2 ring-purple-500 border-purple-200' : 'border-slate-200'}`}
        >
          <div className="text-2xl font-bold text-purple-600">{stats.avaliar}</div>
          <div className="text-xs text-slate-500 font-medium">A Avaliar</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, descrição ou tema..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="ALL">Todos os Riscos</option>
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Médio</option>
              <option value="baixo">Baixo</option>
            </select>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedStatus('ALL');
                setSelectedRisk('ALL');
                setSelectedApplicability('ALL');
                setSearchTerm('');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredObligations.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-sm text-slate-500">Tente ajustar os filtros ou termos de busca</p>
          </div>
        ) : (
          filteredObligations.map((obligation) => {
            const statusConfig = getStatusConfig(obligation.status);
            const riskConfig = getRiskConfig(obligation.risco);
            const applicabilityConfig = getApplicabilityConfig(obligation.aplicabilidade);
            const isExpanded = expandedItems.has(obligation.id);
            const StatusIcon = statusConfig.icon;
            const ApplicabilityIcon = applicabilityConfig.icon;

            return (
              <div 
                key={obligation.id}
                className={`bg-white rounded-xl border transition-all duration-300 ${
                  isExpanded ? 'shadow-lg border-slate-300' : 'border-slate-200 hover:shadow-md'
                }`}
              >
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => toggleExpanded(obligation.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      obligation.type === 'OL' ? 'bg-sky-100 text-sky-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {obligation.type === 'OL' ? <CheckCircle2 size={20} /> : <Scale size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          obligation.type === 'OL' ? 'bg-sky-100 text-sky-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {obligation.type}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">{obligation.codigo}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs text-slate-500">{obligation.tema}</span>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800 leading-relaxed mb-3">
                        {obligation.descricao}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${applicabilityConfig.bg} ${applicabilityConfig.color}`}>
                          <ApplicabilityIcon size={12} />
                          {applicabilityConfig.label}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${riskConfig.bg} ${riskConfig.color}`}>
                          <Zap size={10} />
                          Risco {riskConfig.label}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <User size={12} />
                          {obligation.responsavel}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <Building2 size={12} />
                          {obligation.area}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <ChevronDown 
                        size={20} 
                        className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {obligation.fundamentoLegal && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fundamento Legal</div>
                          <div className="text-sm text-slate-700 flex items-center gap-2">
                            <FileText size={14} className="text-slate-400" />
                            {obligation.fundamentoLegal}
                          </div>
                        </div>
                      )}

                      {obligation.prazo && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Prazo/Vencimento</div>
                          <div className="text-sm text-slate-700 flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            {obligation.prazo}
                          </div>
                        </div>
                      )}

                      {obligation.dataUltimaAvaliacao && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Última Avaliação</div>
                          <div className="text-sm text-slate-700 flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            {obligation.dataUltimaAvaliacao}
                          </div>
                        </div>
                      )}

                      {obligation.evidencia && (
                        <div className="bg-slate-50 rounded-lg p-3 md:col-span-2">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Evidência</div>
                          <div className="text-sm text-slate-700 flex items-center gap-2">
                            <Paperclip size={14} className="text-slate-400" />
                            {obligation.evidencia}
                          </div>
                        </div>
                      )}

                      {obligation.requisitosRelacionados && obligation.requisitosRelacionados.length > 0 && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requisitos Relacionados</div>
                          <div className="flex flex-wrap gap-1.5">
                            {obligation.requisitosRelacionados.map((req, i) => (
                              <span 
                                key={i}
                                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-600 cursor-pointer hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-colors"
                              >
                                {req}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="mr-1.5" /> Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText size={14} className="mr-1.5" /> Texto Legal
                        </Button>
                      </div>
                      
                      {obligation.aplicabilidade === 'avaliar' && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50">
                            <XSquare size={14} className="mr-1.5" /> Não se Aplica
                          </Button>
                          <Button size="sm">
                            <CheckSquare size={14} className="mr-1.5" /> Se Aplica
                          </Button>
                        </div>
                      )}

                      {obligation.status === 'vencido' && (
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          <AlertTriangle size={14} className="mr-1.5" /> Criar Plano de Ação
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="text-center text-sm text-slate-500">
        Mostrando {filteredObligations.length} de {stats.total} {filterType === 'OL' ? 'obrigações' : filterType === 'RL' ? 'requisitos' : 'itens'}
      </div>
    </div>
  );
};

export default ObligationsPanel;
