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
  Target,
  BookOpen,
  Shield,
  Users,
  Settings,
  HelpCircle,
  Sparkles,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Layers,
  Database
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenSettings, onOpenHelp }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'compliance': true,
    'spl': false,
    'empresa': false,
    'docs': false
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NavItem = ({ 
    icon: Icon, 
    label, 
    viewId, 
    badge,
    isActive 
  }: { 
    icon: any, 
    label: string, 
    viewId: string, 
    badge?: number | string,
    isActive?: boolean 
  }) => (
    <div 
      onClick={() => onChangeView(viewId)}
      className={`
        flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group relative
        ${isActive 
          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/20' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}
        ${collapsed ? 'justify-center mx-1 px-2' : ''}
      `}
    >
      <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-teal-400'}`}/>
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1">{label}</span>
          {badge && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-white/20 text-white' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
  );

  const SubMenuItem = ({ label, viewId, isActive }: { label: string, viewId: string, isActive?: boolean }) => (
    <div 
      onClick={() => onChangeView(viewId)}
      className={`
        relative pl-10 pr-3 py-2 text-sm cursor-pointer transition-all duration-200 mx-2 rounded-md
        ${isActive 
          ? 'text-teal-400 bg-teal-500/10 font-medium' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}
      `}
    >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
        isActive ? 'bg-teal-400' : 'bg-slate-600'
      }`}></div>
      {label}
    </div>
  );

  const MenuSection = ({ 
    icon: Icon, 
    label, 
    id, 
    children,
    badge
  }: { 
    icon: any, 
    label: string, 
    id: string, 
    children?: React.ReactNode,
    badge?: number
  }) => {
    const isOpen = expandedMenus[id];
    
    return (
      <div className="mb-1">
        <div 
          onClick={() => !collapsed && toggleMenu(id)}
          className={`
            flex items-center justify-between px-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-200 group
            ${isOpen ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
            ${collapsed ? 'justify-center mx-1 px-2' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className={`shrink-0 transition-colors ${isOpen ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`}/>
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </div>
          {!collapsed && children && (
            <div className="flex items-center gap-2">
              {badge && badge > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400">
                  {badge}
                </span>
              )}
              <ChevronDown size={14} className={`text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
            </div>
          )}
        </div>
        {!collapsed && children && (
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="py-1">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    !collapsed ? (
      <div className="px-4 py-2 mt-4 mb-1">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
      </div>
    ) : (
      <div className="h-px bg-slate-800 mx-3 my-4"></div>
    )
  );

  return (
    <div className={`h-screen bg-[#0f172a] flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} shrink-0 z-40 hidden md:flex`}>
      
      <div className={`h-16 flex items-center border-b border-slate-800/60 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        <Logo size="sm" collapsed={collapsed} variant="light" />
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        
        <SectionLabel label="Principal" />
        
        <MenuSection icon={BarChart3} label="Conformidade" id="compliance">
          <SubMenuItem label="Obrigações Legais (OL)" viewId="home" isActive={currentView === 'home' || currentView.startsWith('ol-')} />
          <SubMenuItem label="Requisitos Legais (RL)" viewId="rl-geral" isActive={currentView.startsWith('rl-')} />
          <SubMenuItem label="Documentos" viewId="doc-geral" isActive={currentView.startsWith('doc-')} />
        </MenuSection>

        <div className="mx-2 my-2">
          <div 
            onClick={() => onChangeView('spl-obligations')}
            className={`
              relative overflow-hidden flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300
              ${currentView.startsWith('spl-') 
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/30' 
                : 'bg-gradient-to-r from-slate-800 to-slate-800/50 text-slate-300 hover:from-slate-700 hover:to-slate-700/50'}
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            {currentView.startsWith('spl-') && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            )}
            <div className={`relative shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              currentView.startsWith('spl-') ? 'bg-white/20' : 'bg-teal-500/20'
            }`}>
              <Target size={16} className={currentView.startsWith('spl-') ? 'text-white' : 'text-teal-400'} />
            </div>
            {!collapsed && (
              <div className="relative flex-1">
                <span className="font-semibold text-sm block">Gestão SPL</span>
                <span className="text-[10px] opacity-70">Sistema de Previsão Legal</span>
              </div>
            )}
          </div>
        </div>

        <NavItem 
          icon={Sparkles} 
          label="Assistente IA" 
          viewId="ai" 
          isActive={currentView === 'ai'}
        />

        <SectionLabel label="Operacional" />

        <MenuSection icon={Building2} label="Empresa" id="empresa">
          <SubMenuItem label="Dados Corporativos" viewId="empresa-dados" isActive={currentView === 'empresa-dados'} />
          <SubMenuItem label="Estrutura & Áreas" viewId="empresa-org" isActive={currentView === 'empresa-org'} />
          <SubMenuItem label="Equipe & Acessos" viewId="empresa-team" isActive={currentView === 'empresa-team'} />
          <SubMenuItem label="Auditoria" viewId="empresa-log" isActive={currentView === 'empresa-log'} />
        </MenuSection>
        
        <NavItem 
          icon={ClipboardList} 
          label="Questionários" 
          viewId="questionario" 
          isActive={currentView === 'questionario'}
        />

        <MenuSection icon={Folder} label="Arquivos" id="docs">
          <SubMenuItem label="Fornecedores" viewId="documents-fornecedores" isActive={currentView === 'documents-fornecedores'} />
          <SubMenuItem label="Empresa" viewId="documents-empresa" isActive={currentView === 'documents-empresa'} />
          <SubMenuItem label="Lixeira" viewId="documents-lixeira" isActive={currentView === 'documents-lixeira'} />
        </MenuSection>
        
        <NavItem 
          icon={Bell} 
          label="Notificações" 
          viewId="avisos" 
          badge={3}
          isActive={currentView === 'avisos'}
        />

      </div>

      <div className="p-3 border-t border-slate-800/60">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCollapsed(true)} 
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-800/50 transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" /> Recolher
            </button>
            <div className="flex gap-1">
              <button 
                onClick={onOpenSettings}
                className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings size={16} />
              </button>
              <button 
                onClick={onOpenHelp}
                className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
                title="Ajuda"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setCollapsed(false)} 
            className="w-full flex justify-center p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
