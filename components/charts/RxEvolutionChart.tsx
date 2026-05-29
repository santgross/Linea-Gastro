import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface RxEvolutionChartProps {
  data: {
    periodo: string;
    rxFarlogran: number;
    rxCompetencia: number;
    total: number;
  }[];
}

export default function RxEvolutionChart({ data }: RxEvolutionChartProps) {
  // Traducir las claves para un Tooltip amigable
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1D2E] border border-[#8892b01a] p-4 rounded-xl shadow-xl font-mono text-xs">
          <p className="text-white font-semibold mb-2">Período: {label}</p>
          <p className="text-[#00C9A7]">Pharmabrand S.A.: <span className="text-white font-bold">{payload[0].value.toLocaleString()} Rx</span></p>
          {payload[1] && (
            <p className="text-amber-400">Competencia: <span className="text-white font-bold">{payload[1].value.toLocaleString()} Rx</span></p>
          )}
          <hr className="my-1.5 border-[#8892b01a]" />
          <p className="text-gray-400">Mercado Total: <span className="text-white font-bold">{(payload[0].value + (payload[1]?.value || 0)).toLocaleString()} Rx</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorFarlogran" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00C9A7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCompetencia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#252a3f" opacity={0.3} />
          <XAxis 
            dataKey="periodo" 
            stroke="#8892b0" 
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            stroke="#8892b0" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-xs text-gray-300 font-medium">{value === 'rxFarlogran' ? 'Pharmabrand S.A. Rx' : 'Competidores Rx'}</span>}
          />
          <Area 
            name="rxFarlogran"
            type="monotone" 
            dataKey="rxFarlogran" 
            stroke="#00C9A7" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFarlogran)" 
          />
          <Area 
            name="rxCompetencia"
            type="monotone" 
            dataKey="rxCompetencia" 
            stroke="#F59E0B" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorCompetencia)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
