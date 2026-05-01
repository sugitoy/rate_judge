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
      <h3 className="text-lg font-bold text-slate-900 mb-4">{MESSAGES.ANALYSIS_STATS_TITLE}</h3>
      <div className="scroll-x-auto flex-1 bg-slate-50 rounded-lg border border-slate-200">
        <table className="w-full text-sm" style={{ minWidth: '1000px' }}>
          <thead className="bg-white sticky top-0 border-b-2 border-slate-200 z-10 shadow-sm">
            <tr>
              <th className="font-bold py-3 px-4 whitespace-nowrap text-slate-700">{MESSAGES.ANALYSIS_TH_ITEM}</th>
              <th className="py-3 px-4 text-right text-slate-600">{MESSAGES.ANALYSIS_TH_MEAN}</th>
              <th className="py-3 px-4 text-right text-slate-600">{MESSAGES.ANALYSIS_TH_MEDIAN}</th>
              <th className="py-3 px-4 text-right text-slate-600">{MESSAGES.ANALYSIS_TH_MAX}</th>
              <th className="py-3 px-4 text-right text-slate-600">{MESSAGES.ANALYSIS_TH_MIN}</th>
              <th className="py-3 px-4 text-right text-slate-400 text-xs font-normal">{MESSAGES.ANALYSIS_TH_VAR}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {totalStat && (
              <tr className="bg-primary-light border-b border-primary/10 font-bold group">
                <td className="py-3 px-4 whitespace-nowrap text-primary">
                  {totalStat.name} <span className="text-xs font-normal text-slate-400">({totalStat.maxScore})</span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">{fmtStats(totalStat.mean, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">{fmtStats(totalStat.median, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-blue-600 font-bold whitespace-nowrap">{fmtStats(totalStat.max, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-danger font-bold whitespace-nowrap">{fmtStats(totalStat.min, totalStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-slate-400 text-xs whitespace-nowrap">{totalStat.variance.toFixed(1)}</td>
              </tr>
            )}
            {critStats.map(st => (
              <tr key={st.id} className="bg-white hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                  {st.name} <span className="text-xs text-slate-400 font-normal">({st.maxScore})</span>
                </td>
                <td className="py-3 px-4 text-right text-slate-600 whitespace-nowrap">{fmtStats(st.mean, st.maxScore)}</td>
                <td className="py-3 px-4 text-right text-slate-600 whitespace-nowrap">{fmtStats(st.median, st.maxScore)}</td>
                <td className="py-3 px-4 text-right text-blue-600 font-semibold whitespace-nowrap">{fmtStats(st.max, st.maxScore)}</td>
                <td className="py-3 px-4 text-right text-danger font-semibold whitespace-nowrap">{fmtStats(st.min, st.maxScore)}</td>
                <td className="py-3 px-4 text-right text-slate-400 text-xs whitespace-nowrap">{st.variance.toFixed(1)}</td>
              </tr>
            ))}
            {/* 減点統計行（有効時のみ） */}
            {deductionStat && (
              <tr className="bg-danger-bg/30 border-t-2 border-danger/10 hover:bg-danger-bg/50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap font-bold text-danger">
                  {deductionStat.name}
                </td>
                <td className="py-3 px-4 text-right text-danger/80 whitespace-nowrap">{fmtStats(deductionStat.mean, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-danger/80 whitespace-nowrap">{fmtStats(deductionStat.median, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-danger font-bold whitespace-nowrap">{fmtStats(deductionStat.max, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-danger/60 whitespace-nowrap">{fmtStats(deductionStat.min, deductionStat.maxScore)}</td>
                <td className="py-3 px-4 text-right text-slate-400 text-xs whitespace-nowrap">{deductionStat.variance.toFixed(1)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
