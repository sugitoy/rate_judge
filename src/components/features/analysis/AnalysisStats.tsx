// src/components/features/analysis/AnalysisStats.tsx
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

interface AnalysisStatsProps {
  totalStat: StatData | null;
  critStats: StatData[];
  deductionStat?: StatData | null;
  displayMode: 'points' | 'percentage' | 'tier';
}

export const AnalysisStats: React.FC<AnalysisStatsProps> = ({ totalStat, critStats, deductionStat, displayMode }) => {
  const fmtStats = (val: number, max: number) => {
    const ptStr = `${val.toFixed(1)}pt`;
    const isPct = displayMode === 'percentage' || displayMode === 'tier';
    if (max === 0) return isPct ? '0.0%' : ptStr;
    const pct = (val / max) * 100;
    const pctStr = `${pct.toFixed(1)}%`;
    
    return isPct ? pctStr : ptStr;
  };

  return (
    <div className="card shadow-sm flex flex-col flex-1 animate-in" style={{ minWidth: 0 }}>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{MESSAGES.ANALYSIS_STATS_TITLE}</h3>
      <div className="scroll-x-auto w-full flex-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm" style={{ minWidth: '600px' }}>
          <thead className="bg-white dark:bg-slate-900 sticky top-0 border-b-2 border-slate-200 dark:border-slate-600 z-10 shadow-sm">
            <tr>
              <th className="font-bold py-3 px-4 whitespace-nowrap text-slate-700 dark:text-slate-100">{MESSAGES.ANALYSIS_TH_ITEM}</th>
              <th className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{MESSAGES.ANALYSIS_TH_MEAN}</th>
              <th className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{MESSAGES.ANALYSIS_TH_MEDIAN}</th>
              <th className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{MESSAGES.ANALYSIS_TH_MAX}</th>
              <th className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{MESSAGES.ANALYSIS_TH_MIN}</th>
              <th className="py-3 px-4 text-center text-slate-400 dark:text-slate-500 text-xs font-normal">{MESSAGES.ANALYSIS_TH_VAR}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {totalStat && (
              <tr className="bg-primary-light dark:bg-cyan-500/10 border-b border-primary/10 dark:border-cyan-500/20 font-bold group">
                <td className="py-3 px-4 whitespace-nowrap text-primary dark:text-cyan-400">
                  {totalStat.name} <span className="text-xs font-normal text-slate-400 dark:text-slate-400">({totalStat.maxScore})</span>
                </td>
                 <td className="py-3 px-4 text-center whitespace-nowrap dark:text-slate-100">{fmtStats(totalStat.mean, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-center whitespace-nowrap dark:text-slate-100">{fmtStats(totalStat.median, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-blue-600 dark:text-cyan-400 font-bold whitespace-nowrap">{fmtStats(totalStat.max, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-danger dark:text-rose-400 font-bold whitespace-nowrap">{fmtStats(totalStat.min, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{totalStat.variance.toFixed(1)}</td>
              </tr>
            )}
             {critStats.map(st => (
              <tr key={st.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-100">
                  {st.name} <span className="text-xs text-slate-400 dark:text-slate-400 font-normal">({st.maxScore})</span>
                </td>
                 <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 whitespace-nowrap">{fmtStats(st.mean, st.maxScore)}</td>
                <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300 whitespace-nowrap">{fmtStats(st.median, st.maxScore)}</td>
                <td className="py-3 px-4 text-center text-blue-600 dark:text-cyan-400 font-semibold whitespace-nowrap">{fmtStats(st.max, st.maxScore)}</td>
                <td className="py-3 px-4 text-center text-danger dark:text-rose-400 font-semibold whitespace-nowrap">{fmtStats(st.min, st.maxScore)}</td>
                <td className="py-3 px-4 text-center text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{st.variance.toFixed(1)}</td>
              </tr>
            ))}
             {deductionStat && (
              <tr className="bg-danger-bg/30 dark:bg-rose-500/10 border-t-2 border-danger/10 dark:border-rose-500/30 hover:bg-danger-bg/50 dark:hover:bg-rose-500/20 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap font-bold text-danger dark:text-rose-400">
                  {deductionStat.name}
                </td>
                 <td className="py-3 px-4 text-center text-danger/80 dark:text-rose-300 whitespace-nowrap">{fmtStats(deductionStat.mean, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-danger/80 dark:text-rose-300 whitespace-nowrap">{fmtStats(deductionStat.median, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-danger dark:text-rose-400 font-bold whitespace-nowrap">{fmtStats(deductionStat.max, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-danger/60 dark:text-rose-500/60 whitespace-nowrap">{fmtStats(deductionStat.min, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-center text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{deductionStat.variance.toFixed(1)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
