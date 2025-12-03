
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  FileText, 
  Bell, 
  Folder, 
  ChevronDown, 
  ChevronRight,
  Scale,
  ChevronUp,
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'ol': true,
    'rl': false,
    'doc': false,
    'empresa': false,
    'spl': true,
    'docs': true
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Modern SubMenuItem with Left Accent
  const SubMenuItem = ({ label, viewId, isActive }: { label: string, viewId: string, isActive?: boolean }) => (
    <div 
      onClick={() => onChangeView(viewId)}
      className={`
        relative pl-11 pr-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200
        ${isActive 
          ? 'text-white' 
          : 'text-slate-400 hover:text-slate-200'}
      `}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-[#0f766e] rounded-r-full shadow-[0_0_10px_rgba(15,118,110,0.5)]"></div>
      )}
      {label}
    </div>
  );

  // Group Header
  const MenuGroup = ({ label, id, children }: { label: string, id: string, children?: React.ReactNode }) => (
    <div className="mb-1">
      <div 
        onClick={() => toggleMenu(id)}
        className="flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors select-none group"
      >
        <span>{label}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${expandedMenus[id] ? 'rotate-180' : ''}`}/>
      </div>
      <div className={`grid transition-all duration-300 ease-in-out ${expandedMenus[id] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );

  // Main Item Wrapper
  const MainMenuItem = ({ icon: Icon, label, id, children }: { icon: any, label: string, id: string, children?: React.ReactNode }) => {
    const isOpen = expandedMenus[id];
    
    return (
      <div className="mb-2">
        <div 
          onClick={() => !collapsed && toggleMenu(id)}
          className={`
            flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group
            ${isOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            ${collapsed ? 'justify-center mx-0' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon size={20} className={`transition-colors ${isOpen ? 'text-[#0f766e]' : 'text-slate-500 group-hover:text-slate-300'}`}/>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </div>
          {!collapsed && children && (
             <ChevronDown size={14} className={`text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
          )}
        </div>
        {!collapsed && (
          <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden bg-slate-900/30 mx-2 rounded-b-lg mb-1">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`h-screen bg-[#0f172a] border-r border-slate-900 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} shrink-0 z-40 hidden md:flex`}>
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800/60 bg-[#0f172a]">
        <Logo size="sm" collapsed={collapsed} variant="light" />
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar">
        
        {/* DASHBOARDS SECTION */}
        {!collapsed ? (
          <div className="mb-6 pb-2">
             <div className="px-4 mb-2">
               <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Principal</h3>
             </div>
             
             {/* OL Dashboard Group */}
             <MenuGroup label="Obrigações Legais" id="ol">
                <SubMenuItem label="Visão Geral" viewId="home" isActive={currentView === 'home'} />
                <SubMenuItem label="Por Escopo" viewId="ol-escopo" isActive={currentView === 'ol-escopo'} />
                <SubMenuItem label="Por Área" viewId="ol-area" isActive={currentView === 'ol-area'} />
                <SubMenuItem label="Por Subárea" viewId="ol-sub" isActive={currentView === 'ol-sub'} />
                <SubMenuItem label="Por Responsável" viewId="ol-user" isActive={currentView === 'ol-user'} />
             </MenuGroup>

             {/* RL Dashboard Group */}
             <MenuGroup label="Requisitos Legais" id="rl">
                <SubMenuItem label="Visão Geral" viewId="rl-geral" isActive={currentView === 'rl-geral'}/>
                <SubMenuItem label="Por Escopo" viewId="rl-escopo" isActive={currentView === 'rl-escopo'}/>
                <SubMenuItem label="Por Área" viewId="rl-area" isActive={currentView === 'rl-area'}/>
                <SubMenuItem label="Por Subárea" viewId="rl-sub" isActive={currentView === 'rl-sub'}/>
                <SubMenuItem label="Por Responsável" viewId="rl-user" isActive={currentView === 'rl-user'}/>
                <SubMenuItem label="Por Tipo de Ato" viewId="rl-ato" isActive={currentView === 'rl-ato'}/>
             </MenuGroup>

             {/* DOC Dashboard Group */}
             <MenuGroup label="Documentos" id="doc">
                <SubMenuItem label="Visão Geral" viewId="doc-geral" isActive={currentView === 'doc-geral'}/>
                <SubMenuItem label="Por Área" viewId="doc-area" isActive={currentView === 'doc-area'}/>
                <SubMenuItem label="Por Usuário" viewId="doc-user" isActive={currentView === 'doc-user'}/>
            </MenuGroup>
          </div>
        ) : (
          <div className="flex justify-center mb-6">
             <div className="p-3 rounded-xl bg-[#0f766e] text-white shadow-lg shadow-teal-900/20">
                <LayoutDashboard size={24} />
             </div>
          </div>
        )}

        {/* AI MODULE */}
        <div className={`mb-2 ${collapsed ? 'flex justify-center' : 'px-2'}`}>
             <div 
                onClick={() => onChangeView('ai')}
                className={`
                    group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 select-none
                    ${currentView === 'ai' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                    ${collapsed ? 'justify-center w-12 h-12 px-0' : ''}
                `}
            >
                <Scale size={20} className={currentView === 'ai' ? 'text-white' : 'text-indigo-400'} />
                {!collapsed && (
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">Assistente SPL</span>
                        <span className="text-[10px] opacity-70 font-normal">Inteligência Artificial</span>
                    </div>
                )}
            </div>
        </div>

        {/* OPERATIONAL MENUS */}
        <div className="px-2 mt-4 mb-2">
           {!collapsed && <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider px-2 mb-2">Operacional</h3>}
        </div>

        <MainMenuItem icon={FileText} label="Gestão SPL" id="spl">
            <SubMenuItem label="Planos de Ação" viewId="spl-actions" isActive={currentView === 'spl-actions'} />
            <SubMenuItem label="Monitoramento" viewId="spl-updates" isActive={currentView === 'spl-updates'} />
            <SubMenuItem label="Biblioteca" viewId="spl-library" isActive={currentView === 'spl-library'} />
        </MainMenuItem>

        <MainMenuItem icon={Building2} label="Empresa" id="empresa">
            <SubMenuItem label="Dados Corporativos" viewId="empresa-dados" isActive={currentView === 'empresa-dados'} />
            <SubMenuItem label="Estrutura & Áreas" viewId="empresa-org" isActive={currentView === 'empresa-org'} />
            <SubMenuItem label="Equipe & Acessos" viewId="empresa-team" isActive={currentView === 'empresa-team'} />
            <SubMenuItem label="Auditoria" viewId="empresa-log" isActive={currentView === 'empresa-log'} />
        </MainMenuItem>
        
        <div 
            onClick={() => onChangeView('questionario')}
            className={`
               flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors 
               ${currentView === 'questionario' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'} 
               ${collapsed ? 'justify-center mx-0' : ''}
            `}
        >
            <ClipboardList size={20} className={currentView === 'questionario' ? 'text-[#0f766e]' : 'text-slate-500'} />
            {!collapsed && <span className="text-sm font-medium">Questionário</span>}
        </div>

        <MainMenuItem icon={Folder} label="Gestão Arquivos" id="docs">
            <SubMenuItem label="Fornecedores" viewId="documents-fornecedores" isActive={currentView === 'documents-fornecedores'} />
            <SubMenuItem label="Empresa" viewId="documents-empresa" isActive={currentView === 'documents-empresa'} />
            <SubMenuItem label="Lixeira" viewId="documents-lixeira" isActive={currentView === 'documents-lixeira'} />
        </MainMenuItem>
        
         <div 
            onClick={() => onChangeView('avisos')}
            className={`
               flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors 
               ${currentView === 'avisos' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'} 
               ${collapsed ? 'justify-center mx-0' : ''}
            `}
        >
            <Bell size={20} className={currentView === 'avisos' ? 'text-[#0f766e]' : 'text-slate-500'}/>
            {!collapsed && <span className="text-sm font-medium">Avisos</span>}
        </div>

      </div>

      <div className="p-4 border-t border-slate-800/60 bg-[#0f172a]">
        <button onClick={() => setCollapsed(!collapsed)} className="text-[10px] text-slate-500 hover:text-white uppercase tracking-wider font-bold flex items-center justify-center gap-2 w-full transition-colors h-8 rounded hover:bg-slate-800">
            {collapsed ? <ChevronRight size={14}/> : <><ChevronDown size={14} className="rotate-90" /> Recolher Menu</>}
        </button>
      </div>
    </div>
  );
};
