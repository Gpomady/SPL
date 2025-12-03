
import React, { useState, useEffect } from 'react';
import { 
  ListTodo, 
  Newspaper, 
  Book, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar,
  MoreHorizontal,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Scale,
  ClipboardCheck,
  Gavel,
  X
} from 'lucide-react';
import { Button } from './Button';

interface SPLDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
  initialParams?: any; // New: Accept initialization params (filters)
}

// --- MOCK DATA UPDATED TO MATCH COMPLIANCE DASHBOARD IDS ---

const MOCK_ACTION_PLANS = [
  { 
    id: 'PA-2468', 
    title: 'Construção de mais 3 carrinhos para transporte de cilindros de oxigênio.', 
    area: 'Manutenção', 
    responsible: 'Camila Canuto Mady', 
    deadline: '30/12/2024', 
    status: 'concluido',
    originType: 'OL', 
    originId: 'OL-1' // Matches Compliance Dashboard
  },
  { 
    id: 'PA-172', 
    title: 'Adequação da sinalização de segurança no setor de pintura conforme NR-26', 
    area: 'QSMS', 
    responsible: 'Helisson Brandão', 
    deadline: '15/01/2025', 
    status: 'em_andamento',
    originType: 'RL',
    originId: 'RL-NR10' // Matches Compliance Dashboard
  },
  { 
    id: 'PA-2471', 
    title: 'Renovação da Licença de Operação (LO) junto ao IPAAM', 
    area: 'Meio Ambiente', 
    responsible: 'Walisson', 
    deadline: '20/02/2025', 
    status: 'em_andamento',
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
    originType: 'RL',
    originId: 'RL-128'
  }
];

const MOCK_LEGAL_UPDATES = [
  { id: 1, date: '01/12/2024', type: 'Federal', scope: 'Meio Ambiente', title: 'Nova Resolução CONAMA sobre resíduos sólidos', summary: 'Altera os procedimentos para transporte interestadual de resíduos perigosos, exigindo nova documentação digital.', impact: 'Alto', relatedTo: 'RL' },
  { id: 2, date: '28/11/2024', type: 'Estadual (AM)', scope: 'Segurança', title: 'Portaria CBMAM nº 152/2024', summary: 'Atualiza as normas técnicas para vistoria de sistemas de combate a incêndio em embarcações fluviais.', impact: 'Médio', relatedTo: 'OL' },
  { id: 3, date: '15/11/2024', type: 'Federal', scope: 'Trabalhista', title: 'Revisão da NR-01 - Disposições Gerais', summary: 'Novas diretrizes para o gerenciamento de riscos ocupacionais (GRO) e Programa de Gerenciamento de Riscos (PGR).', impact: 'Alto', relatedTo: 'RL' },
];

export const SPLDashboard: React.FC<SPLDashboardProps> = ({ 
  viewMode = 'spl-actions', 
  onChangeView = (_: string) => {},
  initialParams
}) => {
  
  const activeTab = viewMode.replace('spl-', '');

  const renderContent = () => {
    switch(activeTab) {
      case 'actions': return <ActionPlansView initialParams={initialParams} />;
      case 'updates': return <LegalUpdatesView />;
      case 'library': return <LibraryView />;
      default: return <ActionPlansView initialParams={initialParams} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gestão SPL</h1>
          <p className="text-sm text-slate-500">Controle operacional de planos de ação e monitoramento de mudanças legislativas.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'actions', label: 'Planos de Ação', icon: ListTodo },
            { id: 'updates', label: 'Monitoramento Legal', icon: Newspaper },
            { id: 'library', label: 'Biblioteca', icon: Book },
          ].map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
                <button
                  key={tab.id}
                  onClick={() => onChangeView(`spl-${tab.id}`)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all
                    ${isActive 
                      ? 'border-[#0f766e] text-[#0f766e]' 
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                  `}
                >
                  <Icon className={`mr-2 h-4 w-4 ${isActive ? 'text-[#0f766e]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  {tab.label}
                </button>
             );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ActionPlansView = ({ initialParams }: { initialParams?: any }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'OL' | 'RL'>('ALL');
    const [filterOriginId, setFilterOriginId] = useState<string | null>(null);

    // Apply initial params when component mounts or params change
    useEffect(() => {
        if (initialParams) {
            if (initialParams.originId) {
                setFilterOriginId(initialParams.originId);
                // Also set search term to show it visually, but ID filter is precise
            }
            if (initialParams.type) {
                setFilterType(initialParams.type);
            }
        }
    }, [initialParams]);

    const filteredPlans = MOCK_ACTION_PLANS.filter(plan => {
        // Text Search
        const matchesSearch = 
            plan.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            plan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.originId.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        // Type Filter
        if (filterType !== 'ALL' && plan.originType !== filterType) return false;

        // Specific Origin ID Filter (Deep Linking)
        if (filterOriginId && plan.originId !== filterOriginId) return false;

        return true;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setFilterType('ALL');
        setFilterOriginId(null);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                
                {/* Top Row: Search and Primary Actions */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Pesquisar plano (ID, Título, Origem)..."
                            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <div className="flex gap-2">
                        <Button size="sm" className="shrink-0"><Filter size={14} className="mr-2"/> Filtros Avançados</Button>
                        <Button size="sm" className="shrink-0"><Plus size={14} className="mr-2"/> Novo Plano</Button>
                     </div>
                </div>

                {/* Bottom Row: Context Filters (OL vs RL) & Active Tags */}
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                    
                    {/* Type Toggles */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFilterType('ALL')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${filterType === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Todos
                        </button>
                        <button 
                            onClick={() => setFilterType('OL')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${filterType === 'OL' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700'}`}
                        >
                            <ClipboardCheck size={14} /> Origem: Obrigações (OL)
                        </button>
                        <button 
                            onClick={() => setFilterType('RL')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${filterType === 'RL' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'}`}
                        >
                            <Scale size={14} /> Origem: Requisitos (RL)
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    {/* Active Filters Display (Chips) */}
                    {filterOriginId && (
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 text-xs font-bold animate-fade-in">
                            <span>Filtro Ativo: {filterOriginId}</span>
                            <button onClick={() => setFilterOriginId(null)} className="hover:text-amber-900"><X size={12}/></button>
                        </div>
                    )}

                    {(filterOriginId || filterType !== 'ALL' || searchTerm) && (
                        <button 
                            onClick={clearFilters}
                            className="text-xs text-slate-400 hover:text-slate-600 underline ml-auto sm:ml-0"
                        >
                            Limpar tudo
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredPlans.map((plan) => (
                    <div key={plan.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        {/* Status Border */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 
                            ${plan.status === 'concluido' ? 'bg-emerald-500' : 
                              plan.status === 'vencido' || plan.status === 'atrasado' ? 'bg-rose-500' : 'bg-blue-500'}
                        `}></div>

                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    {/* Status Badge */}
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide
                                         ${plan.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 
                                           plan.status === 'vencido' || plan.status === 'atrasado' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}
                                    `}>
                                        {plan.status === 'concluido' ? 'Concluído' : plan.status === 'vencido' || plan.status === 'atrasado' ? 'Vencido' : 'Em Andamento'}
                                    </span>
                                    
                                    {/* ID */}
                                    <span className="text-xs font-mono text-slate-400">{plan.id}</span>

                                    {/* Origin Badge (OL vs RL) */}
                                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide
                                        ${plan.originType === 'OL' 
                                            ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'}
                                    `}>
                                        {plan.originType === 'OL' ? <ClipboardCheck size={12}/> : <Scale size={12}/>}
                                        {plan.originType === 'OL' ? 'Obrigação' : 'Requisito'}
                                        <span className="opacity-60 border-l ml-1 pl-1 border-current">{plan.originId}</span>
                                    </span>
                                </div>

                                <h3 className="text-sm font-bold text-slate-800 mb-4">{plan.title}</h3>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div>
                                        <span className="block text-slate-400 mb-1">Responsável</span>
                                        <div className="font-medium text-slate-700 flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold">{plan.responsible.charAt(0)}</div>
                                            {plan.responsible}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 mb-1">Área</span>
                                        <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{plan.area}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 mb-1">Prazo</span>
                                        <span className={`font-medium flex items-center gap-1 ${plan.status === 'vencido' || plan.status === 'atrasado' ? 'text-rose-600' : 'text-slate-700'}`}>
                                            <Calendar size={12}/> {plan.deadline}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 shrink-0 md:flex-col border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-3 mt-3 md:mt-0">
                                <button className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded transition-colors" title="Ver Detalhes"><FileText size={18}/></button>
                                <button className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded transition-colors" title="Mais Opções"><MoreHorizontal size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}

                 {filteredPlans.length === 0 && (
                    <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <ListTodo size={48} className="mx-auto mb-4 opacity-20"/>
                        <p className="font-medium text-slate-500">Nenhum plano de ação encontrado.</p>
                        <p className="text-xs mt-1">
                            {filterOriginId 
                                ? `Não há planos vinculados ao item ${filterOriginId}.` 
                                : "Tente ajustar os filtros de busca."}
                        </p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Limpar Filtros</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const LegalUpdatesView = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-700">Feed de Atualizações</h3>
                    <div className="flex gap-2">
                        <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 outline-none">
                            <option>Todas as Fontes</option>
                            <option>Federal</option>
                            <option>Estadual</option>
                        </select>
                    </div>
                </div>

                {/* Feed Items */}
                <div className="space-y-6 relative border-l-2 border-slate-200 ml-4 pl-8 py-2">
                    {MOCK_LEGAL_UPDATES.map(update => (
                        <div key={update.id} className="relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-slate-50 border-2 border-[#0f766e] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#0f766e]"></div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[#0f766e] bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{update.type}</span>
                                        <span className="text-xs text-slate-500">• {update.scope}</span>
                                        
                                        {/* RL/OL Relation Badge in Updates */}
                                        <span className={`ml-2 text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase
                                            ${update.relatedTo === 'OL' ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}
                                        `}>
                                            Impacta {update.relatedTo}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">{update.date}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-2 hover:text-[#0f766e] cursor-pointer transition-colors flex items-center gap-2 group">
                                    {update.title}
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </h4>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    {update.summary}
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <span className={`text-xs font-bold flex items-center gap-1 ${update.impact === 'Alto' ? 'text-rose-600' : 'text-amber-600'}`}>
                                        <AlertTriangle size={12} /> Impacto {update.impact}
                                    </span>
                                    <button className="text-xs font-bold text-[#0f766e] flex items-center gap-1 hover:underline">
                                        Analisar Requisitos <ChevronRight size={12}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
                <div className="bg-[#0f766e] rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Carta de Atualização</h3>
                    <p className="text-teal-100 text-sm mb-4">Resumo mensal das principais mudanças legislativas aplicáveis ao seu negócio.</p>
                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-[#0f766e]">
                        <Download size={16} className="mr-2"/> Baixar PDF (Nov/2024)
                    </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-slate-700 text-sm mb-4">Fontes Monitoradas</h3>
                    <ul className="space-y-3">
                        {['Diário Oficial da União', 'Diário Oficial do Estado (AM)', 'Portal CONAMA', 'Agência Nacional de Águas'].map((src, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 size={14} className="text-emerald-500"/> {src}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const LibraryView = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Book size={32} className="text-slate-300"/>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Biblioteca de Normas</h3>
            <p className="text-slate-500 text-sm max-w-md text-center mt-2 mb-6">
                Acesse o texto integral de todas as leis, decretos e normas vinculadas aos seus requisitos legais.
            </p>
            <div className="flex gap-4">
                <Button variant="outline">Importar Documento</Button>
                <Button>Pesquisar na Base</Button>
            </div>
        </div>
    );
};
