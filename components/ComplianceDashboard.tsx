
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { StatCard } from './StatCard';
import { Modal, ConfirmDialog } from './Modal';
import { InsightsChartCard, ChartFilterModal } from './InsightsChartCard';
import { 
  MonthlyTrendChart, 
  StatusDistributionChart, 
  BarComparisonChart, 
  RiskHeatmap,
  ProgressLineChart 
} from './Charts';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  ShieldAlert, 
  ChevronDown,
  ChevronRight, 
  MoreHorizontal, 
  Download, 
  BarChart3, 
  FileWarning,
  CalendarClock,
  UploadCloud,
  LayoutList,
  LayoutGrid,
  Star,
  BookOpen,
  Paperclip,
  Save,
  Droplets,
  Leaf,
  Zap,
  Scale,
  ScrollText,
  FileCheck,
  ArrowRight,
  User,
  X,
  FileText,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface ComplianceDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
  onNavigate: (view: string, params?: any) => void;
}

// --- MOCK DATA ---
// (Keeping mock data exactly as is, just compacted for this response)
const MOCK_USERS = [
  { id: 1, name: 'Cláudia Brandizzi', total: 873, attended: 419, notAttended: 0, notEvaluated: 0, reevaluate: 181, notApplicable: 273, future: 0, waiting: 0 },
  { id: 2, name: 'Walisson', total: 57, attended: 39, notAttended: 0, notEvaluated: 0, reevaluate: 15, notApplicable: 3, future: 0, waiting: 0 },
  { id: 3, name: 'Fábio Gabriel', total: 34, attended: 18, notAttended: 0, notEvaluated: 0, reevaluate: 11, notApplicable: 5, future: 0, waiting: 0 },
  { id: 4, name: 'Jamilson Carmo', total: 4, attended: 2, notAttended: 0, notEvaluated: 0, reevaluate: 0, notApplicable: 2, future: 0, waiting: 0 },
];
const MOCK_AREAS = [
  { id: 1, name: 'QSMS', total: 185, attended: 85, notAttended: 0, notEvaluated: 0, reevaluate: 20, notApplicable: 80, future: 0, waiting: 0 },
  { id: 2, name: 'SGI', total: 720, attended: 345, notAttended: 0, notEvaluated: 0, reevaluate: 181, notApplicable: 194, future: 0, waiting: 0 },
  { id: 3, name: 'Suprimentos', total: 57, attended: 28, notAttended: 0, notEvaluated: 0, reevaluate: 0, notApplicable: 29, future: 0, waiting: 0 },
  { id: 4, name: 'Administrativo', total: 27, attended: 22, notAttended: 0, notEvaluated: 0, reevaluate: 0, notApplicable: 5, future: 0, waiting: 0 },
];
const MOCK_SUBAREAS = [
  { id: 1, name: 'Meio Ambiente', total: 1173, attended: 475, notAttended: 0, notEvaluated: 1, reevaluate: 284, notApplicable: 413, future: 0, waiting: 0 },
  { id: 2, name: 'Qualidade', total: 156, attended: 103, notAttended: 0, notEvaluated: 0, reevaluate: 28, notApplicable: 25, future: 0, waiting: 0 },
];
const MOCK_RL_ACTS = [
  { id: 1, name: 'Lei Ordinária', total: 202, attended: 40, notAttended: 0, notEvaluated: 0, reevaluate: 20, notApplicable: 121, future: 0, waiting: 21 },
  { id: 2, name: 'Decreto', total: 107, attended: 18, notAttended: 0, notEvaluated: 0, reevaluate: 12, notApplicable: 74, future: 0, waiting: 3 },
  { id: 3, name: 'Norma Regulamentadora', total: 5, attended: 2, notAttended: 0, notEvaluated: 0, reevaluate: 3, notApplicable: 0, future: 0, waiting: 0 },
  { id: 4, name: 'Instrução Normativa', total: 60, attended: 7, notAttended: 0, notEvaluated: 0, reevaluate: 3, notApplicable: 40, future: 0, waiting: 10 },
  { id: 5, name: 'Resolução', total: 129, attended: 38, notAttended: 0, notEvaluated: 1, reevaluate: 32, notApplicable: 55, future: 0, waiting: 3 },
];
const MOCK_RL_SCOPE = [
  { id: 1, name: 'Meio Ambiente', total: 1173, attended: 475, notAttended: 0, notEvaluated: 1, reevaluate: 284, notApplicable: 413, future: 0, waiting: 0, applicability: 65 },
  { id: 2, name: 'Saúde e Segurança', total: 840, attended: 320, notAttended: 5, notEvaluated: 0, reevaluate: 110, notApplicable: 305, future: 10, waiting: 90, applicability: 48 },
  { id: 3, name: 'Responsabilidade Social', total: 250, attended: 180, notAttended: 0, notEvaluated: 0, reevaluate: 20, notApplicable: 50, future: 0, waiting: 0, applicability: 82 },
];
const MOCK_DOCS_AREAS = [
  { id: 1, name: 'Recursos Humanos', total: 450, attended: 400, notAttended: 5, notEvaluated: 0, reevaluate: 20, notApplicable: 25, future: 0, waiting: 0 },
  { id: 2, name: 'Jurídico', total: 120, attended: 110, notAttended: 2, notEvaluated: 0, reevaluate: 5, notApplicable: 3, future: 0, waiting: 0 },
  { id: 3, name: 'Operações', total: 300, attended: 250, notAttended: 10, notEvaluated: 0, reevaluate: 15, notApplicable: 25, future: 0, waiting: 0 },
];
const MOCK_DOCS_USERS = [
  { id: 1, name: 'Camila Mady', total: 150, attended: 145, notAttended: 0, notEvaluated: 0, reevaluate: 5, notApplicable: 0, future: 0, waiting: 0 },
  { id: 2, name: 'João Silva', total: 45, attended: 30, notAttended: 5, notEvaluated: 0, reevaluate: 0, notApplicable: 10, future: 0, waiting: 0 },
];
const MOCK_DETAILED_ITEMS = [
  {
    id: 'OL-1',
    type: 'OL',
    description: 'A organização possui licença ambiental (Licença de Operação - LO) válida para as suas atividades junto ao órgão ambiental competente?',
    scope: 'Meio Ambiente; ESG',
    theme: 'Licenciamento Ambiental',
    subtheme: '-',
    area: 'QSMS',
    subArea: 'Meio Ambiente',
    user: 'Cláudia Brandizzi',
    risk: 'Alto',
    status: 'conforme', 
    related: ['RL-191-Portaria IPAAM 23/2010 (AM)', 'ISO 14001', 'RL-90-Lei 1532/1982 (AM)', 'RL-6743-Lei 15190/2025'],
    evidence: 'LO nº 452/2024 válida até 12/2026',
    lastUpdate: '20/11/2024'
  },
  {
    id: 'OL-2',
    type: 'OL',
    description: 'A organização publicou a concessão das licenças ambientais em diário oficial ou jornal de grande circulação?',
    scope: 'ESG; Meio Ambiente',
    theme: 'Licenciamento Ambiental',
    subtheme: '-',
    area: 'QSMS',
    subArea: 'Meio Ambiente',
    user: 'Cláudia Brandizzi',
    risk: 'Alto',
    status: 'conforme',
    related: ['RL-128-Resolução CONAMA 281/2001', 'RL-6743-Lei 15190/2025'],
    evidence: 'Publicação DOE-AM edição 12.500 pág 34',
    lastUpdate: '15/10/2024'
  },
  {
    id: 'OL-3',
    type: 'OL',
    description: 'A organização paga em dia as taxas de licenciamento ambiental para o órgão licenciador competente?',
    scope: 'Meio Ambiente; ESG',
    theme: 'Licenciamento Ambiental; Tributos',
    subtheme: '-',
    area: 'SGI',
    subArea: 'Meio Ambiente',
    user: 'Cláudia Brandizzi',
    risk: 'Alto',
    status: 'vencido',
    related: ['RL-55-Lei 3785/2012 (AM)', 'RL-3207-Portaria IPAAM 74/2020 (AM)'],
    evidence: 'Pendente comprovante Out/2024',
    lastUpdate: '05/01/2025'
  },
  {
    id: 'RL-NR10',
    type: 'RL',
    description: 'Instalações elétricas devem possuir proteção contra incêndio e explosão conforme normas vigentes.',
    scope: 'Segurança do Trabalho',
    theme: 'NR-10',
    subtheme: 'Instalações Elétricas',
    area: 'Manutenção',
    subArea: 'Elétrica',
    user: 'Walisson',
    risk: 'Crítico',
    status: 'conforme',
    related: [],
    legalText: '10.9.1 As áreas onde houver instalações ou equipamentos elétricos devem ser dotadas de proteção contra incêndio e explosão, conforme disposto na NR-23.',
    lastUpdate: 'Revisão NR-10 2024'
  },
  {
    id: 'RL-128',
    type: 'RL',
    description: 'Dispõe sobre modelos de publicação de pedidos de licenciamento em quaisquer de suas modalidades.',
    scope: 'Meio Ambiente',
    theme: 'Resolução CONAMA 281/2001',
    subtheme: 'Licenciamento',
    area: 'QSMS',
    subArea: 'Meio Ambiente',
    user: 'Cláudia Brandizzi',
    risk: 'Médio',
    status: 'avencer',
    related: [],
    legalText: 'Art. 1º Os órgãos ambientais deverão determinar que os pedidos de licenciamento, em quaisquer de suas modalidades, sua renovação e a respectiva concessão de licença sejam objeto de publicação.',
    lastUpdate: 'Consolidado 2023'
  }
];

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ 
  viewMode = 'home', 
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFormat, setViewFormat] = useState<'group' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<'new' | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterRisk, setFilterRisk] = useState<string>('Todos');
  const [filterDate, setFilterDate] = useState<string>('Qualquer data');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const isRL = viewMode.startsWith('rl');
  const isDoc = viewMode.startsWith('doc');
  const isOL = !isRL && !isDoc;

  useEffect(() => {
    setFilterStatus('Todos');
    setFilterRisk('Todos');
    setSearchTerm('');
    setIsFilterOpen(false);
  }, [viewMode]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ message: msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        showToast("Relatório exportado com sucesso para seu e-mail!");
    }, 1500);
  };

  const handleSaveNewItem = () => {
      setActiveModal(null);
      showToast("Novo item cadastrado com sucesso!");
  };

  const getListData = () => {
    switch (viewMode) {
      case 'ol-user': return MOCK_USERS;
      case 'ol-area': return MOCK_AREAS;
      case 'ol-sub': return MOCK_SUBAREAS;
      case 'ol-escopo': return MOCK_RL_SCOPE;
      case 'rl-user': return MOCK_USERS; 
      case 'rl-area': return MOCK_AREAS; 
      case 'rl-sub': return MOCK_SUBAREAS; 
      case 'rl-ato': return MOCK_RL_ACTS;
      case 'rl-escopo': return MOCK_RL_SCOPE;
      case 'doc-user': return MOCK_DOCS_USERS;
      case 'doc-area': return MOCK_DOCS_AREAS;
      case 'doc-sub': return MOCK_DOCS_AREAS;
      default: return [];
    }
  };

  const getDetailedItems = () => {
      const type = isRL ? 'RL' : isOL ? 'OL' : 'DOC';
      if (type === 'DOC') return []; 
      
      return MOCK_DETAILED_ITEMS.filter(item => {
          if (item.type !== type) return false;
          
          const matchesSearch = 
            (item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) || 
            (String(item.id).toLowerCase().includes(searchTerm.toLowerCase()));
          
          if (!matchesSearch) return false;

          if (filterStatus !== 'Todos') {
             if (filterStatus === 'Conforme' && item.status !== 'conforme') return false;
             if (filterStatus === 'Vencido' && item.status !== 'vencido') return false;
             if (filterStatus === 'A Vencer' && item.status !== 'avencer') return false;
          }

          if (filterRisk !== 'Todos' && item.risk !== filterRisk) return false;

          return true;
      });
  };

  const listData = getListData().filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const detailedItems = getDetailedItems();

  const getDashboardTitle = () => {
    if (isRL) return 'Requisitos Legais';
    if (isDoc) return 'Gestão de Documentos';
    return 'Obrigações Legais';
  };

  const getContextTitle = () => {
    if (viewMode.includes('user')) return 'Usuário';
    if (viewMode.includes('area')) return 'Área';
    if (viewMode.includes('sub')) return 'Subárea';
    if (viewMode.includes('ato')) return 'Tipo de Ato';
    if (viewMode.includes('escopo')) return 'Escopo';
    return 'Item';
  };

  const isScopeView = viewMode === 'rl-escopo' || viewMode === 'ol-escopo';
  const isActView = viewMode === 'rl-ato';
  const isGeneralView = viewMode === 'home' || viewMode === 'rl-geral' || viewMode === 'doc-geral';

  return (
    <div className="space-y-8 animate-fade-in-up pb-12 relative max-w-[1600px] mx-auto">
      
      {toast && (
          <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-3 animate-slide-in
              ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}
          `}>
              {toast.type === 'success' ? <CheckCircle2 size={20}/> : <XCircle size={20}/>}
              <span className="text-sm font-medium">{toast.message}</span>
              <button onClick={() => setToast(null)}><X size={14} className="opacity-50 hover:opacity-100"/></button>
          </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{getDashboardTitle()}</h1>
            <p className="text-slate-500 mt-1">
               {isDoc 
                 ? 'Gestão de evidências, licenças e certificados' 
                 : 'Painel de controle de conformidade e riscos corporativos'
               }
            </p>
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Pesquisar indicadores..."
                    className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f766e] w-full md:w-64 bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Button size="sm" onClick={() => setActiveModal('new')} className="hidden sm:flex shadow-md shadow-teal-900/10">
               <Plus size={16} className="mr-2"/> Novo Registro
            </Button>
          </div>
        </div>
        
        {/* Modern Underline Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          {(isRL ? [
            { id: 'rl-geral', label: 'Visão Geral' },
            { id: 'rl-escopo', label: 'Por Escopo' },
            { id: 'rl-area', label: 'Por Área' },
            { id: 'rl-ato', label: 'Por Tipo de Ato' },
          ] : isDoc ? [
            { id: 'doc-geral', label: 'Visão Geral' },
            { id: 'doc-area', label: 'Por Área' },
            { id: 'doc-user', label: 'Por Usuário' },
          ] : [
            { id: 'home', label: 'Visão Geral' },
            { id: 'ol-escopo', label: 'Por Escopo' },
            { id: 'ol-area', label: 'Por Área' },
            { id: 'ol-user', label: 'Por Responsável' },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`
                pb-3 text-sm font-medium transition-all relative
                ${viewMode === tab.id 
                  ? 'text-[#0f766e]' 
                  : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {tab.label}
              {viewMode === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0f766e] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* --- VIEW: GERAL (DASHBOARD GRID) --- */}
      {isGeneralView && (
        <div className="space-y-8 animate-fade-in">
          
          {/* 1. KPIs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isDoc ? (
                <>
                    <StatCard label="Documentos Válidos" value={850} icon={FileCheck} color="green" isActive />
                    <StatCard label="Vencidos" value={18} icon={FileWarning} color="red" subLabel="Ação imediata necessária" />
                    <StatCard label="A Vencer (30 dias)" value={45} icon={CalendarClock} color="yellow" subLabel="Planejar renovação" />
                    <StatCard label="Não Preenchido" value={137} icon={UploadCloud} color="gray" subLabel="Upload pendente" />
                </>
            ) : (
                <>
                    <StatCard label={isRL ? "Conhecimento" : "Atendido"} value={isRL ? 215 : 494} icon={isRL ? BookOpen : CheckCircle2} color="green" isActive />
                    <StatCard label="Não Atendido" value={0} icon={XCircle} color="red" />
                    <StatCard label="Reavaliar" value={289} icon={RefreshCw} color="purple" subLabel="Ações pendentes" />
                    <StatCard label="Total Consolidado" value={1229} icon={BarChart3} color="gray" />
                </>
            )}
          </div>
          
          {/* 2. Charts Section */}
          {isOL ? (
              <OLSpecificCharts /> 
          ) : isRL ? (
              <RLSpecificCharts />
          ) : (
              <DocSpecificCharts />
          )}
        </div>
      )}

      {/* --- VIEW: LIST CONTENT --- */}
      {!isGeneralView && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center pb-4">
             <h3 className="font-bold text-slate-800 text-lg">
                 Resultados <span className="text-slate-400 font-normal ml-2">({listData.length || detailedItems.length})</span>
             </h3>
             {/* Filter Toggle */}
             <div className="flex gap-2">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50`}
                >
                   <Filter size={16} />
                   <span>Filtros</span>
                </button>
             </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-fade-in-down">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0f766e] bg-slate-50"
                    >
                        <option value="Todos">Todos</option>
                        <option value="Conforme">Conforme</option>
                        <option value="A Vencer">A Vencer</option>
                        <option value="Vencido">Vencido</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Risco</label>
                    <select 
                        value={filterRisk}
                        onChange={(e) => setFilterRisk(e.target.value)}
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0f766e] bg-slate-50"
                    >
                        <option value="Todos">Todos</option>
                        <option value="Alto">Alto</option>
                        <option value="Médio">Médio</option>
                        <option value="Baixo">Baixo</option>
                    </select>
                </div>
            </div>
          )}

          {/* Content Rendering */}
          {isScopeView ? (
             <div className="space-y-6">
                {listData.map((item) => (
                    <ScopeViewRow key={item.id} data={item} />
                ))}
             </div>
          ) : isActView ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listData.map((item) => (
                    <ActCard key={item.id} data={item} />
                ))}
             </div>
          ) : (viewFormat as string) === 'list' && (isRL || isOL) ? (
              <div className="space-y-4">
                  {detailedItems.map((item) => (
                      <DetailedRequirementCard 
                        key={item.id} 
                        data={item} 
                        onNavigate={onNavigate} 
                      />
                  ))}
              </div>
          ) : (
            <div className="space-y-4">
                {listData.map((item) => (
                <DashboardListRow 
                    key={item.id} 
                    data={item} 
                    context={getContextTitle()}
                    isRL={isRL}
                    isDoc={isDoc}
                />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MONTHLY_TREND_DATA = [
  { month: 'Jan', conformidade: 72, naoConformidade: 8 },
  { month: 'Fev', conformidade: 75, naoConformidade: 6 },
  { month: 'Mar', conformidade: 78, naoConformidade: 5 },
  { month: 'Abr', conformidade: 80, naoConformidade: 4 },
  { month: 'Mai', conformidade: 79, naoConformidade: 5 },
  { month: 'Jun', conformidade: 82, naoConformidade: 3 },
  { month: 'Jul', conformidade: 85, naoConformidade: 3 },
  { month: 'Ago', conformidade: 83, naoConformidade: 4 },
  { month: 'Set', conformidade: 86, naoConformidade: 2 },
  { month: 'Out', conformidade: 88, naoConformidade: 2 },
  { month: 'Nov', conformidade: 90, naoConformidade: 2 },
  { month: 'Dez', conformidade: 92, naoConformidade: 1 }
];

const STATUS_DISTRIBUTION_DATA = [
  { name: 'Conforme', value: 494, color: '#10b981' },
  { name: 'Pendente', value: 289, color: '#f59e0b' },
  { name: 'Vencido', value: 45, color: '#ef4444' },
  { name: 'N/A', value: 156, color: '#94a3b8' }
];

const AREA_COMPARISON_DATA = [
  { name: 'QSMS', atual: 85, anterior: 72 },
  { name: 'SGI', atual: 92, anterior: 85 },
  { name: 'Jurídico', atual: 78, anterior: 70 },
  { name: 'RH', atual: 95, anterior: 90 },
  { name: 'Operações', atual: 88, anterior: 80 }
];

const RISK_DATA = [
  { area: 'Meio Ambiente', baixo: 40, medio: 25, alto: 10, critico: 5 },
  { area: 'Segurança', baixo: 35, medio: 30, alto: 15, critico: 8 },
  { area: 'Qualidade', baixo: 50, medio: 20, alto: 8, critico: 2 },
  { area: 'Trabalhista', baixo: 45, medio: 28, alto: 12, critico: 3 }
];

const PROGRESS_DATA = [
  { name: 'Jan', progresso: 65, meta: 80 },
  { name: 'Fev', progresso: 70, meta: 80 },
  { name: 'Mar', progresso: 72, meta: 80 },
  { name: 'Abr', progresso: 78, meta: 80 },
  { name: 'Mai', progresso: 82, meta: 85 },
  { name: 'Jun', progresso: 85, meta: 85 }
];

const OL_BY_SCOPE_DATA = [
    { name: 'Meio Ambiente', atendido: 475, pendente: 284, naoAplicavel: 413, color: '#10b981' },
    { name: 'Saúde e Segurança', atendido: 320, pendente: 110, naoAplicavel: 305, color: '#3b82f6' },
    { name: 'Responsabilidade Social', atendido: 180, pendente: 20, naoAplicavel: 50, color: '#8b5cf6' },
];

const OL_BY_AREA_DATA = [
    { name: 'QSMS', value: 185, color: '#0f766e' },
    { name: 'SGI', value: 720, color: '#0ea5e9' },
    { name: 'Suprimentos', value: 57, color: '#f59e0b' },
    { name: 'Administrativo', value: 27, color: '#8b5cf6' },
];

const OL_BY_RESPONSIBLE_DATA = [
    { name: 'Cláudia Brandizzi', atendido: 419, reavaliar: 181, naoAplicavel: 273 },
    { name: 'Walisson', atendido: 39, reavaliar: 15, naoAplicavel: 3 },
    { name: 'Fábio Gabriel', atendido: 18, reavaliar: 11, naoAplicavel: 5 },
    { name: 'Jamilson Carmo', atendido: 2, reavaliar: 0, naoAplicavel: 2 },
];

const OLSpecificCharts = () => {
    const percentage = 83;
    const [showFilterModal, setShowFilterModal] = useState(false);

    const handleExport = (chartName: string) => {
        console.log(`Exporting ${chartName}...`);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
                    <div className="text-center mb-4">
                        <h4 className="text-sm font-bold text-slate-700">Índice de Conformidade</h4>
                        <span className="text-xs text-slate-400">Meta Mensal: 80%</span>
                    </div>

                    <div className="relative w-64 h-32 mt-2">
                        <svg height="100%" width="100%" viewBox="0 0 200 110" className="overflow-visible">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="#e2e8f0" strokeWidth="12" fill="none" strokeLinecap="round"/>
                            <path d="M 20 100 A 80 80 0 0 1 180 100" stroke="url(#gradient-ol)" strokeWidth="12" fill="none" strokeLinecap="round"
                                strokeDasharray={Math.PI * 80}
                                strokeDashoffset={(Math.PI * 80) * (1 - percentage/100)}
                                className="transition-all duration-1000 ease-out"/>
                            <defs>
                                <linearGradient id="gradient-ol" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center translate-y-2">
                            <span className="text-5xl font-bold text-slate-800 tracking-tighter">{percentage}%</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center gap-12 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">494</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atendidos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-500">289</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendentes</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-[300px]">
                    <h4 className="text-sm font-bold text-slate-700 mb-6">Performance por Tema</h4>
                    <div className="space-y-5 flex-1">
                        {[
                            { label: 'Licenciamento', val: 95, icon: FileText, color: 'bg-emerald-500' },
                            { label: 'Resíduos Sólidos', val: 72, icon: Leaf, color: 'bg-teal-500' },
                            { label: 'Efluentes Líquidos', val: 100, icon: Droplets, color: 'bg-sky-500' },
                            { label: 'Segurança (NRs)', val: 68, icon: Zap, color: 'bg-amber-500' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <item.icon size={16} className="text-slate-400"/> {item.label}
                                    </span>
                                    <span className="text-xs font-bold text-slate-900">{item.val}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <StatusDistributionChart data={STATUS_DISTRIBUTION_DATA} title="Distribuição por Status" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <InsightsChartCard 
                    title="OL por Escopo" 
                    subtitle="Distribuição de obrigações legais"
                    onExport={() => handleExport('OL por Escopo')}
                    onFilter={() => setShowFilterModal(true)}
                    height="h-72"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={OL_BY_SCOPE_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="atendido" stackId="a" fill="#10b981" name="Atendido" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="pendente" stackId="a" fill="#f59e0b" name="Pendente" />
                            <Bar dataKey="naoAplicavel" stackId="a" fill="#94a3b8" name="N/A" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </InsightsChartCard>

                <InsightsChartCard 
                    title="OL por Área" 
                    subtitle="Obrigações por departamento"
                    onExport={() => handleExport('OL por Área')}
                    onFilter={() => setShowFilterModal(true)}
                    height="h-72"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={OL_BY_AREA_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                            >
                                {OL_BY_AREA_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </InsightsChartCard>

                <InsightsChartCard 
                    title="OL por Responsável" 
                    subtitle="Performance individual"
                    onExport={() => handleExport('OL por Responsável')}
                    onFilter={() => setShowFilterModal(true)}
                    height="h-72"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={OL_BY_RESPONSIBLE_DATA} layout="vertical" margin={{ left: 0, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="atendido" stackId="a" fill="#10b981" name="Atendido" />
                            <Bar dataKey="reavaliar" stackId="a" fill="#8b5cf6" name="Reavaliar" />
                            <Bar dataKey="naoAplicavel" stackId="a" fill="#94a3b8" name="N/A" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </InsightsChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyTrendChart data={MONTHLY_TREND_DATA} title="Evolução da Conformidade" />
                <BarComparisonChart data={AREA_COMPARISON_DATA} title="Comparativo por Área" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskHeatmap data={RISK_DATA} title="Matriz de Riscos por Área" />
                <ProgressLineChart data={PROGRESS_DATA} title="Progresso vs Meta" />
            </div>

            <ChartFilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filtrar Dados"
                onApply={() => setShowFilterModal(false)}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Período</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                            <option>Últimos 30 dias</option>
                            <option>Últimos 90 dias</option>
                            <option>Último ano</option>
                            <option>Todo período</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                            <option>Todos</option>
                            <option>Atendido</option>
                            <option>Pendente</option>
                            <option>Não Aplicável</option>
                        </select>
                    </div>
                </div>
            </ChartFilterModal>
        </div>
    )
}

const RLSpecificCharts = () => {
    const rlStatusData = [
        { name: 'Conhecimento', value: 215, color: '#0f766e' },
        { name: 'Em Análise', value: 89, color: '#3b82f6' },
        { name: 'Pendente', value: 156, color: '#f59e0b' },
        { name: 'N/A', value: 340, color: '#94a3b8' }
    ];

    const rlTrendData = [
        { month: 'Jan', conformidade: 45, naoConformidade: 12 },
        { month: 'Fev', conformidade: 52, naoConformidade: 10 },
        { month: 'Mar', conformidade: 58, naoConformidade: 8 },
        { month: 'Abr', conformidade: 65, naoConformidade: 7 },
        { month: 'Mai', conformidade: 70, naoConformidade: 5 },
        { month: 'Jun', conformidade: 75, naoConformidade: 4 }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusDistributionChart data={rlStatusData} title="Requisitos por Status" />
                <MonthlyTrendChart data={rlTrendData} title="Evolução do Conhecimento Legal" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiskHeatmap data={RISK_DATA} title="Riscos por Escopo" />
                <BarComparisonChart data={AREA_COMPARISON_DATA} title="Requisitos por Área" />
            </div>
        </div>
    );
};

const DocSpecificCharts = () => {
    const docStatusData = [
        { name: 'Válidos', value: 850, color: '#10b981' },
        { name: 'Vencidos', value: 18, color: '#ef4444' },
        { name: 'A Vencer', value: 45, color: '#f59e0b' },
        { name: 'Pendente Upload', value: 137, color: '#94a3b8' }
    ];

    const docTrendData = [
        { month: 'Jan', conformidade: 820, naoConformidade: 30 },
        { month: 'Fev', conformidade: 835, naoConformidade: 25 },
        { month: 'Mar', conformidade: 840, naoConformidade: 20 },
        { month: 'Abr', conformidade: 845, naoConformidade: 18 },
        { month: 'Mai', conformidade: 848, naoConformidade: 15 },
        { month: 'Jun', conformidade: 850, naoConformidade: 18 }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusDistributionChart data={docStatusData} title="Documentos por Status" />
                <MonthlyTrendChart data={docTrendData} title="Evolução Documental" />
            </div>
            <BarComparisonChart data={AREA_COMPARISON_DATA} title="Documentos por Área" />
        </div>
    );
};


// --- REDESIGNED COMPONENT: DETAILED REQUIREMENT CARD (Clean SaaS) ---

interface DetailedRequirementCardProps {
    data: any;
    onNavigate: (view: string, params?: any) => void;
}

const DetailedRequirementCard: React.FC<DetailedRequirementCardProps> = ({ data, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isOL = data.type === 'OL';
    
    // Minimalist Badges
    const statusColor = data.status === 'conforme' ? 'text-emerald-600 bg-emerald-50' : 
                        data.status === 'vencido' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50';

    return (
        <div 
            className={`
                bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 
                ${isExpanded ? 'ring-1 ring-slate-200' : ''}
            `}
        >
            {/* Main Content */}
            <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-start gap-5">
                    
                    {/* Left: Icon Indicator */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isOL ? 'bg-sky-50 text-sky-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {isOL ? <CheckCircle2 size={20} /> : <Scale size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{data.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{data.theme}</span>
                            <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor}`}>
                                {data.status}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-slate-800 leading-relaxed mb-4 group-hover:text-[#0f766e] transition-colors">
                            {data.description}
                        </h3>

                        {/* Meta Grid */}
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {data.user?.charAt(0)}
                                </div>
                                <span className="truncate max-w-[120px]">{data.user}</span>
                            </div>
                            <div className="w-px h-3 bg-slate-200"></div>
                            <div className="flex items-center gap-1">
                                <span className="truncate max-w-[150px]">{data.scope}</span>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <span className={`text-xs font-bold ${data.risk === 'Alto' ? 'text-rose-500' : 'text-amber-500'}`}>
                                    Risco {data.risk}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Expand Arrow */}
                    <div className="shrink-0 pt-1">
                        <ChevronDown size={16} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}/>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 pb-6 pt-0 animate-fade-in pl-[76px]">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed">
                        <p className="font-medium text-slate-800 mb-1">{isOL ? 'Evidência:' : 'Texto Legal:'}</p>
                        {isOL ? data.evidence : data.legalText}
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs bg-white border-slate-200 text-slate-600"
                            onClick={(e) => { e.stopPropagation(); onNavigate('spl-actions', { search: String(data.id) }) }}
                        >
                            Ver Detalhes Completos <ArrowRight size={14} className="ml-1"/>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (Keeping ScopeViewRow, ActCard, DashboardListRow components, but styling updates would apply globally via CSS classes used)
const ActCard: React.FC<any> = ({ data }) => (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
        <h3 className="font-bold text-slate-800">{data.name}</h3>
        <div className="text-sm text-slate-500 mt-2">{data.total} Itens</div>
    </div>
);

const ScopeViewRow: React.FC<any> = ({ data }) => (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex justify-between items-center">
        <div>
            <h3 className="font-bold text-slate-800">{data.name}</h3>
            <span className="text-xs text-slate-500">{data.total} Requisitos</span>
        </div>
        <div className="text-2xl font-bold text-emerald-600">{data.applicability}%</div>
    </div>
);

const DashboardListRow: React.FC<any> = ({ data }) => (
    <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
        <span className="font-medium text-slate-700">{data.name}</span>
        <span className="text-sm text-slate-500">{data.total} Total</span>
    </div>
);
