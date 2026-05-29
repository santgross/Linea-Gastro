import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MarketShareChartProps {
  data: {
    name: string;
    value: number;
    laboratorio: string;
  }[];
}

const COLORS = [
  '#00C9A7', // Farlogran Teal
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#64748B', // Slate
];

export default function MarketShareChart({ data }: MarketShareChartProps) {
  // Filtrar valores vacíos para que no rompa el gráfico
  const cleanData = data.filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#1A1D2E] border border-[#8892b01a] p-3 rounded-lg shadow-xl font-mono text-xs text-white">
          <p className="font-bold text-[#00C9A7] mb-1">{item.name}</p>
          <p className="text-gray-400">Lab: <span className="text-gray-200">{item.laboratorio}</span></p>
          <p className="text-gray-400">Share: <span className="text-white font-semibold">{item.value.toFixed(1)}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[280px] flex items-center justify-center">
      {cleanData.length === 0 ? (
        <p className="text-gray-400 text-sm font-light">Sin datos de share para este filtro</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleanData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {cleanData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.laboratorio === 'PHARMABRAND' ? '#00C9A7' : COLORS[index % COLORS.length]} 
                  stroke="#1A1D2E"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconSize={10}
              iconType="circle"
              formatter={(value, entry: any) => {
                const item = entry.payload;
                return (
                  <span className="text-xs text-gray-300 font-medium ml-1">
                    {value} ({item.value.toFixed(1)}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
