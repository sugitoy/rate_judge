// src/components/features/analysis/AnalysisDistCharts.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';
import { useUIStore } from '../../../store/useUIStore';


const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
const DEDUCTION_COLOR = '#ef4444';

/** 共通のツールチップ・Y軸フォーマッタ */
const makeFormatter = (displayMode: 'points' | 'percentage' | 'tier') =>
  (val: number) => (displayMode === 'percentage' || displayMode === 'tier') ? `${val.toFixed(1)}%` : `${val.toFixed(1)}pt`;

/**
 * 全体得点分布（小計）グラフ
 * 審査項目の積み上げのみを表示（減点を含まない）
 */
const SubtotalBarChart: React.FC<{
  activeT: TournamentConfig;
  subtotalBarData: Record<string, string | number>[];
  displayMode: 'points' | 'percentage' | 'tier';
}> = ({ activeT, subtotalBarData, displayMode }) => {
  const totalMax = activeT.criteria.reduce((s, c) => s + c.maxScore, 0);

  const processedData = subtotalBarData.map(d => {
    if (displayMode === 'points') return d;
    const newD = { ...d };
    activeT.criteria.forEach(c => {
      newD[c.id] = totalMax > 0 ? (Number(d[c.id]) / totalMax) * 100 : 0;
    });
    return newD;
  });

  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={40} tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} interval={0} stroke={isDark ? '#334155' : '#e2e8f0'} />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
            stroke={isDark ? '#334155' : '#e2e8f0'}
            unit={(displayMode === 'percentage' || displayMode === 'tier') ? '%' : ''}
            tickFormatter={(val) => val.toFixed(1)}
            domain={([dataMin, dataMax]) => {
              const isPct = displayMode === 'percentage' || displayMode === 'tier';
              const padding = isPct ? 2 : 5;
              const limit = isPct ? 100 : totalMax;
              const min = Math.max(0, Math.floor(Number(dataMin) - padding));
              const max = Math.min(limit, Math.ceil(Number(dataMax) + padding));
              return [min, max];
            }}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
              fontSize: '12px', 
              padding: '12px' 
            }}
            itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            formatter={(val) => makeFormatter(displayMode)(Number(val))}
          />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px', fontSize: '13px', fontWeight: 500 }} />
          {activeT.criteria.map((c, index) => (
            <Bar
              key={c.id}
              dataKey={c.id}
              name={(displayMode === 'percentage' || displayMode === 'tier') ? `${c.name} (%)` : c.name}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
              radius={index === activeT.criteria.length - 1 ? [4, 4, 0, 0] as [number, number, number, number] : [0, 0, 0, 0] as [number, number, number, number]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * 全体得点分布（合計）グラフ
 * 最終的な合計得点のみをシンプルな棒グラフで表示（0固定開始）
 */
const TotalBarChart: React.FC<{
  activeT: TournamentConfig;
  totalBarData: Record<string, string | number>[];
  displayMode: 'points' | 'percentage' | 'tier';
}> = ({ activeT, totalBarData, displayMode }) => {
  const totalMax = activeT.criteria.reduce((s, c) => s + c.maxScore, 0);

  const processedData = totalBarData.map(d => {
    return {
      label: d['label'],
      total: (displayMode === 'percentage' || displayMode === 'tier')
        ? (totalMax > 0 ? (Number(d['total']) / totalMax) * 100 : 0)
        : Number(d['total']),
    };
  });

  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={40} tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }} interval={0} stroke={isDark ? '#334155' : '#e2e8f0'} />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
            stroke={isDark ? '#334155' : '#e2e8f0'}
            unit={(displayMode === 'percentage' || displayMode === 'tier') ? '%' : ''}
            tickFormatter={(val) => val.toFixed(1)}
            domain={[0, (displayMode === 'percentage' || displayMode === 'tier') ? 100 : totalMax]}
          />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', 
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
              fontSize: '12px', 
              padding: '12px' 
            }}
            itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
            formatter={(val) => makeFormatter(displayMode)(Number(val))}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '13px', fontWeight: 500 }}
          />
          <Bar
            dataKey="total"
            name={(displayMode === 'percentage' || displayMode === 'tier') ? MESSAGES.ANALYSIS_TOTAL_PCT : MESSAGES.ANALYSIS_TOTAL_PT}
            fill="#3b82f6"
            radius={[4, 4, 0, 0] as [number, number, number, number]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};



// --- 合計グラフ（減点考慮後の最終得点） ---
interface AnalysisTotalDistChartProps {
  activeT: TournamentConfig;
  totalBarData: Record<string, string | number>[];
  displayMode: 'points' | 'percentage' | 'tier';
}

export const AnalysisTotalDistChart: React.FC<AnalysisTotalDistChartProps> = ({
  activeT,
  totalBarData,
  displayMode,
}) => {
  if (!totalBarData.length) return null;

  return (
    <div className="card shadow-sm w-full animate-in">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
        <span>{MESSAGES.ANALYSIS_TOTAL_DIST}</span>
      </h3>
      <TotalBarChart activeT={activeT} totalBarData={totalBarData} displayMode={displayMode} />
    </div>
  );
};

// --- 小計グラフ（審査項目の積み上げ） ---
interface AnalysisSubtotalDistChartProps {
  activeT: TournamentConfig;
  subtotalBarData: Record<string, string | number>[];
  displayMode: 'points' | 'percentage' | 'tier';
  hasDeduction: boolean;
}

export const AnalysisSubtotalDistChart: React.FC<AnalysisSubtotalDistChartProps> = ({
  activeT,
  subtotalBarData,
  displayMode,
  hasDeduction,
}) => (
  <div className="card shadow-sm w-full animate-in">
    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-between">
      <span>{hasDeduction ? MESSAGES.ANALYSIS_SUBTOTAL_DIST : MESSAGES.ANALYSIS_TOTAL_DIST_TITLE}</span>
    </h3>
    <SubtotalBarChart activeT={activeT} subtotalBarData={subtotalBarData} displayMode={displayMode} />
  </div>
);

// --- 審査項目別グラフ ---
interface AnalysisCritDistChartsProps {
  activeT: TournamentConfig;
  subtotalBarData: Record<string, string | number>[];
  selectedPlayersCount: number;
  displayMode: 'points' | 'percentage' | 'tier';
}

export const AnalysisCritDistCharts: React.FC<AnalysisCritDistChartsProps> = ({
  activeT,
  subtotalBarData,
  selectedPlayersCount,
  displayMode,
}) => (
  <>
    {activeT.criteria.map((c, index) => {
      const { theme } = useUIStore();
      const isDark = theme === 'dark';
      return (
        <div key={c.id} className="card shadow-sm w-full animate-in">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1">{c.name}</span>
            <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
              {MESSAGES.ANALYSIS_MAX_POINT}{c.maxScore}pt
            </span>
          </h3>
        <div className="w-full h-[320px]">
          <ResponsiveContainer>
            <BarChart
              data={subtotalBarData.map(d => {
                if (displayMode === 'points') return d;
                return {
                  ...d,
                  [c.id]: c.maxScore > 0 ? (Number(d[c.id]) / c.maxScore) * 100 : 0
                };
              })}
                margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={30} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: isDark ? '#94a3b8' : '#64748b' }} interval={0} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <YAxis
                  tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  unit={(displayMode === 'percentage' || displayMode === 'tier') ? '%' : ''}
                  tickFormatter={(val) => val.toFixed(1)}
                  domain={([dataMin, dataMax]) => {
                    const isPct = displayMode === 'percentage' || displayMode === 'tier';
                    const padding = 2;
                    const limit = isPct ? 100 : c.maxScore;
                    const min = Math.max(0, Math.floor(Number(dataMin) - padding));
                    const max = Math.min(limit, Math.ceil(Number(dataMax) + padding));
                    return [min, max];
                  }}
                />
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ 
                    borderRadius: '10px', 
                    fontSize: '11px', 
                    padding: '8px', 
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                  itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
                  formatter={(val) => makeFormatter(displayMode)(Number(val))}
                />
              <Bar
                dataKey={c.id}
                name={(displayMode === 'percentage' || displayMode === 'tier') ? `${c.name} (%)` : `${c.name} (pt)`}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0] as [number, number, number, number]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      );
    })}
  </>
);

// --- 減点グラフ ---
interface AnalysisDeductionDistChartProps {
  activeT: TournamentConfig;
  subtotalBarData: Record<string, string | number>[];
  selectedPlayersCount: number;
  displayMode: 'points' | 'percentage' | 'tier';
}

export const AnalysisDeductionDistChart: React.FC<AnalysisDeductionDistChartProps> = ({
  activeT,
  subtotalBarData,
  selectedPlayersCount,
  displayMode,
}) => {
  const totalMax = activeT.criteria.reduce((s, c) => s + c.maxScore, 0);
  const { theme } = useUIStore();
  const isDark = theme === 'dark';

  return (
    <div className="card shadow-sm w-full animate-in border-danger/10 dark:border-danger/30">
      <h3 className="text-base font-bold text-danger dark:text-danger-light mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: DEDUCTION_COLOR }} />
        <span className="flex-1">{MESSAGES.ANALYSIS_DEDUCTION_LABEL}</span>
      </h3>
      <div className="w-full h-[320px]">
        <ResponsiveContainer>
          <BarChart
            data={subtotalBarData.map(d => ({
              ...d,
              deduction: displayMode === 'percentage'
                ? (totalMax > 0 ? (Number(d['deduction'] ?? 0) / totalMax) * 100 : 0)
                : Number(d['deduction'] ?? 0)
            }))}
            margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
            <XAxis dataKey="label" angle={-45} textAnchor="end" height={30} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: isDark ? '#94a3b8' : '#64748b' }} interval={0} stroke={isDark ? '#334155' : '#e2e8f0'} />
            <YAxis
              tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
              stroke={isDark ? '#334155' : '#e2e8f0'}
              unit={displayMode === 'percentage' ? '%' : ''}
              tickFormatter={(val) => val.toFixed(1)}
            />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }}
              contentStyle={{ 
                borderRadius: '10px', 
                fontSize: '11px', 
                padding: '8px', 
                border: isDark ? '1px solid #ef4444' : '1px solid #fca5a5',
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              itemStyle={{ color: isDark ? '#f8fafc' : '#0f172a' }}
              formatter={(val) => makeFormatter(displayMode)(Number(val))}
            />
            <Bar
              dataKey="deduction"
              name={(displayMode === 'percentage' || displayMode === 'tier') ? MESSAGES.ANALYSIS_DEDUCTION_PCT : MESSAGES.ANALYSIS_DEDUCTION_PT}
              fill={DEDUCTION_COLOR}
              radius={[4, 4, 0, 0] as [number, number, number, number]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
