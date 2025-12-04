import React, { useState } from 'react';
import { Download, Filter, MoreVertical, Maximize2, X } from 'lucide-react';

interface InsightsChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExport?: () => void;
  onFilter?: () => void;
  className?: string;
  height?: string;
  showActions?: boolean;
}

export const InsightsChartCard: React.FC<InsightsChartCardProps> = ({
  title,
  subtitle,
  children,
  onExport,
  onFilter,
  className = '',
  height = 'h-64',
  showActions = true
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    if (onExport) {
      onExport();
    }
    setTimeout(() => setIsExporting(false), 1500);
  };

  return (
    <>
      <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all ${className}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {showActions && (
            <div className="flex items-center gap-1">
              {onFilter && (
                <button
                  onClick={onFilter}
                  className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                  title="Filtrar"
                >
                  <Filter size={16} />
                </button>
              )}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors disabled:opacity-50"
                title="Exportar"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={16} />
                )}
              </button>
              <button
                onClick={() => setIsExpanded(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                title="Expandir"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          )}
        </div>
        <div className={`p-4 ${height}`}>
          {children}
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-5xl max-h-[90vh] overflow-hidden animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="text-sm font-medium">Exportar</span>
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 h-[70vh]">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ChartFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onApply: () => void;
}

export const ChartFilterModal: React.FC<ChartFilterModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onApply
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
