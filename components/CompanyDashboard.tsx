
import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  GitFork, 
  History, 
  Edit3, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Briefcase,
  Shield,
  UserCheck,
  Globe,
  FileText
} from 'lucide-react';
import { Button } from './Button';
import { StatCard } from './StatCard';

interface CompanyDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
}

// --- MOCK DATA ---

const MOCK_COMPANY_DATA = {
  razaoSocial: 'Navegação Nóbrega Ltda',
  nomeFantasia: 'Navegação Nóbrega',
  cnpj: '34.486.076/0001-90',
  atividade: 'Navegação Fluvial',
  endereco: {
    cep: '69072-010',
    logradouro: 'Rua Rio Piraquê',
    numero: '91',
    bairro: 'Vila Buriti',
    cidade: 'Manaus',
    estado: 'AM',
    complemento: 'Fundos 2'
  }
};

const MOCK_TEAM = [
  { id: 1, name: 'Helisson Brandão', email: 'eng.seg@grupomady.com.br', role: 'Administrador', area: 'QSMS', status: 'active', avatar: 'HB' },
  { id: 2, name: 'Jamilson Carmo', email: 'ti@grupomady.com.br', role: 'Administrador', area: 'TI', status: 'active', avatar: 'JC' },
  { id: 3, name: 'Walisson', email: 'tst@grupomady.com.br', role: 'Administrador', area: 'QSMS', status: 'active', avatar: 'W' },
  { id: 4, name: 'Fábio Gabriel', email: 'operacional@grupomady.com.br', role: 'Administrador', area: 'Operacional', status: 'active', avatar: 'FG' },
  { id: 5, name: 'Maria Mady', email: 'mariamady@grupomady.com.br', role: 'Administrador', area: 'RH', status: 'active', avatar: 'MM' },
];

const MOCK_LOGS = [
  { id: 1, user: 'Helisson Brandão', action: 'atualizou', target: 'Usuario - Helisson Brandão', time: '01/12/2025, 13:33', type: 'update' },
  { id: 2, user: 'Helisson Brandão', action: 'respondeu', target: 'Obrigação Legal - OL-1024', time: '25/11/2025, 14:54', type: 'response' },
  { id: 3, user: 'Helisson Brandão', action: 'respondeu', target: 'Obrigação Legal - OL-389', time: '25/11/2025, 14:44', type: 'response' },
  { id: 4, user: 'Helisson Brandão', action: 'respondeu', target: 'Obrigação Legal - OL-379', time: '21/11/2025, 14:48', type: 'response' },
  { id: 5, user: 'Fábio Gabriel', action: 'visualizou', target: 'Documento - Licença Ambiental', time: '20/11/2025, 09:12', type: 'view' },
];

const MOCK_ORG_AREAS = [
  { id: 1, name: 'Diretoria', parent: null, color: 'bg-slate-800 text-white' },
  { id: 2, name: 'Administrativo', parent: 1, color: 'bg-emerald-600 text-white' },
  { id: 3, name: 'Operacional', parent: 1, color: 'bg-emerald-600 text-white' },
  { id: 4, name: 'QSMS', parent: 3, color: 'bg-teal-500 text-white' },
  { id: 5, name: 'RH', parent: 2, color: 'bg-teal-500 text-white' },
  { id: 6, name: 'TI', parent: 2, color: 'bg-teal-500 text-white' },
];

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ 
  viewMode = 'empresa-dados', 
  onChangeView = (_: string) => {} 
}) => {
  
  // Mapping views to tabs
  const activeTab = viewMode.replace('empresa-', '') || 'dados';

  const renderContent = () => {
    switch(activeTab) {
      case 'dados': return <CompanyOverview />;
      case 'org': return <CompanyStructure />;
      case 'team': return <CompanyPeople />;
      case 'log': return <CompanyAudit />;
      default: return <CompanyOverview />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Hub Corporativo</h1>
          <p className="text-sm text-slate-500">Gestão centralizada de dados, estrutura e acessos da organização.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                Plano Enterprise Ativo
            </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto custom-scrollbar" aria-label="Tabs">
          {[
            { id: 'dados', label: 'Corporativo', icon: Building2 },
            { id: 'org', label: 'Estrutura', icon: GitFork },
            { id: 'team', label: 'Colaboradores', icon: Users },
            { id: 'log', label: 'Auditoria', icon: History },
          ].map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
                <button
                  key={tab.id}
                  onClick={() => onChangeView(`empresa-${tab.id}`)}
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

const CompanyOverview = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 shrink-0">
                    LOGO
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-800">{MOCK_COMPANY_DATA.nomeFantasia}</h2>
                    <p className="text-slate-500">{MOCK_COMPANY_DATA.razaoSocial}</p>
                    <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                           CNPJ: {MOCK_COMPANY_DATA.cnpj}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                           {MOCK_COMPANY_DATA.atividade}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">Remover Imagem</Button>
                    <Button size="sm">Alterar Logo</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Address Section */}
                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <MapPin size={18} className="text-slate-400" />
                            Endereço Principal
                        </h3>
                        <button className="text-[#0f766e] hover:underline text-xs font-medium">Editar</button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">CEP</label>
                            <p className="text-sm font-medium text-slate-800">{MOCK_COMPANY_DATA.endereco.cep}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Cidade/UF</label>
                            <p className="text-sm font-medium text-slate-800">{MOCK_COMPANY_DATA.endereco.cidade} / {MOCK_COMPANY_DATA.endereco.estado}</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Logradouro</label>
                            <p className="text-sm font-medium text-slate-800">{MOCK_COMPANY_DATA.endereco.logradouro}, {MOCK_COMPANY_DATA.endereco.numero}</p>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Bairro</label>
                            <p className="text-sm font-medium text-slate-800">{MOCK_COMPANY_DATA.endereco.bairro}</p>
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Complemento</label>
                            <p className="text-sm font-medium text-slate-800">{MOCK_COMPANY_DATA.endereco.complemento}</p>
                        </div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-700">Uso do Sistema</h3>
                    </div>
                    <div className="p-6 flex-1 space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Usuários</span>
                                <span className="font-medium text-slate-800">8 / 20</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                         <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Documentos</span>
                                <span className="font-medium text-slate-800">42 / 200</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                             <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                                <span>Módulos Ativos:</span>
                             </div>
                             <div className="flex gap-2">
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] rounded border border-green-100 font-bold uppercase">Conformidade</span>
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] rounded border border-purple-100 font-bold uppercase">Docs</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CompanyStructure = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-700">Organograma Corporativo</h3>
                <Button size="sm"><Plus size={16} className="mr-2"/> Nova Área</Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-8 min-h-[400px] flex justify-center items-start overflow-auto relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                
                {/* CSS-only simple Tree visualization */}
                <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
                    
                    {/* Level 1 */}
                    <OrgNode node={MOCK_ORG_AREAS[0]} />
                    
                    {/* Connector */}
                    <div className="w-px h-8 bg-slate-300 -my-4"></div>
                    <div className="w-1/2 h-px bg-slate-300"></div>

                    {/* Level 2 */}
                    <div className="flex justify-around w-full gap-8">
                         <div className="flex flex-col items-center w-1/3">
                             <div className="h-4 w-px bg-slate-300 mb-4"></div>
                             <OrgNode node={MOCK_ORG_AREAS[1]} />
                             {/* Children of Admin */}
                             <div className="h-4 w-px bg-slate-300"></div>
                             <div className="w-full h-px bg-slate-300 relative">
                                <div className="absolute left-1/4 h-4 w-px bg-slate-300 top-0"></div>
                                <div className="absolute right-1/4 h-4 w-px bg-slate-300 top-0"></div>
                             </div>
                             <div className="flex justify-around w-full mt-4 gap-2">
                                 <OrgNode node={MOCK_ORG_AREAS[4]} small />
                                 <OrgNode node={MOCK_ORG_AREAS[5]} small />
                             </div>
                         </div>

                         <div className="flex flex-col items-center w-1/3">
                             <div className="h-4 w-px bg-slate-300 mb-4"></div>
                             <OrgNode node={MOCK_ORG_AREAS[2]} />
                             <div className="h-4 w-px bg-slate-300"></div>
                             <OrgNode node={MOCK_ORG_AREAS[3]} small />
                         </div>
                    </div>
                </div>

            </div>

            {/* List View of Areas */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm">Lista de Áreas e Responsáveis</h4>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">Área</th>
                            <th className="px-6 py-3">Nível Hierárquico</th>
                            <th className="px-6 py-3">Responsável</th>
                            <th className="px-6 py-3 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ORG_AREAS.map(area => (
                            <tr key={area.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 font-medium text-slate-700">{area.name}</td>
                                <td className="px-6 py-3 text-slate-500">{area.parent ? 'Departamento / Setor' : 'Diretoria'}</td>
                                <td className="px-6 py-3 text-slate-500 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                        <UserCheck size={12}/>
                                    </div>
                                    <span className="text-xs">Não definido</span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-slate-400 hover:text-[#0f766e]"><Edit3 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const OrgNode = ({ node, small }: { node: any, small?: boolean }) => (
    <div className={`
        flex flex-col items-center justify-center rounded-lg shadow-sm border border-slate-200/50 px-4 py-2 transition-all hover:shadow-md cursor-pointer
        ${small ? 'min-w-[100px] text-xs' : 'min-w-[160px]'}
        ${node.color}
    `}>
        <span className={`font-bold ${small ? 'text-xs' : 'text-sm'}`}>{node.name}</span>
        {!small && <span className="text-[10px] opacity-80 uppercase tracking-wider mt-1">12 Colaboradores</span>}
    </div>
);


const CompanyPeople = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar colaborador..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e] w-64"
                        />
                    </div>
                    <button className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50">
                        <Filter size={18} />
                    </button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Convidar Externo</Button>
                    <Button size="sm"><Plus size={16} className="mr-2"/> Novo Usuário</Button>
                </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_TEAM.map(user => (
                    <div key={user.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all flex flex-col group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center text-[#0f766e] font-bold text-lg shadow-inner">
                                    {user.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Briefcase size={10} /> {user.role}
                                    </span>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-slate-600">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                        
                        <div className="mt-auto space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Mail size={14} className="text-slate-400" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Shield size={14} className="text-slate-400" />
                                Área: <span className="font-medium bg-slate-100 px-1.5 rounded">{user.area}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex-1 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200">
                                Editar
                            </button>
                            <button className="flex-1 py-1.5 text-xs font-medium text-[#0f766e] bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-100">
                                Ver Perfil
                            </button>
                        </div>
                    </div>
                ))}

                {/* External User Card Placeholder */}
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center text-center text-slate-400 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-all min-h-[220px]">
                    <Globe size={32} className="mb-2 opacity-50"/>
                    <span className="text-sm font-medium">Adicionar Contato Externo</span>
                    <span className="text-xs mt-1">Auditores, Fiscais ou Consultores</span>
                </div>
            </div>
        </div>
    );
}

const CompanyAudit = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm">
                 <History size={20} />
                 <span>O log de atividades registra todas as alterações críticas realizadas no sistema nos últimos 12 meses.</span>
             </div>

             <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 py-2">
                {MOCK_LOGS.map((log) => (
                    <div key={log.id} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm
                            ${log.type === 'update' ? 'bg-amber-400' : log.type === 'response' ? 'bg-emerald-500' : 'bg-blue-400'}
                        `}></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <p className="text-sm text-slate-800">
                                    <span className="font-bold">{log.user}</span> {log.action} <span className="font-medium bg-slate-100 px-1 rounded text-slate-600">{log.target}</span>
                                </p>
                            </div>
                            <div className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                                <History size={12} />
                                {log.time}
                            </div>
                            <div className="sm:ml-4">
                                <button className="text-xs font-bold text-[#0f766e] border border-[#0f766e] px-3 py-1 rounded hover:bg-[#0f766e] hover:text-white transition-colors">
                                    VER DETALHES
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
             
             <div className="text-center pt-4">
                <Button variant="ghost" size="sm">Carregar Mais Registros</Button>
             </div>
        </div>
    );
}
