import React, { useState } from 'react';
import { Button } from './Button';
import { LogOut, Menu, Bell, X, Settings, HelpCircle } from 'lucide-react';
import { ComplianceDashboard } from './ComplianceDashboard';
import { LegalAssistant } from './LegalAssistant';
import { CompanyDashboard } from './CompanyDashboard';
import { QuestionnaireDashboard } from './QuestionnaireDashboard';
import { SPLDashboard } from './SPLDashboard';
import { NotificationsDashboard } from './NotificationsDashboard';
import { DocumentsDashboard } from './DocumentsDashboard';
import { Sidebar } from './Sidebar';
import { UserMenu, SettingsModal, HelpModal } from './UserMenu';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const [navigationParams, setNavigationParams] = useState<any>(null);

  const handleNavigation = (view: string, params?: any) => {
    if (params) {
      setNavigationParams(params);
    } else {
      setNavigationParams(null);
    }
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const isCompanyView = currentView.startsWith('empresa-');
  const isSPLView = currentView.startsWith('spl-');
  const isDocsView = currentView.startsWith('documents-');

  const getBreadcrumb = () => {
    const breadcrumbs: Record<string, string> = {
      'home': 'Dashboard Geral',
      'ai': 'Inteligência Jurídica',
      'questionario': 'Questionários',
      'avisos': 'Central de Avisos',
    };
    
    if (currentView.includes('ol')) return 'Obrigações Legais (OL)';
    if (currentView.includes('rl')) return 'Requisitos Legais (RL)';
    if (currentView.includes('doc-')) return 'Métricas de Documentos';
    if (currentView.includes('documents')) return 'Gestão de Arquivos';
    if (currentView.includes('empresa')) return 'Hub Corporativo';
    if (currentView.includes('spl')) return 'Gestão SPL';
    
    return breadcrumbs[currentView] || currentView;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar Component - Desktop */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={handleNavigation}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0f172a] shadow-2xl animate-slide-in">
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
              <span className="text-white font-bold">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="py-4">
              <MobileMenuItem 
                label="Dashboard Geral" 
                active={currentView === 'home'}
                onClick={() => handleNavigation('home')} 
              />
              <MobileMenuItem 
                label="Obrigações Legais (OL)" 
                active={currentView === 'home' || currentView.includes('ol')}
                onClick={() => handleNavigation('home')} 
              />
              <MobileMenuItem 
                label="Requisitos Legais (RL)" 
                active={currentView.includes('rl')}
                onClick={() => handleNavigation('rl-geral')} 
              />
              <MobileMenuItem 
                label="Documentos" 
                active={currentView.includes('doc')}
                onClick={() => handleNavigation('doc-geral')} 
              />
              <MobileMenuItem 
                label="Gestão SPL" 
                active={currentView.includes('spl')}
                onClick={() => handleNavigation('spl-actions')} 
              />
              <MobileMenuItem 
                label="Assistente IA" 
                active={currentView === 'ai'}
                onClick={() => handleNavigation('ai')} 
              />
              <MobileMenuItem 
                label="Hub Corporativo" 
                active={currentView.includes('empresa')}
                onClick={() => handleNavigation('empresa-dados')} 
              />
              <MobileMenuItem 
                label="Questionários" 
                active={currentView === 'questionario'}
                onClick={() => handleNavigation('questionario')} 
              />
              <MobileMenuItem 
                label="Arquivos" 
                active={currentView.includes('documents')}
                onClick={() => handleNavigation('documents-empresa')} 
              />
              <MobileMenuItem 
                label="Notificações" 
                active={currentView === 'avisos'}
                onClick={() => handleNavigation('avisos')} 
                badge={3}
              />
              <div className="h-px bg-slate-800 my-4 mx-4"></div>
              <MobileMenuItem 
                label="Configurações" 
                onClick={() => { setMobileMenuOpen(false); setShowSettings(true); }} 
              />
              <MobileMenuItem 
                label="Ajuda" 
                onClick={() => { setMobileMenuOpen(false); setShowHelp(true); }} 
              />
              <MobileMenuItem 
                label="Sair" 
                onClick={() => { setMobileMenuOpen(false); onLogout(); }} 
                danger
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-500 hover:text-teal-600 p-1" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm text-slate-500">
              <span className="hover:text-teal-600 cursor-pointer transition-colors">SPL</span>
              <span className="mx-2 text-slate-300">/</span>
              <span className="font-medium text-teal-700">
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Top Tabs - Hide on certain views */}
            {!isCompanyView && !isSPLView && !isDocsView && currentView !== 'questionario' && currentView !== 'avisos' && currentView !== 'ai' && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <TabButton
                  label="OBRIGAÇÕES LEGAIS (OL)"
                  active={currentView.includes('ol') || currentView === 'home'}
                  onClick={() => handleNavigation('home')}
                />
                <TabButton
                  label="REQUISITOS LEGAIS (RL)"
                  active={currentView.includes('rl')}
                  onClick={() => handleNavigation('rl-geral')}
                />
                <TabButton
                  label="DOCUMENTOS"
                  active={currentView.includes('doc')}
                  onClick={() => handleNavigation('doc-geral')}
                />
              </div>
            )}

            <div className="h-6 w-px bg-slate-200 hidden lg:block"></div>

            <div className="flex items-center gap-2">
              {/* Notification Bell - Now clickable */}
              <button 
                onClick={() => handleNavigation('avisos')}
                className="relative p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Settings button - visible on small screens */}
              <button 
                onClick={() => setShowSettings(true)}
                className="md:hidden p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Settings size={20} />
              </button>

              <div className="hidden md:block h-6 w-px bg-slate-200 ml-2"></div>

              {/* User Menu */}
              <div className="hidden md:block">
                <UserMenu 
                  onLogout={onLogout}
                  onOpenSettings={() => setShowSettings(true)}
                  onOpenHelp={() => setShowHelp(true)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-slate-50/50">
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
              initialParams={navigationParams}
            />
          )}

          {isDocsView && (
            <DocumentsDashboard viewMode={currentView} onChangeView={handleNavigation} />
          )}
          
          {/* Fallback for undefined views */}
          {!currentView.startsWith('ol-') && 
           !currentView.startsWith('rl-') && 
           !currentView.startsWith('doc-') && 
           !isCompanyView && 
           !isSPLView && 
           !isDocsView && 
           currentView !== 'home' && 
           currentView !== 'ai' && 
           currentView !== 'questionario' && 
           currentView !== 'avisos' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-fade-in">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Menu size={32} className="text-slate-300" />
              </div>
              <h2 className="text-lg font-semibold text-slate-600 mb-2">Módulo em Desenvolvimento</h2>
              <p className="text-sm text-slate-400 mb-6">A visualização <span className="font-medium text-slate-600">{currentView}</span> estará disponível em breve.</p>
              <Button variant="outline" onClick={() => handleNavigation('home')}>
                Voltar ao Início
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

// Helper Components
const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
      active 
        ? 'bg-white text-teal-700 shadow-sm' 
        : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {label}
  </button>
);

const MobileMenuItem: React.FC<{ 
  label: string; 
  active?: boolean; 
  badge?: number;
  danger?: boolean;
  onClick: () => void 
}> = ({ label, active, badge, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
      danger 
        ? 'text-red-400 hover:bg-red-900/20' 
        : active 
          ? 'text-teal-400 bg-teal-900/20 border-l-2 border-teal-400' 
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
    }`}
  >
    <span>{label}</span>
    {badge && (
      <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
        {badge}
      </span>
    )}
  </button>
);
