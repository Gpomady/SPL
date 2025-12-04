import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MapPin,
  FileText,
  ShieldAlert,
  Target,
  Zap,
  ChevronRight,
  AlertCircle,
  Scale
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { RiskIndicator } from '../ui/RiskIndicator';
import type { Company, DashboardStats, LegalRequirement, ActionPlan, LegalUpdate } from '../../types';

interface ExecutiveDashboardProps {
  company?: Company;
  stats: DashboardStats;
  urgentObligations: Array<{
    id: string;
    codigo: string;
    descricao: string;
    prazo: string;
    risco: string;
    status: string;
  }>;
  recentUpdates: LegalUpdate[];
  actionPlans: ActionPlan[];
  onViewObligation?: (id: string) => void;
  onViewAllObligations?: () => void;
  onViewActionPlan?: (id: string) => void;
}

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray';
  trend?: { value: number; isUp: boolean };
  subLabel?: string;
  onClick?: () => void;
}> = ({ label, value, icon: Icon, color, trend, subLabel, onClick }) => {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    gray: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white p-5 rounded-xl border border-slate-100 shadow-sm 
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.isUp ? 'text-emerald-600' : 'text-red-500'
          }`}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
        {subLabel && (
          <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>
        )}
      </div>
    </div>
  );
};

const ConformityGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#e2e8f0"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke={getColor()}
          strokeWidth="10"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{percentage}%</span>
        <span className="text-xs text-slate-500">Conformidade</span>
      </div>
    </div>
  );
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  company,
  stats,
  urgentObligations,
  recentUpdates,
  actionPlans,
  onViewObligation,
  onViewAllObligations,
  onViewActionPlan
}) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 capitalize">{formattedDate}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">
            Painel de Conformidade
          </h1>
          {company && (
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <Building2 size={16} />
              {company.nomeFantasia}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onViewAllObligations}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg shadow-teal-600/20"
          >
            <FileText size={18} />
            Ver todas as obrigações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Conformes"
            value={stats.conformes}
            icon={CheckCircle2}
            color="green"
            trend={{ value: 5, isUp: true }}
            subLabel="Atendidos"
          />
          <StatCard
            label="Pendentes"
            value={stats.pendentes}
            icon={Clock}
            color="yellow"
            subLabel="Aguardando ação"
          />
          <StatCard
            label="Vencidas"
            value={stats.vencidas}
            icon={XCircle}
            color="red"
            subLabel="Ação imediata"
          />
          <StatCard
            label="A Vencer (30d)"
            value={stats.aVencer}
            icon={AlertTriangle}
            color="purple"
            subLabel="Próximos 30 dias"
          />
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <ConformityGauge percentage={stats.taxaConformidade} />
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-slate-700">Meta: 95%</p>
            <p className="text-xs text-slate-500">
              {stats.taxaConformidade >= 95 
                ? 'Meta atingida!' 
                : `Faltam ${(95 - stats.taxaConformidade).toFixed(1)}%`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50">
                <ShieldAlert size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Atenção Urgente</h3>
                <p className="text-xs text-slate-500">Itens que requerem ação imediata</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
              {urgentObligations.length}
            </span>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            {urgentObligations.length > 0 ? (
              urgentObligations.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewObligation?.(item.id)}
                  className="w-full p-4 hover:bg-slate-50 transition-colors text-left flex items-start gap-4"
                >
                  <div className="shrink-0 mt-0.5">
                    <RiskIndicator level={item.risco as any} variant="dot" showLabel={false} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                        {item.codigo}
                      </span>
                      <StatusBadge status={item.status as any} type="compliance" size="sm" showIcon={false} />
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">{item.descricao}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <Calendar size={12} />
                      <span>Prazo: {item.prazo}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 shrink-0 mt-1" />
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
                <p className="font-medium text-slate-600">Tudo em dia!</p>
                <p className="text-sm">Nenhum item urgente no momento</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Scale size={18} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Atualizações Legais</h3>
                <p className="text-xs text-slate-500">Novas leis e alterações</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {recentUpdates.filter(u => u.novo).length} novas
            </span>
          </div>
          
          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            {recentUpdates.length > 0 ? (
              recentUpdates.slice(0, 5).map((update) => (
                <div key={update.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`
                      px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${update.escopo === 'federal' ? 'bg-blue-100 text-blue-700' : 
                        update.escopo === 'estadual' ? 'bg-amber-100 text-amber-700' : 
                        'bg-purple-100 text-purple-700'}
                    `}>
                      {update.escopo}
                    </span>
                    <span className="text-xs text-slate-400">{update.data}</span>
                    {update.novo && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                        Novo
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800">{update.titulo}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{update.resumo}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <RiskIndicator level={update.impacto} variant="dot" showLabel size="sm" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400">
                <FileText size={32} className="mx-auto mb-2" />
                <p className="font-medium text-slate-600">Nenhuma atualização</p>
                <p className="text-sm">As atualizações legais aparecerão aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {actionPlans.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <Target size={18} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Planos de Ação</h3>
                <p className="text-xs text-slate-500">Acompanhamento de ações corretivas</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionPlans.slice(0, 6).map((plan) => (
              <button
                key={plan.id}
                onClick={() => onViewActionPlan?.(plan.id)}
                className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={plan.status} type="action" size="sm" />
                  <span className="text-xs text-slate-500">{plan.prazo}</span>
                </div>
                <p className="font-medium text-slate-800 text-sm line-clamp-2">{plan.titulo}</p>
                <p className="text-xs text-slate-500 mt-1">Responsável: {plan.responsavel}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progresso</span>
                    <span>{plan.progresso}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${plan.progresso}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;
