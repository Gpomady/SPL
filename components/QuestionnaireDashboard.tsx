import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  Calendar, 
  User, 
  MessageSquare, 
  History, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  FileText
} from 'lucide-react';
import { Button } from './Button';

interface QuestionnaireDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
}

// --- MOCK DATA ---

const MOCK_QUESTIONNAIRES = [
  { id: 1, status: 'Em Análise', name: 'Navegação', respondent: 'Jamilson Carmo', date: '21/08/2025', completed: 45, total: 50 },
  { id: 2, status: 'Em Análise', name: 'Meio Ambiente - MA', respondent: 'Helisson Brandão', date: '20/10/2025', completed: 12, total: 40 },
  { id: 3, status: 'Concluído', name: 'Segurança do Trabalho', respondent: 'Fabio Gabriel', date: '15/10/2025', completed: 35, total: 35 },
  { id: 4, status: 'Pendente', name: 'Compliance Geral', respondent: 'Maria Mady', date: '-', completed: 0, total: 20 },
];

const MOCK_QUESTIONS = [
  { id: 101, text: 'A organização realiza Operações Ship-to-Ship?', answer: null },
  { id: 102, text: 'A organização realiza Operações Ship-to-Barge?', answer: 'sim' },
  { id: 103, text: 'Existe procedimento formal para bunkering?', answer: 'nao' },
  { id: 104, text: 'Os certificados da embarcação estão vigentes?', answer: 'verificar' },
  { id: 105, text: 'Há registro de simulados de emergência nos últimos 6 meses?', answer: null },
];

export const QuestionnaireDashboard: React.FC<QuestionnaireDashboardProps> = () => {
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenDetail = (id: number) => {
    setSelectedId(id);
    setActiveView('detail');
  };

  const handleBack = () => {
    setActiveView('list');
    setSelectedId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {activeView === 'list' ? (
        <QuestionnaireList onOpen={handleOpenDetail} />
      ) : (
        <QuestionnaireDetail onBack={handleBack} />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const QuestionnaireList = ({ onOpen }: { onOpen: (id: number) => void }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Questionários</h1>
          <p className="text-sm text-slate-500">Acompanhe o levantamento de informações sobre atividades da empresa</p>
        </div>
        <Button size="sm">Novo Questionário</Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
                type="text" 
                placeholder="Pesquisar questionário..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
            />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <div className="relative w-full md:w-48">
                 <select className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e] bg-white appearance-none text-slate-600">
                    <option>Filtrar por status</option>
                    <option>Em Análise</option>
                    <option>Concluído</option>
                    <option>Pendente</option>
                 </select>
                 <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
             </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider text-xs">
                    <tr>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Nome do Questionário</th>
                        <th className="px-6 py-4">Respondido por</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4 text-center">Progresso</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_QUESTIONNAIRES.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-4">
                                <span className={`
                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                    ${q.status === 'Em Análise' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                      q.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                      'bg-slate-100 text-slate-600 border-slate-200'}
                                `}>
                                    {q.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">{q.name}</td>
                            <td className="px-6 py-4 text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        {q.respondent.charAt(0)}
                                    </div>
                                    {q.respondent}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{q.date}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24 mx-auto">
                                        <div 
                                            className={`h-full rounded-full ${q.completed === q.total ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${(q.completed/q.total)*100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => onOpen(q.id)}
                                    className="inline-flex items-center justify-center px-3 py-1.5 border border-emerald-200 text-[#0f766e] bg-emerald-50 hover:bg-emerald-100 rounded text-xs font-semibold transition-colors gap-1"
                                >
                                    VER DETALHES
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
             <span>Registros por página: 10</span>
             <div className="flex gap-2">
                 <span>1-4 de 4</span>
                 <div className="flex gap-1">
                     <button className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-50" disabled>&lt;</button>
                     <button className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-50" disabled>&gt;</button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

const QuestionnaireDetail = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="space-y-6">
            {/* Nav Header */}
            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>Questionário</span>
                        <ChevronRight size={12}/>
                        <span>Navegação</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Levantamento de Atividades</h2>
                </div>
                <div className="ml-auto flex gap-3">
                    <Button variant="outline" size="sm">Cancelar</Button>
                    <Button size="sm"><Save size={16} className="mr-2"/> Salvar Respostas</Button>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {MOCK_QUESTIONS.map((q) => (
                    <QuestionRow key={q.id} data={q} />
                ))}
            </div>
            
            <div className="flex justify-center pt-8">
                 <button className="text-sm text-slate-400 hover:text-slate-600 font-medium uppercase tracking-wide">Carregar mais perguntas</button>
            </div>
        </div>
    );
};

const QuestionRow: React.FC<{ data: any }> = ({ data }) => {
    const [answer, setAnswer] = useState<string | null>(data.answer);

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                
                {/* Question Text */}
                <div className="flex-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Pergunta {data.id}</span>
                    <p className="text-slate-800 font-medium text-lg leading-relaxed">{data.text}</p>
                </div>

                {/* Interaction Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                    
                    {/* Toggles */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setAnswer('sim')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                                answer === 'sim' 
                                ? 'bg-emerald-500 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {answer === 'sim' && <CheckCircle2 size={14} />} Sim
                        </button>
                        
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>

                        <button 
                            onClick={() => setAnswer('nao')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                                answer === 'nao' 
                                ? 'bg-rose-500 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {answer === 'nao' && <AlertCircle size={14} />} Não
                        </button>
                        
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>

                        <button 
                            onClick={() => setAnswer('verificar')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                                answer === 'verificar' 
                                ? 'bg-slate-600 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {answer === 'verificar' && <HelpCircle size={14} />} Verificar
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-6">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative group">
                            <MessageSquare size={20} />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Comentários</span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors relative group">
                            <History size={20} />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Histórico</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};