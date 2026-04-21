// src/components/features/analysis/AnalysisDistCharts.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';


const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

interface AnalysisOverallDistChartProps {
  activeT: TournamentConfig;
  distBarData: any[];
}

export const AnalysisOverallDistChart: React.FC<AnalysisOverallDistChartProps> = ({
  activeT,
  distBarData,
}) => {
  return (
    <div className="card shadow-sm w-full animate-in">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
        <span>{MESSAGES.ANALYSIS_TOTAL_DIST_TITLE}</span>
        <span className="text-[10px] font-normal text-slate-400 italic px-2 py-1 bg-slate-50 border border-slate-100 rounded">
          {MESSAGES.ANALYSIS_SORT_NOTE}
        </span>
      </h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer>
          <BarChart
            data={distBarData}
            margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} stroke="#e2e8f0" />
            <Tooltip 
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} 
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px' }} 
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px', fontSize: '13px', fontWeight: 500 }} />
            {activeT.criteria.map((c, index) => (
              <Bar
                key={c.id}
                dataKey={c.id}
                name={c.name}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
                radius={index === activeT.criteria.length - 1 ? [4, 4, 0, 0] as any : [0, 0, 0, 0] as any}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface AnalysisCritDistChartsProps {
  activeT: TournamentConfig;
  distBarData: any[];
  selectedPlayersCount: number;
}

export const AnalysisCritDistCharts: React.FC<AnalysisCritDistChartsProps> = ({
  activeT,
  distBarData,
  selectedPlayersCount,
}) => {
  return (
    <>
      {activeT.criteria.map((c, index) => (
        <div key={c.id} className="card shadow-sm w-full animate-in">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-sm flex-shrink-0" 
              style={{ background: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1">{c.name}</span>
            <span className="text-[10px] font-normal text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              {MESSAGES.ANALYSIS_MAX_POINT}{c.maxScore}pt
            </span>
          </h3>
          <div className="w-full h-[240px]">
            <ResponsiveContainer>
              <BarChart
                data={distBarData}
                margin={{ top: 10, right: 10, left: -20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={50} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#e2e8f0" />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} 
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', padding: '8px', border: '1px solid #e2e8f0' }} 
                />
                <Bar
                  dataKey={c.id}
                  name={`${c.name} (pt)`}
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0] as any}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </>
  );
};
