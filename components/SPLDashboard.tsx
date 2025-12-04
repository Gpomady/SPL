import React, { useState, useEffect } from 'react';
import { 
  ListTodo, 
  Newspaper, 
  Book, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Scale,
  ClipboardCheck,
  X,
  Target,
  TrendingUp,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Edit3,
  MoreVertical,
  Zap,
  Shield,
  AlertCircle,
  CheckCheck,
  Timer,
  Briefcase
} from 'lucide-react';
import { Button } from './Button';

interface SPLDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
  initialParams?: any;
}

const MOCK_ACTION_PLANS = [
  { 
    id: 'PA-2468', 
    title: 'Construção de mais 3 carrinhos para transporte de cilindros de oxigênio.', 
    area: 'Manutenção', 
    responsible: 'Camila Canuto Mady', 
    deadline: '30/12/2024', 
    status: 'concluido',
    progress: 100,
    priority: 'media',
    originType: 'OL', 
    originId: 'OL-1'
  },
  { 
    id: 'PA-172', 
    title: 'Adequação da sinalização de segurança no setor de pintura conforme NR-26', 
    area: 'QSMS', 
    responsible: 'Helisson Brandão', 
    deadline: '15/01/2025', 
    status: 'em_andamento',
    progress: 65,
    priority: 'alta',
    originType: 'RL',
    originId: 'RL-NR10'
  },
  { 
    id: 'PA-2471', 
    title: 'Renovação da Licença de Operação (LO) junto ao IPAAM', 
    area: 'Meio Ambiente', 
    responsible: 'Walisson', 
    deadline: '20/02/2025', 
    status: 'em_andamento',
    progress: 40,
    priority: 'critica',
    originType: 'OL',
    originId: 'OL-1'
  },
  { 
    id: 'PA-2475', 
    title: 'Publicação da concessão de licença no DOE', 
    area: 'Administrativo', 
    responsible: 'Cláudia Brandizzi', 
    deadline: '30/10/2024', 
    status: 'concluido',
    progress: 100,
    priority: 'media',
    originType: 'OL',
    originId: 'OL-2'
  },
  { 
    id: 'PA-3001', 
    title: 'Revisão dos procedimentos de publicação de licenciamento', 
    area: 'Jurídico', 
    responsible: 'Cláudia Brandizzi', 
    deadline: '15/12/2024', 
    status: 'atrasado',
    progress: 30,
    priority: 'alta',
    originType: 'RL',
    originId: 'RL-128'
  }
];

const MOCK_LEGAL_UPDATES = [
  { id: 1, date: '01/12/2024', type: 'Federal', scope: 'Meio Ambiente', title: 'Nova Resolução CONAMA sobre resíduos sólidos', summary: 'Altera os procedimentos para transporte interestadual de resíduos perigosos, exigindo nova documentação digital.', impact: 'Alto', relatedTo: 'RL', isNew: true },
  { id: 2, date: '28/11/2024', type: 'Estadual (AM)', scope: 'Segurança', title: 'Portaria CBMAM nº 152/2024', summary: 'Atualiza as normas técnicas para vistoria de sistemas de combate a incêndio em embarcações fluviais.', impact: 'Médio', relatedTo: 'OL', isNew: true },
  { id: 3, date: '15/11/2024', type: 'Federal', scope: 'Trabalhista', title: 'Revisão da NR-01 - Disposições Gerais', summary: 'Novas diretrizes para o gerenciamento de riscos ocupacionais (GRO) e Programa de Gerenciamento de Riscos (PGR).', impact: 'Alto', relatedTo: 'RL', isNew: false },
];

export const SPLDashboard: React.FC<SPLDashboardProps> = ({ 
  viewMode = 'spl-actions', 
  onChangeView = (_: string) => {},
  initialParams
}) => {
  
  const activeTab = viewMode.replace('spl-', '');

  const stats = {
    total: MOCK_ACTION_PLANS.length,
    concluidos: MOCK_ACTION_PLANS.filter(p => p.status === 'concluido').length,
    emAndamento: MOCK_ACTION_PLANS.filter(p => p.status === 'em_andamento').length,
    atrasados: MOCK_ACTION_PLANS.filter(p => p.status === 'atrasado').length,
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'actions': return <ActionPlansView initialParams={initialParams} />;
      case 'updates': return <LegalUpdatesView />;
      case 'library': return <LibraryView />;
      default: return <ActionPlansView initialParams={initialParams} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-[1400px] mx-auto">
      
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Target size={20} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-300">Sistema de Previsão Legal</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Gestão SPL</h1>
              <p className="text-slate-400 mt-2 max-w-lg">
                Controle centralizado de planos de ação, monitoramento legislativo e biblioteca de normas aplicáveis.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
                <Download size={16} className="mr-2" /> Exportar Relatório
              </Button>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white border-0 shadow-lg shadow-teal-500/25">
                <Plus size={16} className="mr-2" /> Novo Plano
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Briefcase size={16} className="text-slate-300" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase">Total</span>
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-xs text-slate-400 mt-1">Planos cadastrados</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCheck size={16} className="text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-400 uppercase">Concluídos</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">{stats.concluidos}</div>
              <div className="text-xs text-slate-400 mt-1">{Math.round((stats.concluidos / stats.total) * 100)}% do total</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Timer size={16} className="text-blue-400" />
                </div>
                <span className="text-xs font-bold text-blue-400 uppercase">Em Andamento</span>
              </div>
              <div className="text-3xl font-bold text-blue-400">{stats.emAndamento}</div>
              <div className="text-xs text-slate-400 mt-1">Ações em execução</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <AlertCircle size={16} className="text-rose-400" />
                </div>
                <span className="text-xs font-bold text-rose-400 uppercase">Atrasados</span>
              </div>
              <div className="text-3xl font-bold text-rose-400">{stats.atrasados}</div>
              <div className="text-xs text-slate-400 mt-1">Requer atenção</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100">
          <nav className="flex" aria-label="Tabs">
            {[
              { id: 'actions', label: 'Planos de Ação', icon: ListTodo, count: stats.total },
              { id: 'updates', label: 'Monitoramento Legal', icon: Newspaper, count: MOCK_LEGAL_UPDATES.filter(u => u.isNew).length },
              { id: 'library', label: 'Biblioteca de Normas', icon: Book },
            ].map((tab, index) => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                  <button
                    key={tab.id}
                    onClick={() => onChangeView(`spl-${tab.id}`)}
                    className={`
                      relative flex-1 group inline-flex items-center justify-center gap-2 py-4 px-6 font-medium text-sm transition-all
                      ${isActive 
                        ? 'text-teal-700 bg-teal-50/50' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                      ${index !== 0 ? 'border-l border-slate-100' : ''}
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600"></div>
                    )}
                  </button>
               );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const ActionPlansView = ({ initialParams }: { initialParams?: any }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'OL' | 'RL'>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterOriginId, setFilterOriginId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

    useEffect(() => {
        if (initialParams) {
            if (initialParams.originId) setFilterOriginId(initialParams.originId);
            if (initialParams.type) setFilterType(initialParams.type);
        }
    }, [initialParams]);

    const filteredPlans = MOCK_ACTION_PLANS.filter(plan => {
        const matchesSearch = 
            plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.originId.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;
        if (filterType !== 'ALL' && plan.originType !== filterType) return false;
        if (filterStatus !== 'ALL' && plan.status !== filterStatus) return false;
        if (filterOriginId && plan.originId !== filterOriginId) return false;

        return true;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('ALL');
        setFilterStatus('ALL');
        setFilterOriginId(null);
    };

    const getStatusConfig = (status: string) => {
      switch(status) {
        case 'concluido': return { 
          label: 'Concluído', 
          icon: CheckCircle2,
          borderClass: 'bg-emerald-500',
          badgeClass: 'bg-emerald-100 text-emerald-700',
          progressClass: 'from-emerald-400 to-emerald-500'
        };
        case 'em_andamento': return { 
          label: 'Em Andamento', 
          icon: Clock,
          borderClass: 'bg-blue-500',
          badgeClass: 'bg-blue-100 text-blue-700',
          progressClass: 'from-blue-400 to-blue-500'
        };
        case 'atrasado': return { 
          label: 'Atrasado', 
          icon: AlertTriangle,
          borderClass: 'bg-rose-500',
          badgeClass: 'bg-rose-100 text-rose-700',
          progressClass: 'from-rose-400 to-rose-500'
        };
        default: return { 
          label: status, 
          icon: Clock,
          borderClass: 'bg-slate-500',
          badgeClass: 'bg-slate-100 text-slate-700',
          progressClass: 'from-slate-400 to-slate-500'
        };
      }
    };

    const getPriorityConfig = (priority: string) => {
      switch(priority) {
        case 'critica': return { label: 'Crítica', badgeClass: 'bg-rose-50 text-rose-700' };
        case 'alta': return { label: 'Alta', badgeClass: 'bg-amber-50 text-amber-700' };
        case 'media': return { label: 'Média', badgeClass: 'bg-blue-50 text-blue-700' };
        case 'baixa': return { label: 'Baixa', badgeClass: 'bg-slate-50 text-slate-700' };
        default: return { label: priority, badgeClass: 'bg-slate-50 text-slate-700' };
      }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Buscar por ID, título ou origem..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="ALL">Todos os Status</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                      <option value="atrasado">Atrasado</option>
                    </select>

                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button 
                        onClick={() => setFilterType('ALL')}
                        className={`px-3 py-2 text-xs font-medium transition-colors ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        Todos
                      </button>
                      <button 
                        onClick={() => setFilterType('OL')}
                        className={`px-3 py-2 text-xs font-medium transition-colors border-l ${filterType === 'OL' ? 'bg-sky-600 text-white' : 'bg-white text-slate-600 hover:bg-sky-50'}`}
                      >
                        OL
                      </button>
                      <button 
                        onClick={() => setFilterType('RL')}
                        className={`px-3 py-2 text-xs font-medium transition-colors border-l ${filterType === 'RL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-indigo-50'}`}
                      >
                        RL
                      </button>
                    </div>

                    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                      <button 
                        onClick={() => setViewMode('cards')}
                        className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-2 transition-colors border-l ${viewMode === 'list' ? 'bg-slate-100 text-slate-700' : 'bg-white text-slate-400 hover:text-slate-600'}`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                </div>
            </div>

            {filterOriginId && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={16} className="text-amber-600" />
                <span className="text-sm text-amber-800">Filtrando por origem: <strong>{filterOriginId}</strong></span>
                <button onClick={() => setFilterOriginId(null)} className="ml-auto text-amber-600 hover:text-amber-800">
                  <X size={16} />
                </button>
              </div>
            )}

            {viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPlans.map((plan) => {
                    const statusConfig = getStatusConfig(plan.status);
                    const priorityConfig = getPriorityConfig(plan.priority);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <div 
                        key={plan.id} 
                        className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full ${statusConfig.borderClass}`}></div>
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{plan.id}</span>
                            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${statusConfig.badgeClass}`}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </div>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        
                        <h3 className="text-sm font-semibold text-slate-800 mb-4 line-clamp-2 leading-relaxed">
                          {plan.title}
                        </h3>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-slate-500">Progresso</span>
                            <span className="font-bold text-slate-700">{plan.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${statusConfig.progressClass} rounded-full transition-all duration-500`}
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-1">Responsável</span>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {plan.responsible.charAt(0)}
                              </div>
                              <span className="font-medium text-slate-700 truncate">{plan.responsible.split(' ')[0]}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-1">Prazo</span>
                            <span className={`font-medium flex items-center gap-1 ${plan.status === 'atrasado' ? 'text-rose-600' : 'text-slate-700'}`}>
                              <Calendar size={12} /> {plan.deadline}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded border ${
                              plan.originType === 'OL' 
                                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}>
                              {plan.originType === 'OL' ? <ClipboardCheck size={10}/> : <Scale size={10}/>}
                              {plan.originId}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${priorityConfig.badgeClass}`}>
                              {priorityConfig.label}
                            </span>
                          </div>
                          <button className="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                            Ver detalhes <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Plano</th>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Responsável</th>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Prazo</th>
                      <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Origem</th>
                      <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlans.map((plan) => {
                      const statusConfig = getStatusConfig(plan.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-slate-400">{plan.id}</span>
                              <span className="text-sm font-medium text-slate-800 line-clamp-1">{plan.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${statusConfig.badgeClass}`}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {plan.responsible.charAt(0)}
                              </div>
                              <span className="text-sm text-slate-700">{plan.responsible}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm ${plan.status === 'atrasado' ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                              {plan.deadline}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${
                              plan.originType === 'OL' 
                                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}>
                              {plan.originId}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                <Edit3 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {filteredPlans.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <ListTodo size={24} className="text-slate-300"/>
                    </div>
                    <p className="font-semibold text-slate-600 mb-1">Nenhum plano encontrado</p>
                    <p className="text-sm text-slate-400 mb-4">Tente ajustar os filtros de busca</p>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                </div>
            )}
        </div>
    );
};

const LegalUpdatesView = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                {MOCK_LEGAL_UPDATES.map((update, index) => (
                    <div 
                      key={update.id} 
                      className={`group bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${
                        update.isNew ? 'border-teal-200 bg-gradient-to-r from-teal-50/50 to-transparent' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          update.impact === 'Alto' 
                            ? 'bg-rose-100 text-rose-600' 
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          <Zap size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {update.isNew && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 animate-pulse">
                                Novo
                              </span>
                            )}
                            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                              {update.type}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{update.scope}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400 font-mono">{update.date}</span>
                          </div>
                          
                          <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-teal-700 transition-colors cursor-pointer">
                            {update.title}
                          </h4>
                          
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            {update.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`flex items-center gap-1 text-xs font-bold ${
                                update.impact === 'Alto' ? 'text-rose-600' : 'text-amber-600'
                              }`}>
                                <AlertTriangle size={12} /> Impacto {update.impact}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase ${
                                update.relatedTo === 'OL' 
                                  ? 'bg-sky-50 text-sky-700 border-sky-100' 
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              }`}>
                                Impacta {update.relatedTo}
                              </span>
                            </div>
                            
                            <button className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              Analisar Requisitos <ArrowRight size={14}/>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl shadow-teal-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold">Carta de Atualização</h3>
                        <p className="text-xs text-teal-100">Novembro 2024</p>
                      </div>
                    </div>
                    <p className="text-sm text-teal-50 mb-4 leading-relaxed">
                      Resumo mensal das principais mudanças legislativas aplicáveis ao seu negócio.
                    </p>
                    <Button className="w-full bg-white text-teal-700 hover:bg-teal-50 border-0">
                        <Download size={16} className="mr-2"/> Baixar PDF
                    </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={18} className="text-teal-600" />
                      <h3 className="font-bold text-slate-700">Fontes Monitoradas</h3>
                    </div>
                    <ul className="space-y-3">
                        {[
                          'Diário Oficial da União', 
                          'Diário Oficial do Estado (AM)', 
                          'Portal CONAMA', 
                          'Agência Nacional de Águas',
                          'IBAMA - Normas Ambientais'
                        ].map((src, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600 group">
                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={12} className="text-emerald-600"/>
                                </div>
                                <span className="group-hover:text-slate-800 transition-colors">{src}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-amber-500" />
                    <h3 className="font-bold text-slate-700">Dica do Sistema</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Configure alertas personalizados para receber notificações sobre mudanças em áreas específicas do seu interesse.
                  </p>
                  <button className="mt-3 text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                    Configurar Alertas <ChevronRight size={14} />
                  </button>
                </div>
            </div>
        </div>
    );
};

const LibraryView = () => {
    const categories = [
      { name: 'Meio Ambiente', count: 156, icon: '🌿' },
      { name: 'Segurança do Trabalho', count: 89, icon: '⚠️' },
      { name: 'Saúde Ocupacional', count: 45, icon: '🏥' },
      { name: 'Trabalhista', count: 234, icon: '👷' },
      { name: 'Tributário', count: 67, icon: '📊' },
      { name: 'Responsabilidade Social', count: 28, icon: '🤝' },
    ];
    
    return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por lei, decreto, norma..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter size={14} className="mr-2" /> Filtrar
              </Button>
              <Button size="sm">
                <Plus size={14} className="mr-2" /> Importar Documento
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <div 
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-200 transition-all cursor-pointer group text-center"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-teal-700 transition-colors">{cat.name}</h4>
                <span className="text-xs text-slate-400">{cat.count} normas</span>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Book size={28} className="text-teal-600"/>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Biblioteca de Normas</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Acesse o texto integral de todas as leis, decretos e normas vinculadas aos seus requisitos legais.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline">Ver Todas as Normas</Button>
              <Button>Pesquisar na Base</Button>
            </div>
          </div>
        </div>
    );
};
