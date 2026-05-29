import React from 'react';
import { TrendingUp, Award, Activity, Users2 } from 'lucide-react';
import Card from '../ui/Card';

interface KPIPanelProps {
  totalRx: number;
  averageShare: number;
  growthRate: number;
  topProduct: string;
}

export default function KPIPanel({ totalRx, averageShare, growthRate, topProduct }: KPIPanelProps) {
  const kpis = [
    {
      title: 'Prescripciones Pharmabrand S.A.',
      value: totalRx.toLocaleString(),
      sub: 'Total período filtrado',
      icon: Activity,
      color: 'text-[#00C9A7] bg-[#00C9A7]/10',
    },
    {
      title: 'Cuota de Mercado (Share %)',
      value: `${averageShare.toFixed(1)}%`,
      sub: 'Participación media en ATC',
      icon: Users2,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Tasa de Crecimiento',
      value: `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`,
      sub: 'Evolución vs TAM anterior',
      icon: TrendingUp,
      color: growthRate >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10',
    },
    {
      title: 'Líder en Gastroenterología',
      value: topProduct || 'N/A',
      sub: 'Mayor cuota de prescripciones',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#8892b0] font-medium tracking-wide uppercase">
                {kpi.title}
              </span>
              <p className="text-2xl font-bold text-white font-display">
                {kpi.value}
              </p>
              <span className="text-[11px] text-[#8892b0] block font-light">
                {kpi.sub}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${kpi.color} border border-[#8892b01a]`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
