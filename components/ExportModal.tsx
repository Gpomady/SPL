import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, X, Check, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onExport: (format: 'excel' | 'pdf' | 'csv') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  title = 'Exportar Dados',
  onExport 
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      onExport(selectedFormat);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    }, 1500);
  };

  const formats = [
    { 
      id: 'excel' as const, 
      icon: FileSpreadsheet, 
      label: 'Excel (.xlsx)', 
      desc: 'Planilha completa com formatação' 
    },
    { 
      id: 'pdf' as const, 
      icon: FileText, 
      label: 'PDF', 
      desc: 'Relatório formatado para impressão' 
    },
    { 
      id: 'csv' as const, 
      icon: Download, 
      label: 'CSV', 
      desc: 'Dados brutos separados por vírgula' 
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {exportSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Exportação Concluída!</h3>
              <p className="text-sm text-slate-500">O download será iniciado automaticamente.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-4">
                Escolha o formato de exportação:
              </p>

              <div className="space-y-3">
                {formats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedFormat === format.id ? 'bg-teal-100' : 'bg-slate-100'
                    }`}>
                      <format.icon size={20} className={
                        selectedFormat === format.id ? 'text-teal-600' : 'text-slate-500'
                      } />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`font-medium ${
                        selectedFormat === format.id ? 'text-teal-700' : 'text-slate-700'
                      }`}>
                        {format.label}
                      </p>
                      <p className="text-xs text-slate-500">{format.desc}</p>
                    </div>
                    {selectedFormat === format.id && (
                      <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!exportSuccess && (
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Exportar
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ActionBarProps {
  onExport: () => void;
  onFilter: () => void;
  isFilterActive?: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showNewButton?: boolean;
  onNew?: () => void;
  newButtonLabel?: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onExport,
  onFilter,
  isFilterActive = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Pesquisar...',
  showNewButton = true,
  onNew,
  newButtonLabel = 'Novo'
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <svg 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onFilter}
          className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            isFilterActive 
              ? 'border-teal-500 bg-teal-50 text-teal-700' 
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>
          Filtros
          {isFilterActive && (
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
          )}
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2.5 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          <Download size={16} />
          Exportar
        </button>

        {showNewButton && onNew && (
          <button
            onClick={onNew}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-teal-600/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {newButtonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
