import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompetitorComparisonProps {
  data: {
    marca: string;
    laboratorio: string;
    tamAnterior: number;
    tamActual: number;
    crecimiento: number;
  }[];
}

export default function CompetitorComparisonChart({ data }: CompetitorComparisonProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#1A1D2E] border border-[#8892b01a] p-3 rounded-xl shadow-xl font-mono text-xs">
          <p className="text-white font-bold mb-1">{item.marca} ({item.laboratorio})</p>
          <p className="text-[#8892b0]">TAM Anterior: <span className="text-white font-semibold">{item.tamAnterior.toLocaleString()} Rx</span></p>
          <p className="text-[#00C9A7]">TAM Actual: <span className="text-white font-bold">{item.tamActual.toLocaleString()} Rx</span></p>
          <p className={`font-semibold ${item.crecimiento >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Crecimiento: {item.crecimiento >= 0 ? '+' : ''}{item.crecimiento.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#252a3f" opacity={0.3} />
          <XAxis 
            dataKey="marca" 
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
            formatter={(value) => <span className="text-xs text-gray-300 font-medium">{value === 'tamAnterior' ? 'TAM Anterior' : 'TAM Actual (Últimos 12M)'}</span>}
          />
          <Bar 
            name="tamAnterior"
            dataKey="tamAnterior" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
          />
          <Bar 
            name="tamActual"
            dataKey="tamActual" 
            fill="#00C9A7" 
            radius={[4, 4, 0, 0]}
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
