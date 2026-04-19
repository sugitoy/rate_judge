// src/components/features/dashboard/DashboardDistCharts.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';

interface DashboardDistChartsProps {
  activeT: TournamentConfig;
  distBarData: any[];
  selectedPlayersCount: number;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

export const DashboardDistCharts: React.FC<DashboardDistChartsProps> = ({
  activeT,
  distBarData,
  selectedPlayersCount
}) => {
  const getSubChartMinWidth = (): string => {
    const pc = selectedPlayersCount;
    if (pc <= 3) return '220px';
    if (pc <= 6) return '320px';
    if (pc <= 10) return '400px';
    return '480px';
  };

  return (
    <>
      <div className="card shadow-sm mt-2">
        <h3 className="text-lg font-bold mb-4">{MESSAGES.DASHBOARD_TOTAL_DIST_TITLE} <span className="text-xs font-normal text-gray-400 ml-2">{MESSAGES.DASHBOARD_SORT_NOTE}</span></h3>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={distBarData}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '15px' }} />
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

      <div className="flex flex-wrap gap-6" style={{}}>
        {activeT.criteria.map((c, index) => (
          <div key={c.id} className="card shadow-sm" style={{ flex: `1 1 ${getSubChartMinWidth()}`, minWidth: getSubChartMinWidth() }}>
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: COLORS[index % COLORS.length], flexShrink: 0 }}></span>
              {c.name}
              <span className="text-xs font-normal text-gray-400 ml-auto">{MESSAGES.DASHBOARD_MAX_POINT}{c.maxScore}pt</span>
            </h3>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <BarChart
                  data={distBarData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" angle={-45} textAnchor="end" height={50} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: '#6b7280' }} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '5px' }} />
                  <Bar
                    dataKey={c.id}
                    name={`${c.name} (pt)`}
                    fill={COLORS[index % COLORS.length]}
                    radius={[3, 3, 0, 0] as any}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
