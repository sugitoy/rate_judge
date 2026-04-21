// src/components/features/analysis/AnalysisRadarChart.tsx
import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';

interface AnalysisRadarChartProps {
  radarData: any[];
  radarPlayers: any[];
  selectedPlayersCount: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const AnalysisRadarChart: React.FC<AnalysisRadarChartProps> = ({
  radarData,
  radarPlayers,
  selectedPlayersCount
}) => {
  return (
    <div className="card shadow-sm w-full animate-in">
      <h3 className="text-lg font-bold text-slate-900 mb-2">{MESSAGES.ANALYSIS_RADAR_TITLE}</h3>
      {selectedPlayersCount > 5 && (
        <div className="bg-warning-bg text-warning border border-warning/20 px-3 py-2 rounded-lg text-xs font-bold mb-4 flex items-center gap-2">
          <span className="shrink-0 bg-warning text-white rounded-full w-4 h-4 flex items-center justify-center">!</span>
          {MESSAGES.ANALYSIS_RADAR_LIMIT_REACHED}
        </div>
      )}
      <p className="text-slate-500 text-xs mb-6 italic">{MESSAGES.ANALYSIS_RADAR_HINT}</p>
      
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} stroke="#f1f5f9" />
            <Tooltip 
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'スコア割合']} 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '10px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 500 }} />
            {radarPlayers.map((p, index) => (
              <Radar
                key={p.id}
                name={`${p.entryNo}. ${p.name}`}
                dataKey={p.id}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
