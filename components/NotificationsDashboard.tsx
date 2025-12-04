
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  MoreHorizontal, 
  Archive, 
  Trash2, 
  Eye,
  Check,
  X,
  Settings
} from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

// --- MOCK DATA ---
const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    title: 'Envio da DMR do terceiro trimestre de 2025 até 30/10/2025', 
    message: 'O prazo para entrega da DMR - Declaração de Movimentação de Resíduos referente ao terceiro trimestre/2025 é até 30/10/2025. Caso existam resíduos gerados mas não destinados no período, devem ser declarados manualmente.',
    date: '01/10/2025',
    type: 'warning',
    read: false,
    priority: 'high'
  },
  { 
    id: 2, 
    title: 'Envio da DMR do segundo trimestre de 2025 até 30/07/2025', 
    message: 'O prazo para entrega da DMR - Declaração de Movimentação de Resíduos referente ao segundo trimestre/2025 é até 30/07/2025.',
    date: '02/07/2025',
    type: 'warning',
    read: true,
    priority: 'medium'
  },
  { 
    id: 3, 
    title: 'Novo SPL no ar', 
    message: 'A partir de agora o login de cada usuário será sempre o seu e-mail. Para o primeiro acesso será necessário cadastrar uma nova senha.',
    date: '21/06/2025',
    type: 'info',
    read: true,
    priority: 'low'
  },
  { 
    id: 4, 
    title: 'Aviso - Indisponibilidade Programada do SPL', 
    message: 'Informamos a realização de manutenção programada no dia 18/06/2025 a partir das 18h. O sistema ficará indisponível por aproximadamente 4 horas.',
    date: '11/06/2025',
    type: 'alert',
    read: false,
    priority: 'high'
  },
  { 
    id: 5, 
    title: 'Envio da DMR do primeiro trimestre de 2025 até 30/04/2025', 
    message: 'O prazo para entrega da DMR referente ao primeiro trimestre/2025 encerra em breve.',
    date: '05/04/2025',
    type: 'warning',
    read: true,
    priority: 'medium'
  }
];

export const NotificationsDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState<typeof MOCK_NOTIFICATIONS[0] | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    digestFrequency: 'daily'
  });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 4000);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showToast('Aviso marcado como lido');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Todos os avisos marcados como lidos!');
  };

  const handleArchive = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Aviso arquivado');
  };

  const handleViewDetails = (notif: typeof MOCK_NOTIFICATIONS[0]) => {
    setSelectedNotif(notif);
    setShowDetailsModal(true);
    if (!notif.read) {
      handleMarkAsRead(notif.id);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return true;
  });

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <Clock className="text-amber-500" size={20} />;
      case 'alert': return <AlertTriangle className="text-rose-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  const getBorderColor = (type: string) => {
    switch(type) {
      case 'warning': return 'border-l-amber-400';
      case 'alert': return 'border-l-rose-500';
      case 'info': return 'border-l-blue-400';
      default: return 'border-l-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Central de Avisos</h1>
          <p className="text-sm text-slate-500">Acompanhe comunicados importantes, prazos e alertas do sistema.</p>
        </div>
        <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-slate-600" onClick={() => setShowSettingsModal(true)}>
                <Settings size={16} className="mr-2"/> Configurações
            </Button>
            <Button size="sm" variant="outline" className="text-slate-600" onClick={handleMarkAllRead}>
                <CheckCircle2 size={16} className="mr-2"/> Marcar todas como lidas
            </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="Pesquisar aviso..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
             <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${filter === 'all' ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
                Todos
             </button>
             <button 
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${filter === 'unread' ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
                Não Lidos
             </button>
             <button 
                onClick={() => setFilter('high')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all ${filter === 'high' ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
                Alta Prioridade
             </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? filteredNotifications.map((notif) => (
            <div 
                key={notif.id} 
                className={`bg-white border border-slate-200 border-l-4 ${getBorderColor(notif.type)} rounded-r-lg p-5 shadow-sm hover:shadow-md transition-all group relative`}
            >
                {!notif.read && (
                    <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                )}

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100`}>
                            {getIcon(notif.type)}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">
                                Publicado em: {notif.date}
                            </span>
                            {notif.priority === 'high' && (
                                <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 uppercase">
                                    Alta Prioridade
                                </span>
                            )}
                        </div>
                        
                        <h3 className={`text-sm font-bold text-slate-800 mb-2 ${!notif.read ? 'text-[#0f766e]' : ''}`}>
                            {notif.title}
                            {notif.read && <Check size={14} className="inline ml-2 text-emerald-500"/>}
                        </h3>
                        
                        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
                            {notif.message}
                        </p>
                    </div>

                    <div className="flex md:flex-col gap-2 justify-end md:justify-start md:border-l border-slate-100 md:pl-4">
                         <button 
                           onClick={() => handleViewDetails(notif)}
                           className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded transition-colors" 
                           title="Visualizar Detalhes"
                         >
                            <Eye size={18} />
                         </button>
                         {!notif.read && (
                           <button 
                             onClick={() => handleMarkAsRead(notif.id)}
                             className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 rounded transition-colors" 
                             title="Marcar como lido"
                           >
                              <Check size={18} />
                           </button>
                         )}
                         <button 
                           onClick={() => handleArchive(notif.id)}
                           className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors" 
                           title="Arquivar"
                         >
                            <Archive size={18} />
                         </button>
                    </div>
                </div>
            </div>
        )) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Bell size={48} className="text-slate-300 mb-4" />
                <h3 className="text-slate-600 font-medium">Nenhum aviso encontrado</h3>
                <p className="text-slate-400 text-sm">Tente ajustar os filtros da busca.</p>
            </div>
        )}
      </div>

      <div className="flex justify-center pt-4">
        <span className="text-xs text-slate-400">
            Mostrando {filteredNotifications.length} de {notifications.length} avisos
        </span>
      </div>

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-slide-in
          ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}
        `}>
          {toast.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes do Aviso"
        size="lg"
      >
        {selectedNotif && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedNotif.type === 'warning' ? 'bg-amber-50' :
                selectedNotif.type === 'alert' ? 'bg-rose-50' : 'bg-blue-50'
              }`}>
                {getIcon(selectedNotif.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Publicado em: {selectedNotif.date}</span>
                  {selectedNotif.priority === 'high' && (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 uppercase">
                      Alta Prioridade
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800">{selectedNotif.title}</h3>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 leading-relaxed">{selectedNotif.message}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => { handleArchive(selectedNotif.id); setShowDetailsModal(false); }}
              >
                <Archive size={14} className="mr-2"/> Arquivar
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => setShowDetailsModal(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Configurações de Notificações"
        onConfirm={() => { setShowSettingsModal(false); showToast('Configurações salvas!'); }}
        confirmText="Salvar Configurações"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Notificações por E-mail</h4>
              <p className="text-xs text-slate-500">Receber avisos importantes por e-mail</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Notificações Push</h4>
              <p className="text-xs text-slate-500">Receber alertas em tempo real no navegador</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
          
          <div className="py-3">
            <h4 className="text-sm font-medium text-slate-800 mb-2">Frequência do Resumo</h4>
            <p className="text-xs text-slate-500 mb-3">Com que frequência você quer receber o resumo de avisos</p>
            <select
              value={settings.digestFrequency}
              onChange={(e) => setSettings({ ...settings, digestFrequency: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="realtime">Tempo Real</option>
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="never">Nunca</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
