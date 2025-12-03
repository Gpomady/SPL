
import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  ChevronRight,
  LayoutGrid,
  List,
  UploadCloud,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { Button } from './Button';

interface DocumentsDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
}

// --- MOCK DATA ---

const FOLDERS = [
  { id: 'f1', name: 'AMAZON LAB', type: 'provider', count: 12, status: 'ok' },
  { id: 'f2', name: 'AUTO POSTO MANACÁ', type: 'provider', count: 8, status: 'warning' },
  { id: 'f3', name: 'BUNZL EQUIPAMENTOS', type: 'provider', count: 45, status: 'ok' },
  { id: 'f4', name: 'CLÍNICA SANVIE', type: 'provider', count: 5, status: 'expired' },
  { id: 'f5', name: 'COMETAIS', type: 'provider', count: 18, status: 'ok' },
  { id: 'f6', name: 'ESTALEIRO BERING', type: 'provider', count: 22, status: 'ok' },
  { id: 'f7', name: 'IPIRANGA', type: 'provider', count: 30, status: 'ok' },
  { id: 'f8', name: 'JV COLETAS', type: 'provider', count: 15, status: 'ok' },
];

const COMPANY_FOLDERS = [
  { id: 'c1', name: 'Norma Técnica', type: 'company', count: 42, status: 'ok' },
  { id: 'c2', name: 'Plano de Ação', type: 'company', count: 12, status: 'ok' },
  { id: 'c3', name: 'Resposta OL', type: 'company', count: 156, status: 'ok' },
  { id: 'c4', name: 'Relatórios de Avaliação', type: 'company', count: 8, status: 'ok' },
];

const DOCUMENTS = [
  { 
    id: 1, 
    name: 'ANP', 
    folderId: 'f2', 
    status: 'valid', 
    validity: '22/01/2026', 
    emission: '22/10/2025', 
    number: '507',
    area: 'Suprimentos',
    category: 'Licenças'
  },
  { 
    id: 2, 
    name: 'IBAMA', 
    folderId: 'f2', 
    status: 'valid', 
    validity: '22/01/2026', 
    emission: '22/10/2025', 
    number: '7380780',
    area: 'Suprimentos',
    category: 'Ambiental'
  },
  { 
    id: 3, 
    name: 'LICENÇA DE OPERAÇÃO', 
    folderId: 'f2', 
    status: 'valid', 
    validity: '02/01/2030', 
    emission: '02/01/2025', 
    number: '009/04-09',
    area: 'Meio Ambiente',
    category: 'Ambiental'
  },
  { 
    id: 4, 
    name: 'Alvará de Funcionamento', 
    folderId: 'f2', 
    status: 'expired', 
    validity: '10/11/2024', 
    emission: '10/11/2023', 
    number: '2023/55',
    area: 'Administrativo',
    category: 'Legal'
  },
  { 
    id: 5, 
    name: 'AVCB', 
    folderId: 'f4', 
    status: 'warning', 
    validity: '30/12/2025', 
    emission: '01/01/2023', 
    number: 'B-29384',
    area: 'Segurança',
    category: 'Segurança'
  }
];

export const DocumentsDashboard: React.FC<DocumentsDashboardProps> = ({ 
  viewMode = 'documents-fornecedores', 
  onChangeView 
}) => {
  const [activeFolder, setActiveFolder] = useState<string | null>('f2');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFormat, setViewFormat] = useState<'list' | 'grid'>('list');

  // Logic to switch context based on viewMode
  const isCompany = viewMode === 'documents-empresa';
  const isTrash = viewMode === 'documents-lixeira';
  
  const currentFolders = isCompany ? COMPANY_FOLDERS : FOLDERS;
  const filteredFolders = currentFolders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const activeFolderData = currentFolders.find(f => f.id === activeFolder);
  const activeDocuments = DOCUMENTS.filter(d => d.folderId === activeFolder);

  return (
    <div className="flex h-[calc(100vh-80px)] -m-4 sm:-m-6 lg:-m-8 bg-white">
      
      {/* LEFT SIDEBAR: FOLDERS */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        
        {/* Header / Search */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
             <h2 className="font-bold text-slate-700 text-lg">
                {isCompany ? 'Documentos Internos' : isTrash ? 'Lixeira' : 'Fornecedores'}
             </h2>
             <div className="flex gap-1">
                <button className="p-1.5 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded" title="Nova Pasta">
                    <FolderOpen size={18} />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded" title="Ordenar">
                    <Filter size={18} />
                </button>
             </div>
          </div>
          
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
                type="text" 
                placeholder="Pesquisar pastas..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        {/* Folder List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {filteredFolders.map(folder => (
                <div 
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    className={`
                        flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all group
                        ${activeFolder === folder.id 
                            ? 'bg-white shadow-sm border border-slate-200' 
                            : 'hover:bg-slate-100 border border-transparent'}
                    `}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`relative shrink-0`}>
                             <Folder size={20} className={`${activeFolder === folder.id ? 'text-[#0f766e] fill-teal-50' : 'text-slate-400 fill-slate-50'}`} />
                             {/* Status Dot */}
                             {folder.status === 'expired' && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full ring-1 ring-white"></span>
                             )}
                             {folder.status === 'warning' && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full ring-1 ring-white"></span>
                             )}
                        </div>
                        <span className={`text-sm truncate font-medium ${activeFolder === folder.id ? 'text-slate-800' : 'text-slate-600'}`}>
                            {folder.name}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full group-hover:bg-white transition-colors">
                        {folder.count}
                    </span>
                </div>
            ))}
        </div>

        {/* Quick Stats Footer */}
        <div className="p-4 border-t border-slate-200 bg-white">
             <div className="flex items-center gap-2 text-xs text-slate-500">
                 <UploadCloud size={14} />
                 <span>Armazenamento: <strong className="text-slate-700">42%</strong> usado</span>
             </div>
             <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-[#0f766e] w-[42%] rounded-full"></div>
             </div>
        </div>
      </div>

      {/* RIGHT MAIN: DOCUMENTS */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden">
        
        {/* Toolbar */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-2">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     {activeFolderData ? activeFolderData.name : 'Selecione uma pasta'}
                 </h3>
                 {activeFolderData && (
                     <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                        Acompanhamento de Diplomas
                     </span>
                 )}
             </div>

             <div className="flex items-center gap-3">
                  <div className="flex bg-slate-100 rounded-lg p-1 mr-2">
                      <button 
                        onClick={() => setViewFormat('list')}
                        className={`p-1.5 rounded ${viewFormat === 'list' ? 'bg-white shadow text-[#0f766e]' : 'text-slate-400'}`}
                      >
                          <List size={16} />
                      </button>
                      <button 
                         onClick={() => setViewFormat('grid')}
                         className={`p-1.5 rounded ${viewFormat === 'grid' ? 'bg-white shadow text-[#0f766e]' : 'text-slate-400'}`}
                      >
                          <LayoutGrid size={16} />
                      </button>
                  </div>
                  <Button variant="outline" size="sm">
                      <Filter size={14} className="mr-2"/> Filtrar
                  </Button>
                  <Button variant="outline" size="sm">
                      <Download size={14} className="mr-2"/> Exportar
                  </Button>
                  <Button size="sm">
                      <Plus size={16} className="mr-2"/> Novo Documento
                  </Button>
             </div>
        </div>

        {/* Document List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
             {activeFolder ? (
                 <>
                    {/* Bulk Actions Bar */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
                            <input type="checkbox" className="rounded border-slate-300 text-[#0f766e] focus:ring-[#0f766e]" />
                            Selecionar todos (0)
                        </label>
                        <button className="flex items-center gap-1 hover:text-[#0f766e]">
                            <CheckCircle2 size={14} /> Recolher todos
                        </button>
                    </div>

                    {/* Documents List */}
                    <div className={viewFormat === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
                        {activeDocuments.length > 0 ? activeDocuments.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} viewFormat={viewFormat} />
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <FileText size={48} className="mb-4 opacity-50"/>
                                <p>Nenhum documento encontrado nesta pasta.</p>
                                <Button variant="outline" className="mt-4">Fazer Upload Agora</Button>
                            </div>
                        )}
                    </div>
                 </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Folder size={64} className="mb-4 opacity-20 text-[#0f766e]"/>
                    <h3 className="text-lg font-medium text-slate-600">Selecione uma pasta</h3>
                    <p>Navegue pelo menu lateral para visualizar os arquivos.</p>
                </div>
             )}
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENT: DOCUMENT CARD ---

interface DocumentCardProps {
  doc: any;
  viewFormat: 'list' | 'grid';
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, viewFormat }) => {
    
    // Status Logic
    const statusConfig = {
        valid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: CheckCircle2, label: 'Válido' },
        expired: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: AlertCircle, label: 'Vencido' },
        warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: AlertTriangle, label: 'A Vencer' },
    };

    const status = statusConfig[doc.status as keyof typeof statusConfig] || statusConfig.valid;
    const StatusIcon = status.icon;

    if (viewFormat === 'grid') {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all flex flex-col relative group">
                <div className="flex justify-between items-start mb-3">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.bg} ${status.text}`}>
                         <FileText size={20} />
                     </div>
                     <button className="text-slate-300 hover:text-slate-600">
                         <MoreVertical size={16} />
                     </button>
                </div>
                
                <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{doc.name}</h4>
                <p className="text-xs text-slate-500 mb-4">{doc.category} • Nº {doc.number}</p>

                <div className={`mt-auto flex items-center gap-2 text-xs font-medium px-2 py-1.5 rounded border ${status.bg} ${status.text} ${status.border}`}>
                    <StatusIcon size={12} />
                    <span>{status.label}: {doc.validity}</span>
                </div>
            </div>
        );
    }

    // List View Layout
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-4 group">
            
            {/* Checkbox */}
            <input type="checkbox" className="rounded border-slate-300 text-[#0f766e] focus:ring-[#0f766e] mt-1 md:mt-0" />

            {/* Icon / Status */}
            <div className="flex items-center gap-3 min-w-[200px]">
                 <div className={`p-2 rounded-lg ${status.bg} ${status.text}`}>
                     <StatusIcon size={18} />
                 </div>
                 <div>
                     <span className={`text-[10px] font-bold uppercase tracking-wide ${status.text} bg-white px-1.5 py-0.5 rounded border ${status.border} mb-1 inline-block`}>
                         {status.label}
                     </span>
                     <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                 </div>
            </div>

            {/* Meta Data */}
            <div className="flex flex-1 gap-6 text-xs text-slate-600 flex-wrap md:flex-nowrap">
                 <div className="min-w-[100px]">
                     <span className="block text-slate-400 mb-0.5 uppercase text-[9px]">Validade</span>
                     <span className={`font-mono font-medium ${doc.status === 'expired' ? 'text-rose-600' : ''}`}>{doc.validity}</span>
                 </div>
                 <div className="min-w-[100px]">
                     <span className="block text-slate-400 mb-0.5 uppercase text-[9px]">Número</span>
                     <span className="font-mono bg-slate-50 px-1 rounded border border-slate-100">{doc.number}</span>
                 </div>
                 <div className="min-w-[120px]">
                     <span className="block text-slate-400 mb-0.5 uppercase text-[9px]">Área Resp.</span>
                     <span>{doc.area}</span>
                 </div>
                 <div className="min-w-[120px]">
                     <span className="block text-slate-400 mb-0.5 uppercase text-[9px]">Emissão</span>
                     <span>{doc.emission}</span>
                 </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity ml-auto md:ml-0 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto justify-end">
                <button className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded" title="Visualizar">
                    <Eye size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded" title="Download">
                    <Download size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded" title="Mais">
                    <MoreVertical size={16} />
                </button>
            </div>
        </div>
    );
};
