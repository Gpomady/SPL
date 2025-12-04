import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';

const COLORS = {
  primary: '#0f766e',
  secondary: '#0d9488',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  slate: '#64748b'
};

const CHART_COLORS = ['#0f766e', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ title, subtitle, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl border border-slate-100 shadow-sm ${className}`}>
    <div className="mb-4">
      <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    <div className="min-h-0">
      {children}
    </div>
  </div>
);

interface ComplianceGaugeProps {
  percentage: number;
  title?: string;
  subtitle?: string;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({ 
  percentage, 
  title = 'Conformidade Geral',
  subtitle = 'Meta: 95%'
}) => {
  const data = [
    { name: 'Conformidade', value: percentage, fill: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444' }
  ];

  return (
    <ChartContainer title={title} subtitle={subtitle}>
      <div className="relative h-48 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={150}>
          <RadialBarChart 
            cx="50%" 
            cy="100%" 
            innerRadius="60%" 
            outerRadius="100%" 
            barSize={12}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: '#e2e8f0' }}
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
          <p className="text-xs text-slate-400 mt-1">{percentage >= 80 ? 'Excelente' : percentage >= 60 ? 'Atenção' : 'Crítico'}</p>
        </div>
      </div>
    </ChartContainer>
  );
};

interface MonthlyTrendChartProps {
  data: Array<{ month: string; conformidade: number; naoConformidade: number; pendente?: number }>;
  title?: string;
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ 
  data,
  title = 'Evolução Mensal'
}) => (
  <ChartContainer title={title} subtitle="Últimos 12 meses">
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNConf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area type="monotone" dataKey="conformidade" stroke="#10b981" fillOpacity={1} fill="url(#colorConf)" strokeWidth={2} />
          <Area type="monotone" dataKey="naoConformidade" stroke="#ef4444" fillOpacity={1} fill="url(#colorNConf)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span className="text-xs text-slate-600">Conforme</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-xs text-slate-600">Não Conforme</span>
      </div>
    </div>
  </ChartContainer>
);

interface StatusDistributionChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  title?: string;
}

export const StatusDistributionChart: React.FC<StatusDistributionChartProps> = ({ 
  data,
  title = 'Distribuição por Status'
}) => (
  <ChartContainer title={title} subtitle="Visão consolidada">
    <div className="h-64 min-h-[256px] flex items-center">
      <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value, 'Quantidade']}
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {data.map((item, index) => (
        <div key={item.name} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length] }}
          />
          <span className="text-xs text-slate-600">{item.name}</span>
        </div>
      ))}
    </div>
  </ChartContainer>
);

interface BarComparisonChartProps {
  data: Array<{ name: string; atual: number; anterior: number }>;
  title?: string;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({ 
  data,
  title = 'Comparativo por Área'
}) => (
  <ChartContainer title={title} subtitle="Período atual vs anterior">
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px' 
            }}
          />
          <Bar dataKey="atual" fill="#0f766e" radius={[4, 4, 0, 0]} name="Atual" />
          <Bar dataKey="anterior" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Anterior" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-teal-700"></div>
        <span className="text-xs text-slate-600">Período Atual</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded bg-slate-300"></div>
        <span className="text-xs text-slate-600">Período Anterior</span>
      </div>
    </div>
  </ChartContainer>
);

interface RiskHeatmapProps {
  data: Array<{ area: string; baixo: number; medio: number; alto: number; critico: number }>;
  title?: string;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ 
  data,
  title = 'Matriz de Riscos'
}) => (
  <ChartContainer title={title} subtitle="Distribuição por nível de risco">
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 60, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="area" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={60} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px' 
            }}
          />
          <Bar dataKey="baixo" stackId="risk" fill="#10b981" name="Baixo" />
          <Bar dataKey="medio" stackId="risk" fill="#f59e0b" name="Médio" />
          <Bar dataKey="alto" stackId="risk" fill="#f97316" name="Alto" />
          <Bar dataKey="critico" stackId="risk" fill="#ef4444" name="Crítico" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-4 mt-4">
      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div><span className="text-xs text-slate-600">Baixo</span></div>
      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-500"></div><span className="text-xs text-slate-600">Médio</span></div>
      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-500"></div><span className="text-xs text-slate-600">Alto</span></div>
      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div><span className="text-xs text-slate-600">Crítico</span></div>
    </div>
  </ChartContainer>
);

interface ProgressLineChartProps {
  data: Array<{ name: string; progresso: number; meta: number }>;
  title?: string;
}

export const ProgressLineChart: React.FC<ProgressLineChartProps> = ({ 
  data,
  title = 'Progresso vs Meta'
}) => (
  <ChartContainer title={title} subtitle="Acompanhamento de metas">
    <div className="h-64 min-h-[256px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px' 
            }}
          />
          <Line type="monotone" dataKey="progresso" stroke="#0f766e" strokeWidth={2} dot={{ fill: '#0f766e', strokeWidth: 2 }} name="Progresso" />
          <Line type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Meta" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-teal-700"></div>
        <span className="text-xs text-slate-600">Progresso</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-slate-400 border-dashed border-t-2"></div>
        <span className="text-xs text-slate-600">Meta</span>
      </div>
    </div>
  </ChartContainer>
);

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({ 
  data, 
  color = '#0f766e',
  height = 40
}) => {
  const chartData = data.map((value, index) => ({ value, index }));
  
  return (
    <div style={{ height, minHeight: height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={40} minHeight={height}>
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={`url(#sparkGradient-${color})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
