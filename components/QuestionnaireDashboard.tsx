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
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Clock,
  Users,
  Send,
  Archive,
  Download
} from 'lucide-react';
import { Button } from './Button';
import { FormBuilder } from './FormBuilder';
import { Modal } from './Modal';

interface QuestionnaireDashboardProps {
  viewMode?: string;
  onChangeView?: (view: string) => void;
}

interface Questionnaire {
  id: number;
  status: 'em_analise' | 'concluido' | 'pendente' | 'rascunho';
  name: string;
  description?: string;
  category: string;
  respondent?: string;
  assignedTo?: string;
  date: string;
  dueDate?: string;
  completed: number;
  total: number;
  createdBy: string;
}

const MOCK_QUESTIONNAIRES: Questionnaire[] = [
  { 
    id: 1, 
    status: 'em_analise', 
    name: 'Levantamento de Navegação', 
    description: 'Identificação das atividades de navegação fluvial',
    category: 'Navegação',
    respondent: 'Jamilson Carmo', 
    assignedTo: 'Jamilson Carmo',
    date: '21/08/2025', 
    dueDate: '30/08/2025',
    completed: 45, 
    total: 50,
    createdBy: 'Cláudia Brandizzi'
  },
  { 
    id: 2, 
    status: 'em_analise', 
    name: 'Meio Ambiente - Atividades Operacionais', 
    description: 'Mapeamento de atividades com impacto ambiental',
    category: 'Meio Ambiente',
    respondent: 'Helisson Brandão', 
    assignedTo: 'Helisson Brandão',
    date: '20/10/2025', 
    dueDate: '10/11/2025',
    completed: 12, 
    total: 40,
    createdBy: 'Walisson'
  },
  { 
    id: 3, 
    status: 'concluido', 
    name: 'Segurança do Trabalho - NRs', 
    description: 'Conformidade com Normas Regulamentadoras',
    category: 'Segurança do Trabalho',
    respondent: 'Fabio Gabriel', 
    date: '15/10/2025', 
    completed: 35, 
    total: 35,
    createdBy: 'Cláudia Brandizzi'
  },
  { 
    id: 4, 
    status: 'pendente', 
    name: 'Compliance Geral 2025', 
    description: 'Avaliação anual de conformidade',
    category: 'Compliance Geral',
    assignedTo: 'Maria Mady',
    date: '-', 
    dueDate: '31/12/2025',
    completed: 0, 
    total: 20,
    createdBy: 'Admin'
  },
  { 
    id: 5, 
    status: 'rascunho', 
    name: 'Recursos Hídricos', 
    description: 'Levantamento de uso de recursos hídricos',
    category: 'Meio Ambiente',
    date: '01/12/2024', 
    completed: 0, 
    total: 15,
    createdBy: 'Walisson'
  },
];

const MOCK_QUESTIONS = [
  { id: 101, text: 'A organização realiza Operações Ship-to-Ship?', answer: null, section: 'Operações Marítimas' },
  { id: 102, text: 'A organização realiza Operações Ship-to-Barge?', answer: 'sim', section: 'Operações Marítimas' },
  { id: 103, text: 'Existe procedimento formal para bunkering?', answer: 'nao', section: 'Procedimentos' },
  { id: 104, text: 'Os certificados da embarcação estão vigentes?', answer: 'verificar', section: 'Documentação' },
  { id: 105, text: 'Há registro de simulados de emergência nos últimos 6 meses?', answer: null, section: 'Segurança' },
  { id: 106, text: 'A tripulação possui treinamento atualizado em combate a incêndio?', answer: 'sim', section: 'Segurança' },
  { id: 107, text: 'Existe plano de contingência para derramamento de óleo?', answer: null, section: 'Meio Ambiente' },
];

export const QuestionnaireDashboard: React.FC<QuestionnaireDashboardProps> = () => {
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'create' | 'assign'>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);

  const handleOpenDetail = (id: number) => {
    setSelectedId(id);
    setActiveView('detail');
  };

  const handleBack = () => {
    setActiveView('list');
    setSelectedId(null);
  };

  const handleCreateNew = () => {
    setActiveView('create');
  };

  const handleAssign = (q: Questionnaire) => {
    setSelectedQuestionnaire(q);
    setShowAssignModal(true);
  };

  const handleSaveForm = (template: any) => {
    console.log('Form saved:', template);
    setActiveView('list');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {activeView === 'list' && (
        <QuestionnaireList 
          onOpen={handleOpenDetail} 
          onCreate={handleCreateNew}
          onAssign={handleAssign}
        />
      )}
      {activeView === 'detail' && (
        <QuestionnaireDetail onBack={handleBack} questionnaireId={selectedId} />
      )}
      {activeView === 'create' && (
        <FormBuilder onBack={handleBack} onSave={handleSaveForm} />
      )}

      {showAssignModal && selectedQuestionnaire && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Atribuir Questionário"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Atribuir <strong>{selectedQuestionnaire.name}</strong> para:
            </p>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Responsável</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                <option>Selecione um responsável...</option>
                <option>Cláudia Brandizzi</option>
                <option>Walisson</option>
                <option>Helisson Brandão</option>
                <option>Jamilson Carmo</option>
                <option>Fabio Gabriel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Prazo</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensagem (opcional)</label>
              <textarea 
                placeholder="Adicione uma mensagem para o responsável..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowAssignModal(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={() => setShowAssignModal(false)}>
                <Send size={14} className="mr-2" /> Enviar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const QuestionnaireList = ({ 
  onOpen, 
  onCreate,
  onAssign 
}: { 
  onOpen: (id: number) => void;
  onCreate: () => void;
  onAssign: (q: Questionnaire) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'em_analise': return { label: 'Em Análise', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'concluido': return { label: 'Concluído', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'pendente': return { label: 'Pendente', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'rascunho': return { label: 'Rascunho', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
      default: return { label: status, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
    }
  };

  const filteredQuestionnaires = MOCK_QUESTIONNAIRES.filter(q => {
    if (filterStatus !== 'ALL' && q.status !== filterStatus) return false;
    if (filterCategory !== 'ALL' && q.category !== filterCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return q.name.toLowerCase().includes(term) || 
             (q.description?.toLowerCase().includes(term)) ||
             (q.respondent?.toLowerCase().includes(term));
    }
    return true;
  });

  const stats = {
    total: MOCK_QUESTIONNAIRES.length,
    emAnalise: MOCK_QUESTIONNAIRES.filter(q => q.status === 'em_analise').length,
    concluidos: MOCK_QUESTIONNAIRES.filter(q => q.status === 'concluido').length,
    pendentes: MOCK_QUESTIONNAIRES.filter(q => q.status === 'pendente').length,
    rascunhos: MOCK_QUESTIONNAIRES.filter(q => q.status === 'rascunho').length,
  };

  const categories = [...new Set(MOCK_QUESTIONNAIRES.map(q => q.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Questionários</h1>
          <p className="text-sm text-slate-500">Gerencie formulários para levantamento de atividades e identificação de obrigações</p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus size={16} className="mr-2" /> Novo Questionário
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div 
          onClick={() => setFilterStatus('ALL')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${filterStatus === 'ALL' ? 'ring-2 ring-teal-500 border-teal-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <ClipboardList size={20} className="text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <div className="text-xs text-slate-500">Total</div>
            </div>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('em_analise')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${filterStatus === 'em_analise' ? 'ring-2 ring-amber-500 border-amber-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{stats.emAnalise}</div>
              <div className="text-xs text-slate-500">Em Análise</div>
            </div>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('concluido')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${filterStatus === 'concluido' ? 'ring-2 ring-emerald-500 border-emerald-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{stats.concluidos}</div>
              <div className="text-xs text-slate-500">Concluídos</div>
            </div>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('pendente')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${filterStatus === 'pendente' ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Send size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.pendentes}</div>
              <div className="text-xs text-slate-500">Pendentes</div>
            </div>
          </div>
        </div>
        <div 
          onClick={() => setFilterStatus('rascunho')}
          className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${filterStatus === 'rascunho' ? 'ring-2 ring-slate-400 border-slate-300' : 'border-slate-200'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileText size={20} className="text-slate-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-600">{stats.rascunhos}</div>
              <div className="text-xs text-slate-500">Rascunhos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar questionário..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          >
            <option value="ALL">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {(filterStatus !== 'ALL' || filterCategory !== 'ALL' || searchTerm) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilterStatus('ALL');
                setFilterCategory('ALL');
                setSearchTerm('');
              }}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Questionário</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Prazo</th>
                <th className="px-6 py-4 text-center">Progresso</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuestionnaires.map((q) => {
                const statusConfig = getStatusConfig(q.status);
                const progress = q.total > 0 ? Math.round((q.completed / q.total) * 100) : 0;
                
                return (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-slate-800 block">{q.name}</span>
                        {q.description && (
                          <span className="text-xs text-slate-500 line-clamp-1">{q.description}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {q.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {q.respondent || q.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">
                            {(q.respondent || q.assignedTo)?.charAt(0)}
                          </div>
                          <span className="text-sm">{q.respondent || q.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Não atribuído</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {q.dueDate || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-teal-500' : 'bg-blue-500'
                            }`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500">{q.completed}/{q.total} ({progress}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 relative">
                        {q.status === 'rascunho' ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onOpen(q.id)}>
                              <Edit size={14} className="mr-1" /> Editar
                            </Button>
                            <Button size="sm" onClick={() => onAssign(q)}>
                              <Send size={14} className="mr-1" /> Enviar
                            </Button>
                          </>
                        ) : q.status === 'pendente' ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onOpen(q.id)}>
                              <Eye size={14} className="mr-1" /> Ver
                            </Button>
                            <Button size="sm" onClick={() => onAssign(q)}>
                              <Send size={14} className="mr-1" /> Reenviar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => onOpen(q.id)}>
                              <Eye size={14} className="mr-1" /> {q.status === 'em_analise' ? 'Responder' : 'Ver'}
                            </Button>
                            {q.status === 'concluido' && (
                              <Button variant="outline" size="sm">
                                <Download size={14} className="mr-1" /> Exportar
                              </Button>
                            )}
                          </>
                        )}

                        <button 
                          onClick={() => setShowActionsMenu(showActionsMenu === q.id ? null : q.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {showActionsMenu === q.id && (
                          <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[150px]">
                            <button 
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => { setShowActionsMenu(null); }}
                            >
                              <Copy size={14} /> Duplicar
                            </button>
                            <button 
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => { setShowActionsMenu(null); }}
                            >
                              <Archive size={14} /> Arquivar
                            </button>
                            <button 
                              className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              onClick={() => { setShowActionsMenu(null); }}
                            >
                              <Trash2 size={14} /> Excluir
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuestionnaires.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList size={48} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum questionário encontrado</h3>
            <p className="text-sm text-slate-500 mb-4">Tente ajustar os filtros ou crie um novo questionário</p>
            <Button onClick={onCreate}>
              <Plus size={16} className="mr-2" /> Criar Questionário
            </Button>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500">
          <span>Mostrando {filteredQuestionnaires.length} de {MOCK_QUESTIONNAIRES.length} questionários</span>
          <div className="flex gap-2">
            <span>1-{filteredQuestionnaires.length} de {filteredQuestionnaires.length}</span>
            <div className="flex gap-1">
              <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-50" disabled>&lt;</button>
              <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 rounded disabled:opacity-50" disabled>&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionnaireDetail = ({ onBack, questionnaireId }: { onBack: () => void; questionnaireId: number | null }) => {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const questionnaire = MOCK_QUESTIONNAIRES.find(q => q.id === questionnaireId);
  const sections = [...new Set(MOCK_QUESTIONS.map(q => q.section))];

  const updateAnswer = (questionId: number, value: string | null) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getAnsweredCount = () => {
    return MOCK_QUESTIONS.filter(q => answers[q.id] || q.answer).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Questionários</span>
              <ChevronRight size={12}/>
              <span>{questionnaire?.category}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{questionnaire?.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <div className="text-sm font-medium text-slate-700">{getAnsweredCount()}/{MOCK_QUESTIONS.length}</div>
            <div className="text-xs text-slate-500">Respondidas</div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>Cancelar</Button>
          <Button size="sm"><Save size={16} className="mr-2"/> Salvar Respostas</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-4">
            <h3 className="font-semibold text-slate-800 mb-3">Seções</h3>
            <div className="space-y-1">
              {sections.map((section, index) => {
                const sectionQuestions = MOCK_QUESTIONS.filter(q => q.section === section);
                const answered = sectionQuestions.filter(q => answers[q.id] || q.answer).length;
                
                return (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section || null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === section 
                        ? 'bg-teal-50 text-teal-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{section}</span>
                      <span className={`text-xs ${answered === sectionQuestions.length ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {answered}/{sectionQuestions.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {MOCK_QUESTIONS.filter(q => !activeSection || q.section === activeSection).map((q, index) => (
            <QuestionRow 
              key={q.id} 
              data={q} 
              index={index + 1}
              answer={answers[q.id] ?? q.answer}
              onAnswer={(value) => updateAnswer(q.id, value)}
            />
          ))}
          
          <div className="flex justify-center pt-8">
            <Button variant="outline" onClick={onBack}>
              Voltar para Lista
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionRow: React.FC<{ 
  data: any; 
  index: number;
  answer: string | null;
  onAnswer: (value: string | null) => void;
}> = ({ data, index, answer, onAnswer }) => {
  return (
    <div className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
      answer ? 'border-teal-200 bg-teal-50/30' : 'border-slate-200 hover:shadow-md'
    }`}>
      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded">{data.section}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm font-bold text-slate-400 mt-0.5">{index}.</span>
            <p className="text-slate-800 font-medium leading-relaxed">{data.text}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => onAnswer('sim')}
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
              onClick={() => onAnswer('nao')}
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
              onClick={() => onAnswer('verificar')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                answer === 'verificar' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
              }`}
            >
              {answer === 'verificar' && <HelpCircle size={14} />} N/A
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Comentários">
              <MessageSquare size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors" title="Histórico">
              <History size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
