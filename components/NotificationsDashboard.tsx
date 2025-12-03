
import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { Button } from './Button';

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

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(notif => {
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
            <Button size="sm" variant="outline" className="text-slate-600">
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
                         <button className="p-2 text-slate-400 hover:text-[#0f766e] hover:bg-slate-50 rounded transition-colors" title="Visualizar Detalhes">
                            <Eye size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition-colors" title="Arquivar">
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
            Mostrando {filteredNotifications.length} de {MOCK_NOTIFICATIONS.length} avisos
        </span>
      </div>
    </div>
  );
};
