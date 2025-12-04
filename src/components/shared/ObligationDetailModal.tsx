import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  FileText,
  Calendar,
  User,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  Paperclip,
  Download,
  Trash2,
  Edit3,
  Save,
  Link2,
  History,
  MessageSquare,
  Eye
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { RiskIndicator } from '../ui/RiskIndicator';
import type { LegalRequirement, Obligation, Evidence, ComplianceStatus } from '../../types';

interface ObligationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: LegalRequirement;
  obligation?: Obligation;
  onStatusChange?: (status: ComplianceStatus, observacao?: string) => void;
  onEvidenceUpload?: (evidence: Partial<Evidence>) => void;
  onEvidenceDelete?: (evidenceId: string) => void;
}

const STATUS_OPTIONS: { value: ComplianceStatus; label: string; color: string }[] = [
  { value: 'conforme', label: 'Conforme', color: 'bg-emerald-500' },
  { value: 'pendente', label: 'Pendente', color: 'bg-amber-500' },
  { value: 'vencido', label: 'Vencido', color: 'bg-red-500' },
  { value: 'avencer', label: 'A Vencer', color: 'bg-orange-500' },
  { value: 'nao_aplicavel', label: 'Não se Aplica', color: 'bg-slate-400' },
  { value: 'nao_avaliado', label: 'Não Avaliado', color: 'bg-slate-300' }
];

export const ObligationDetailModal: React.FC<ObligationDetailModalProps> = ({
  isOpen,
  onClose,
  requirement,
  obligation,
  onStatusChange,
  onEvidenceUpload,
  onEvidenceDelete
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'history'>('details');
  const [selectedStatus, setSelectedStatus] = useState<ComplianceStatus>(obligation?.status || 'nao_avaliado');
  const [observacao, setObservacao] = useState(obligation?.observacoes || '');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    nome: '',
    tipo: 'documento' as Evidence['tipo'],
    validade: '',
    descricao: ''
  });

  if (!isOpen) return null;

  const handleStatusSave = () => {
    if (onStatusChange) {
      onStatusChange(selectedStatus, observacao);
    }
    setIsEditingStatus(false);
  };

  const handleUpload = () => {
    if (onEvidenceUpload && uploadData.nome) {
      onEvidenceUpload({
        nome: uploadData.nome,
        tipo: uploadData.tipo,
        validade: uploadData.validade,
        descricao: uploadData.descricao,
        dataUpload: new Date().toISOString(),
        uploadPor: 'Usuário Atual'
      });
      setShowUploadForm(false);
      setUploadData({ nome: '', tipo: 'documento', validade: '', descricao: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                {requirement.codigo}
              </span>
              <StatusBadge status={obligation?.status || 'nao_avaliado'} type="compliance" />
              <RiskIndicator level={requirement.risco} showLabel={false} variant="dot" size="sm" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 pr-8 line-clamp-2">
              {requirement.descricao}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="border-b border-slate-200">
          <nav className="flex px-6">
            {[
              { id: 'details', label: 'Detalhes', icon: FileText },
              { id: 'evidence', label: 'Evidências', icon: Paperclip, count: obligation?.evidencias?.length },
              { id: 'history', label: 'Histórico', icon: History, count: obligation?.historico?.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                    ${isActive 
                      ? 'border-teal-600 text-teal-700' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'}
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                      Fundamento Legal
                    </label>
                    <p className="text-sm text-slate-800 font-medium">{requirement.fundamentoLegal}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                      Tema / Escopo
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        {requirement.tema}
                      </span>
                      {requirement.escopo?.map((e, i) => (
                        <span key={i} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                      Órgão Fiscalizador
                    </label>
                    <p className="text-sm text-slate-700">
                      {requirement.orgaoFiscalizador || 'Não especificado'}
                    </p>
                  </div>
                  
                  {requirement.linkLegislacao && (
                    <a
                      href={requirement.linkLegislacao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:underline"
                    >
                      <ExternalLink size={14} />
                      Ver legislação original
                    </a>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                      Nível de Risco
                    </label>
                    <RiskIndicator level={requirement.risco} variant="bar" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <User size={12} />
                      Responsável
                    </label>
                    <p className="text-sm text-slate-800">{obligation?.responsavel || 'Não atribuído'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                      <Building2 size={12} />
                      Área
                    </label>
                    <p className="text-sm text-slate-800">{requirement.area} {requirement.subarea && `/ ${requirement.subarea}`}</p>
                  </div>
                </div>
              </div>
              
              {requirement.textoLegal && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <label className="block text-xs font-medium text-slate-500 uppercase mb-2">
                    Texto Legal
                  </label>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{requirement.textoLegal}"
                  </p>
                </div>
              )}
              
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Status de Conformidade</h3>
                  {!isEditingStatus && (
                    <button
                      onClick={() => setIsEditingStatus(true)}
                      className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <Edit3 size={14} />
                      Alterar
                    </button>
                  )}
                </div>
                
                {isEditingStatus ? (
                  <div className="space-y-4 bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Novo Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => setSelectedStatus(option.value)}
                            className={`
                              px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                              ${selectedStatus === option.value
                                ? 'ring-2 ring-offset-2 ring-teal-500 bg-white shadow-sm'
                                : 'bg-white border border-slate-200 hover:border-slate-300'}
                            `}
                          >
                            <span className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Observações
                      </label>
                      <textarea
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Adicione observações sobre esta avaliação..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingStatus(false)}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleStatusSave}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
                      >
                        <Save size={16} />
                        Salvar Alteração
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <StatusBadge status={obligation?.status || 'nao_avaliado'} type="compliance" size="lg" />
                    {obligation?.observacoes && (
                      <p className="text-sm text-slate-600 italic">
                        "{obligation.observacoes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Evidências Anexadas</h3>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
                >
                  <Upload size={16} />
                  Anexar Evidência
                </button>
              </div>
              
              {showUploadForm && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                  <h4 className="font-medium text-slate-700">Nova Evidência</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                      <input
                        type="text"
                        value={uploadData.nome}
                        onChange={(e) => setUploadData({ ...uploadData, nome: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        placeholder="Ex: Licença de Operação"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                      <select
                        value={uploadData.tipo}
                        onChange={(e) => setUploadData({ ...uploadData, tipo: e.target.value as any })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      >
                        <option value="documento">Documento</option>
                        <option value="certificado">Certificado</option>
                        <option value="licenca">Licença</option>
                        <option value="foto">Foto</option>
                        <option value="relatorio">Relatório</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Validade</label>
                      <input
                        type="date"
                        value={uploadData.validade}
                        onChange={(e) => setUploadData({ ...uploadData, validade: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                      <input
                        type="text"
                        value={uploadData.descricao}
                        onChange={(e) => setUploadData({ ...uploadData, descricao: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        placeholder="Descrição opcional"
                      />
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-300 transition-colors cursor-pointer">
                    <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Arraste o arquivo aqui ou clique para selecionar</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG, DOC (máx. 10MB)</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!uploadData.nome}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400"
                    >
                      Enviar Evidência
                    </button>
                  </div>
                </div>
              )}
              
              {obligation?.evidencias && obligation.evidencias.length > 0 ? (
                <div className="space-y-3">
                  {obligation.evidencias.map((evidence) => (
                    <div 
                      key={evidence.id}
                      className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{evidence.nome}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="capitalize">{evidence.tipo}</span>
                            {evidence.validade && (
                              <>
                                <span>•</span>
                                <span>Validade: {evidence.validade}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>Enviado por {evidence.uploadPor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => onEvidenceDelete?.(evidence.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Paperclip size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600 font-medium">Nenhuma evidência anexada</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Anexe documentos, licenças ou certificados como comprovação
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fade-in">
              {obligation?.historico && obligation.historico.length > 0 ? (
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
                  {obligation.historico.map((item) => (
                    <div key={item.id} className="relative pl-8">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-sm" />
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{item.acao}</span>
                          <span className="text-xs text-slate-500">{item.data}</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Por <span className="font-medium">{item.usuario}</span>
                        </p>
                        {item.observacao && (
                          <p className="text-sm text-slate-500 mt-2 italic">"{item.observacao}"</p>
                        )}
                        {item.statusAnterior && item.statusNovo && (
                          <div className="flex items-center gap-2 mt-2">
                            <StatusBadge status={item.statusAnterior} type="compliance" size="sm" />
                            <span className="text-slate-400">→</span>
                            <StatusBadge status={item.statusNovo} type="compliance" size="sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <History size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600 font-medium">Nenhum histórico registrado</p>
                  <p className="text-sm text-slate-500 mt-1">
                    As alterações de status serão registradas aqui
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObligationDetailModal;
