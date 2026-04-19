// src/components/features/dashboard/DashboardRadarChart.tsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';

interface DashboardRadarChartProps {
  radarData: any[];
  radarPlayers: any[];
  selectedPlayersCount: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const DashboardRadarChart: React.FC<DashboardRadarChartProps> = ({
  radarData,
  radarPlayers,
  selectedPlayersCount
}) => {
  return (
    <div className="card shadow-sm mt-6">
      <h3 className="text-lg font-bold mb-2">{MESSAGES.DASHBOARD_RADAR_TITLE}</h3>
      {selectedPlayersCount > 5 && (
        <p className="text-yellow-800 text-sm mb-4 bg-yellow-100 p-2 rounded inline-block border border-yellow-300 font-medium">
          {MESSAGES.DASHBOARD_RADAR_LIMIT_REACHED}
        </p>
      )}
      <p className="text-gray-500 text-sm mb-4">{MESSAGES.DASHBOARD_RADAR_HINT}</p>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Tooltip formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'スコア割合']} />
            <Legend />
            {radarPlayers.map((p, index) => (
              <Radar
                key={p.id}
                name={`${p.entryNo}. ${p.name}`}
                dataKey={p.id}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
