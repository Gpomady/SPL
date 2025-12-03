
import React, { useState } from 'react';
import { Button } from './Button';
import { LogOut, User, Menu, Bell } from 'lucide-react';
import { ComplianceDashboard } from './ComplianceDashboard';
import { LegalAssistant } from './LegalAssistant';
import { CompanyDashboard } from './CompanyDashboard';
import { QuestionnaireDashboard } from './QuestionnaireDashboard';
import { SPLDashboard } from './SPLDashboard';
import { NotificationsDashboard } from './NotificationsDashboard';
import { DocumentsDashboard } from './DocumentsDashboard';
import { Sidebar } from './Sidebar';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State to hold parameters passed between views (e.g., clicking OL-1 goes to SPL filtered by OL-1)
  const [navigationParams, setNavigationParams] = useState<any>(null);

  const handleNavigation = (view: string, params?: any) => {
      if (params) {
          setNavigationParams(params);
      } else {
          // Clear params if navigating normally, unless we want persistence
          setNavigationParams(null);
      }
      setCurrentView(view);
  };

  const isCompanyView = currentView.startsWith('empresa-');
  const isSPLView = currentView.startsWith('spl-');
  const isDocsView = currentView.startsWith('documents-');

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar currentView={currentView} onChangeView={handleNavigation} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
             <button className="md:hidden text-slate-500 hover:text-[#0f766e]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                 <Menu size={24} />
             </button>
             {/* Breadcrumbs simulation */}
             <div className="hidden md:flex items-center text-sm text-slate-500">
                <span className="hover:text-[#0f766e] cursor-pointer">SPL</span>
                <span className="mx-2">/</span>
                <span className="font-medium text-[#0f766e] capitalize">
                    {currentView === 'home' ? 'Dashboard Geral' : 
                     currentView === 'ai' ? 'Inteligência Jurídica' : 
                     currentView.includes('ol') ? 'Obrigações Legais (OL)' :
                     currentView.includes('rl') ? 'Requisitos Legais (RL)' :
                     currentView.includes('doc-') ? 'Métricas de Documentos' :
                     currentView.includes('documents') ? 'Gestão de Arquivos' :
                     currentView.includes('empresa') ? 'Hub Corporativo' :
                     currentView.includes('spl') ? 'Gestão SPL' :
                     currentView === 'questionario' ? 'Questionários' :
                     currentView === 'avisos' ? 'Central de Avisos' :
                     currentView}
                </span>
             </div>
          </div>

          <div className="flex items-center gap-6">
             {/* Top Tabs Mockup - Hide on Company/SPL/Docs View to avoid clutter */}
             {!isCompanyView && !isSPLView && !isDocsView && currentView !== 'questionario' && currentView !== 'avisos' && (
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                    <button 
                        onClick={() => handleNavigation('home')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${currentView.includes('ol') || currentView === 'home' ? 'bg-white text-[#0f766e] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        OBRIGAÇÕES LEGAIS (OL)
                    </button>
                    <button 
                        onClick={() => handleNavigation('rl-geral')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${currentView.includes('rl') ? 'bg-white text-[#0f766e] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        REQUISITOS LEGAIS (RL)
                    </button>
                    <button 
                        onClick={() => handleNavigation('doc-geral')}
                        className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${currentView.includes('doc') ? 'bg-white text-[#0f766e] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        DOCUMENTOS
                    </button>
                </div>
             )}

             <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>

             <div className="flex items-center gap-3">
                 <div className="relative cursor-pointer text-slate-400 hover:text-[#0f766e] transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                 </div>
                 <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-slate-700">Camila Canuto Mady</p>
                        <p className="text-xs text-slate-400">Grupo Mady</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#0f766e] flex items-center justify-center text-white shadow-sm ring-2 ring-white cursor-pointer hover:ring-[#0f766e]/20 transition-all">
                        <User size={14} />
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" onClick={onLogout} className="ml-2 text-slate-400 hover:text-red-600 hidden md:flex">
                     <LogOut size={16} />
                 </Button>
             </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-slate-50/50">
            {/* We pass the current view to the Dashboard component to handle internal routing */}
            {(currentView === 'home' || currentView.startsWith('ol-') || currentView.startsWith('rl-') || currentView.startsWith('doc-')) && (
              <ComplianceDashboard 
                viewMode={currentView} 
                onNavigate={handleNavigation} 
              />
            )}
            
            {currentView === 'ai' && <LegalAssistant />}

            {currentView === 'questionario' && <QuestionnaireDashboard />}

            {currentView === 'avisos' && <NotificationsDashboard />}

            {isCompanyView && (
                <CompanyDashboard viewMode={currentView} onChangeView={handleNavigation} />
            )}

            {isSPLView && (
                <SPLDashboard 
                    viewMode={currentView} 
                    onChangeView={handleNavigation}
                    initialParams={navigationParams} // Passing params here
                />
            )}

            {isDocsView && (
                <DocumentsDashboard viewMode={currentView} onChangeView={handleNavigation} />
            )}
            
            {/* Placeholder for other views not fully implemented yet */}
            {!currentView.startsWith('ol-') && !currentView.startsWith('rl-') && !currentView.startsWith('doc-') && !isCompanyView && !isSPLView && !isDocsView && currentView !== 'home' && currentView !== 'ai' && currentView !== 'questionario' && currentView !== 'avisos' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Menu size={24} />
                    </div>
                    <h2 className="text-lg font-medium text-slate-600">Módulo em Desenvolvimento</h2>
                    <p className="text-sm">A visualização <strong>{currentView}</strong> estará disponível em breve.</p>
                    <Button variant="outline" className="mt-4" onClick={() => handleNavigation('home')}>Voltar ao Início</Button>
                </div>
            )}
        </main>

      </div>
    </div>
  );
};
