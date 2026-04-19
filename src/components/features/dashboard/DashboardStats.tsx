// src/components/features/dashboard/DashboardStats.tsx
import React from 'react';
import { MESSAGES } from '../../../constants/messages';

interface StatData {
  id: string;
  name: string;
  maxScore: number;
  mean: number;
  median: number;
  max: number;
  min: number;
  variance: number;
}

interface DashboardStatsProps {
  totalStat: StatData | null;
  critStats: StatData[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ totalStat, critStats }) => {
  const fmtStats = (val: number, max: number) => {
    if (max === 0) return `0.0% (${val.toFixed(1)}pt)`;
    const pct = (val / max) * 100;
    return `${pct.toFixed(1)}% (${val.toFixed(1)}pt)`;
  };

  return (
    <div className="card shadow-sm flex flex-col flex-1">
      <h3 className="text-lg font-bold mb-4">{MESSAGES.DASHBOARD_STATS_TITLE}</h3>
      <div className="table-wrapper flex-1 overflow-auto bg-gray-50 rounded border">
        <table className="w-full text-sm">
          <thead className="bg-white sticky top-0 border-b-2 border-gray-200 z-10 shadow-sm">
            <tr>
              <th className="font-bold py-2 px-3 whitespace-nowrap">{MESSAGES.DASHBOARD_TH_ITEM}</th>
              <th className="py-2 px-3 text-right">{MESSAGES.DASHBOARD_TH_MEAN}</th>
              <th className="py-2 px-3 text-right">{MESSAGES.DASHBOARD_TH_MEDIAN}</th>
              <th className="py-2 px-3 text-right">{MESSAGES.DASHBOARD_TH_MAX}</th>
              <th className="py-2 px-3 text-right">{MESSAGES.DASHBOARD_TH_MIN}</th>
              <th className="py-2 px-3 text-right text-gray-400 text-xs">{MESSAGES.DASHBOARD_TH_VAR}</th>
            </tr>
          </thead>
          <tbody>
            {totalStat && (
              <tr className="bg-blue-50 border-b border-blue-200 font-bold">
                <td className="py-2 px-3 whitespace-nowrap">{totalStat.name} <span className="text-xs font-normal text-gray-500">({totalStat.maxScore})</span></td>
                <td className="py-2 px-3 text-right whitespace-nowrap">{fmtStats(totalStat.mean, totalStat.maxScore)}</td>
                <td className="py-2 px-3 text-right whitespace-nowrap">{fmtStats(totalStat.median, totalStat.maxScore)}</td>
                <td className="py-2 px-3 text-right text-blue-600 whitespace-nowrap">{fmtStats(totalStat.max, totalStat.maxScore)}</td>
                <td className="py-2 px-3 text-right text-red-500 whitespace-nowrap">{fmtStats(totalStat.min, totalStat.maxScore)}</td>
                <td className="py-2 px-3 text-right text-gray-400 text-xs whitespace-nowrap">{totalStat.variance.toFixed(1)}</td>
              </tr>
            )}
            {critStats.map(st => (
              <tr key={st.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-2 px-3 whitespace-nowrap">{st.name} <span className="text-xs text-gray-400">({st.maxScore})</span></td>
                <td className="py-2 px-3 text-right text-gray-700 whitespace-nowrap">{fmtStats(st.mean, st.maxScore)}</td>
                <td className="py-2 px-3 text-right text-gray-700 whitespace-nowrap">{fmtStats(st.median, st.maxScore)}</td>
                <td className="py-2 px-3 text-right text-blue-600 whitespace-nowrap">{fmtStats(st.max, st.maxScore)}</td>
                <td className="py-2 px-3 text-right text-red-500 whitespace-nowrap">{fmtStats(st.min, st.maxScore)}</td>
                <td className="py-2 px-3 text-right text-gray-400 text-xs whitespace-nowrap">{st.variance.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
