import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut, ChevronDown, Moon, Sun, Bell, Shield, Key } from 'lucide-react';

interface UserMenuProps {
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onLogout, onOpenSettings, onOpenHelp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: 'Meu Perfil', action: () => { setIsOpen(false); } },
    { icon: Settings, label: 'Configurações', action: () => { setIsOpen(false); onOpenSettings(); } },
    { icon: HelpCircle, label: 'Central de Ajuda', action: () => { setIsOpen(false); onOpenHelp(); } },
    { divider: true },
    { icon: LogOut, label: 'Sair', action: () => { setIsOpen(false); onLogout(); }, danger: true },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-50 rounded-lg px-2 py-1.5 transition-colors group"
      >
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-slate-700">Camila Canuto Mady</p>
          <p className="text-xs text-slate-400">Grupo Mady</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
          <User size={16} />
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 hidden md:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="font-semibold text-slate-800">Camila Canuto Mady</p>
            <p className="text-xs text-slate-500">camila@grupomady.com.br</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item, index) => 
              item.divider ? (
                <div key={index} className="h-px bg-slate-100 my-1"></div>
              ) : (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    item.danger 
                      ? 'text-red-600 hover:bg-red-50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon && <item.icon size={16} className={item.danger ? 'text-red-500' : 'text-slate-400'} />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('geral');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    vencimentos: true,
    atualizacoes: false
  });
  const [theme, setTheme] = useState('light');

  if (!isOpen) return null;

  const tabs = [
    { id: 'geral', label: 'Geral', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Configurações</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Sidebar tabs */}
          <div className="w-48 border-r border-slate-100 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeTab === tab.id 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'geral' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Aparência</h3>
                  <div className="flex gap-3">
                    {[
                      { id: 'light', icon: Sun, label: 'Claro' },
                      { id: 'dark', icon: Moon, label: 'Escuro' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all ${
                          theme === t.id 
                            ? 'border-teal-500 bg-teal-50 text-teal-700' 
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <t.icon size={18} />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Idioma</h3>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Fuso Horário</h3>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option value="America/Manaus">Manaus (GMT-4)</option>
                    <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 mb-4">Preferências de Notificação</h3>
                {[
                  { key: 'email', label: 'Notificações por E-mail', desc: 'Receba atualizações importantes no seu e-mail' },
                  { key: 'push', label: 'Notificações Push', desc: 'Alertas em tempo real no navegador' },
                  { key: 'vencimentos', label: 'Alertas de Vencimento', desc: 'Avise-me sobre documentos próximos do vencimento' },
                  { key: 'atualizacoes', label: 'Atualizações Legais', desc: 'Novas legislações e alterações normativas' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-teal-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Alterar Senha</h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Senha atual"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <input
                      type="password"
                      placeholder="Nova senha"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nova senha"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                    <button className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
                      Atualizar Senha
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-4">Autenticação em Duas Etapas</h3>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Key size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">2FA Desativado</p>
                        <p className="text-xs text-slate-500">Adicione uma camada extra de segurança</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                      Ativar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (!isOpen) return null;

  const faqs = [
    {
      question: 'Como cadastrar uma nova empresa?',
      answer: 'Acesse o menu "Empresa" > "Dados Corporativos" e clique em "Adicionar Empresa". Informe o CNPJ e o sistema buscará automaticamente os dados na Receita Federal.'
    },
    {
      question: 'Como funcionam as Obrigações Legais (OL)?',
      answer: 'As Obrigações Legais são requisitos específicos que sua empresa deve cumprir. Elas são geradas automaticamente baseadas no CNAE da empresa e podem ser avaliadas como Conforme, Não Conforme ou Não Aplicável.'
    },
    {
      question: 'O que são Requisitos Legais (RL)?',
      answer: 'Requisitos Legais são as bases normativas (leis, decretos, portarias) que fundamentam as Obrigações Legais. Cada RL pode estar vinculado a várias OLs.'
    },
    {
      question: 'Como recebo alertas de vencimento?',
      answer: 'O sistema monitora automaticamente os prazos de licenças e documentos. Configure suas preferências de notificação em "Configurações" > "Notificações" para receber alertas por e-mail ou push.'
    },
    {
      question: 'Como exportar relatórios?',
      answer: 'Em qualquer dashboard, clique no botão "Exportar" para baixar os dados em formato Excel ou PDF. Você pode aplicar filtros antes de exportar para personalizar o relatório.'
    },
    {
      question: 'Posso usar o assistente de IA para consultas?',
      answer: 'Sim! O Assistente IA pode responder dúvidas sobre legislação ambiental, ajudar a interpretar requisitos e sugerir ações corretivas. Acesse pelo menu lateral "Assistente IA".'
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-500 to-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <HelpCircle size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Central de Ajuda</h2>
              <p className="text-sm text-white/80">Perguntas frequentes e suporte</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-800">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact support */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <h4 className="font-medium text-slate-800 mb-2">Precisa de mais ajuda?</h4>
            <p className="text-sm text-slate-600 mb-3">
              Nossa equipe de suporte está disponível para ajudá-lo.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                Enviar Mensagem
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                suporte@splamazonia.com.br
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
