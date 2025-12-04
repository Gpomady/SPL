import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  HelpCircle,
  Ban
} from 'lucide-react';
import type { ComplianceStatus, RiskLevel, Priority, ActionPlanStatus, DocumentStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplianceStatus | RiskLevel | Priority | ActionPlanStatus | DocumentStatus | string;
  type?: 'compliance' | 'risk' | 'priority' | 'action' | 'document';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const complianceConfig: Record<ComplianceStatus, { label: string; color: string; icon: React.ElementType }> = {
  conforme: { label: 'Conforme', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
  vencido: { label: 'Vencido', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  avencer: { label: 'A Vencer', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
  nao_aplicavel: { label: 'N/A', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Ban },
  nao_avaliado: { label: 'Não Avaliado', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: HelpCircle }
};

const riskConfig: Record<RiskLevel, { label: string; color: string; icon: React.ElementType }> = {
  baixo: { label: 'Baixo', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  medio: { label: 'Médio', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertTriangle },
  alto: { label: 'Alto', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
  critico: { label: 'Crítico', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
};

const priorityConfig: Record<Priority, { label: string; color: string; icon: React.ElementType }> = {
  baixa: { label: 'Baixa', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
  media: { label: 'Média', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  alta: { label: 'Alta', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle },
  critica: { label: 'Crítica', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
};

const actionConfig: Record<ActionPlanStatus, { label: string; color: string; icon: React.ElementType }> = {
  pendente: { label: 'Pendente', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock },
  em_andamento: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  concluido: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  atrasado: { label: 'Atrasado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  cancelado: { label: 'Cancelado', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Ban }
};

const documentConfig: Record<DocumentStatus, { label: string; color: string; icon: React.ElementType }> = {
  valido: { label: 'Válido', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  avencer: { label: 'A Vencer', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
  vencido: { label: 'Vencido', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  pendente: { label: 'Pendente', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: Clock }
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
};

const iconSizes = {
  sm: 10,
  md: 12,
  lg: 14
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'compliance',
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  let config: { label: string; color: string; icon: React.ElementType };
  
  switch (type) {
    case 'risk':
      config = riskConfig[status as RiskLevel] || riskConfig.medio;
      break;
    case 'priority':
      config = priorityConfig[status as Priority] || priorityConfig.media;
      break;
    case 'action':
      config = actionConfig[status as ActionPlanStatus] || actionConfig.pendente;
      break;
    case 'document':
      config = documentConfig[status as DocumentStatus] || documentConfig.pendente;
      break;
    default:
      config = complianceConfig[status as ComplianceStatus] || complianceConfig.pendente;
  }
  
  const Icon = config.icon;
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${config.color}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
