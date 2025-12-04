import React, { useState } from 'react';
import { 
  Plus,
  Trash2,
  GripVertical,
  Type,
  ToggleLeft,
  List,
  CheckSquare,
  Calendar,
  Upload,
  Hash,
  AlignLeft,
  Save,
  X,
  ArrowLeft,
  Eye,
  Copy,
  Settings,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  Layers
} from 'lucide-react';
import { Button } from './Button';

type QuestionType = 'text' | 'textarea' | 'boolean' | 'select' | 'multiselect' | 'date' | 'file' | 'number';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  section?: string;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  questions: Question[];
  createdAt: string;
  status: 'rascunho' | 'publicado' | 'arquivado';
}

interface FormBuilderProps {
  onBack: () => void;
  editingTemplate?: FormTemplate;
  onSave?: (template: FormTemplate) => void;
}

const QUESTION_TYPES: { type: QuestionType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'boolean', label: 'Sim/Não', icon: ToggleLeft, description: 'Pergunta de resposta binária' },
  { type: 'text', label: 'Texto Curto', icon: Type, description: 'Resposta em uma linha' },
  { type: 'textarea', label: 'Texto Longo', icon: AlignLeft, description: 'Resposta em múltiplas linhas' },
  { type: 'select', label: 'Seleção Única', icon: List, description: 'Escolha uma opção' },
  { type: 'multiselect', label: 'Múltipla Escolha', icon: CheckSquare, description: 'Escolha várias opções' },
  { type: 'number', label: 'Número', icon: Hash, description: 'Valor numérico' },
  { type: 'date', label: 'Data', icon: Calendar, description: 'Seleção de data' },
  { type: 'file', label: 'Upload Arquivo', icon: Upload, description: 'Anexar documento' },
];

const CATEGORIES = [
  'Meio Ambiente',
  'Segurança do Trabalho',
  'Saúde Ocupacional',
  'Navegação',
  'Compliance Geral',
  'Recursos Humanos',
  'Qualidade',
  'Financeiro'
];

export const FormBuilder: React.FC<FormBuilderProps> = ({ onBack, editingTemplate, onSave }) => {
  const [formName, setFormName] = useState(editingTemplate?.name || '');
  const [formDescription, setFormDescription] = useState(editingTemplate?.description || '');
  const [formCategory, setFormCategory] = useState(editingTemplate?.category || CATEGORIES[0]);
  const [questions, setQuestions] = useState<Question[]>(editingTemplate?.questions || []);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);

  const generateId = () => `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      type,
      text: '',
      required: false,
      options: type === 'select' || type === 'multiselect' ? ['Opção 1', 'Opção 2'] : undefined
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
    setShowTypeSelector(false);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (editingQuestion === id) setEditingQuestion(null);
  };

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question) {
      const newQuestion = { ...question, id: generateId(), text: `${question.text} (Cópia)` };
      const index = questions.findIndex(q => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      setQuestions(newQuestions);
    }
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) return;
    
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, { 
        options: [...question.options, `Opção ${question.options.length + 1}`] 
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 2) {
      updateQuestion(questionId, { 
        options: question.options.filter((_, i) => i !== optionIndex) 
      });
    }
  };

  const handleSave = (status: 'rascunho' | 'publicado') => {
    const template: FormTemplate = {
      id: editingTemplate?.id || generateId(),
      name: formName,
      description: formDescription,
      category: formCategory,
      questions,
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      status
    };
    onSave?.(template);
  };

  const getTypeConfig = (type: QuestionType) => {
    return QUESTION_TYPES.find(t => t.type === type) || QUESTION_TYPES[0];
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="text-xs text-slate-500 mb-1">Pré-visualização</div>
              <h2 className="text-xl font-bold text-slate-800">{formName || 'Sem título'}</h2>
            </div>
          </div>
          <Button onClick={() => setShowPreview(false)}>Voltar ao Editor</Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto">
          {formDescription && (
            <p className="text-slate-600 mb-6 pb-6 border-b border-slate-100">{formDescription}</p>
          )}

          <div className="space-y-6">
            {questions.map((q, index) => {
              const typeConfig = getTypeConfig(q.type);
              
              return (
                <div key={q.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs font-bold text-slate-400">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">
                        {q.text || 'Pergunta sem título'}
                        {q.required && <span className="text-rose-500 ml-1">*</span>}
                      </p>
                      {q.description && (
                        <p className="text-sm text-slate-500 mt-1">{q.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="ml-6">
                    {q.type === 'boolean' && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={q.id} className="w-4 h-4 text-teal-600" />
                          <span className="text-sm text-slate-600">Sim</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={q.id} className="w-4 h-4 text-teal-600" />
                          <span className="text-sm text-slate-600">Não</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={q.id} className="w-4 h-4 text-teal-600" />
                          <span className="text-sm text-slate-600">N/A</span>
                        </label>
                      </div>
                    )}

                    {q.type === 'text' && (
                      <input 
                        type="text" 
                        placeholder="Sua resposta" 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        disabled
                      />
                    )}

                    {q.type === 'textarea' && (
                      <textarea 
                        placeholder="Sua resposta" 
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm min-h-[100px]"
                        disabled
                      />
                    )}

                    {q.type === 'number' && (
                      <input 
                        type="number" 
                        placeholder="0" 
                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        disabled
                      />
                    )}

                    {q.type === 'date' && (
                      <input 
                        type="date" 
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        disabled
                      />
                    )}

                    {q.type === 'file' && (
                      <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500">
                        <Upload size={16} />
                        <span>Clique para anexar arquivo</span>
                      </div>
                    )}

                    {(q.type === 'select' || q.type === 'multiselect') && q.options && (
                      <div className="space-y-2">
                        {q.options.map((option, i) => (
                          <label key={i} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type={q.type === 'select' ? 'radio' : 'checkbox'} 
                              name={q.id}
                              className="w-4 h-4 text-teal-600"
                            />
                            <span className="text-sm text-slate-600">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma pergunta adicionada</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
            <div className="text-xs text-slate-500 mb-1">Questionários / Novo</div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingTemplate ? 'Editar Questionário' : 'Criar Novo Questionário'}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
            <Eye size={16} className="mr-2" /> Pré-visualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSave('rascunho')}>
            Salvar Rascunho
          </Button>
          <Button size="sm" onClick={() => handleSave('publicado')}>
            <Save size={16} className="mr-2" /> Publicar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nome do Questionário <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Levantamento de Atividades Operacionais"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva o objetivo deste questionário..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Categoria
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Perguntas ({questions.length})</h3>
            </div>

            <div className="space-y-3">
              {questions.map((question, index) => {
                const typeConfig = getTypeConfig(question.type);
                const TypeIcon = typeConfig.icon;
                const isEditing = editingQuestion === question.id;

                return (
                  <div 
                    key={question.id}
                    className={`border rounded-xl transition-all ${
                      isEditing ? 'border-teal-300 bg-teal-50/30 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
                          <button 
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <GripVertical size={16} className="text-slate-300" />
                          <button 
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === questions.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-400">{index + 1}.</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600`}>
                              <TypeIcon size={10} />
                              {typeConfig.label}
                            </span>
                            {question.required && (
                              <span className="text-[10px] font-medium text-rose-500">Obrigatório</span>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={question.text}
                                onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                                placeholder="Digite a pergunta..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm"
                                autoFocus
                              />

                              <input
                                type="text"
                                value={question.description || ''}
                                onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                                placeholder="Descrição ou ajuda (opcional)"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-xs text-slate-500"
                              />

                              {(question.type === 'select' || question.type === 'multiselect') && question.options && (
                                <div className="space-y-2 pl-4 border-l-2 border-slate-200">
                                  <div className="text-xs font-medium text-slate-500 mb-2">Opções:</div>
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <span className="text-xs text-slate-400">{optIndex + 1}.</span>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                        className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                                      />
                                      <button
                                        onClick={() => removeOption(question.id, optIndex)}
                                        disabled={question.options!.length <= 2}
                                        className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => addOption(question.id)}
                                    className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium mt-2"
                                  >
                                    <Plus size={12} /> Adicionar opção
                                  </button>
                                </div>
                              )}

                              <div className="flex items-center gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                                    className="w-4 h-4 text-teal-600 rounded"
                                  />
                                  <span className="text-xs text-slate-600">Obrigatório</span>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="cursor-pointer"
                              onClick={() => setEditingQuestion(question.id)}
                            >
                              <p className="text-sm font-medium text-slate-700">
                                {question.text || <span className="text-slate-400 italic">Clique para editar...</span>}
                              </p>
                              {question.description && (
                                <p className="text-xs text-slate-500 mt-1">{question.description}</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          <button
                            onClick={() => duplicateQuestion(question.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="Duplicar"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => setEditingQuestion(isEditing ? null : question.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="Configurar"
                          >
                            <Settings size={14} />
                          </button>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {questions.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Layers size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-slate-500 mb-1">Nenhuma pergunta adicionada</p>
                  <p className="text-xs text-slate-400">Clique em "Adicionar Pergunta" para começar</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowTypeSelector(!showTypeSelector)}
                >
                  <Plus size={16} className="mr-2" /> Adicionar Pergunta
                </Button>

                {showTypeSelector && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 p-4">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                      Selecione o tipo de pergunta
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {QUESTION_TYPES.map(({ type, label, icon: Icon, description }) => (
                        <button
                          key={type}
                          onClick={() => addQuestion(type)}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all text-center group"
                        >
                          <Icon size={20} className="text-slate-400 group-hover:text-teal-600" />
                          <span className="text-xs font-medium text-slate-700">{label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowTypeSelector(false)}
                      className="mt-3 w-full text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Perguntas</span>
                <span className="font-medium text-slate-700">{questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Obrigatórias</span>
                <span className="font-medium text-slate-700">{questions.filter(q => q.required).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Categoria</span>
                <span className="font-medium text-slate-700">{formCategory}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="shrink-0 w-5 h-5 text-teal-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-teal-800 mb-1">Dica</h4>
                <p className="text-xs text-teal-700 leading-relaxed">
                  Questionários são usados para levantar informações sobre atividades 
                  operacionais da empresa e identificar quais obrigações legais se aplicam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
