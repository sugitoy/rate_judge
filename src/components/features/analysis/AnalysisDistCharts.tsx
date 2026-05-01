// src/components/features/analysis/AnalysisDistCharts.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig } from '../../../types';


const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];
const DEDUCTION_COLOR = '#ef4444';

interface AnalysisOverallDistChartProps {
  activeT: TournamentConfig;
  /** 小計グラフ用データ（審査項目の積み上げのみ、deductionなし） */
  subtotalBarData: Record<string, string | number>[];
  /** 合計グラフ用データ（減点のbaseValueオフセット付き）、減点無効時は空配列 */
  totalBarData: Record<string, string | number>[];
  displayMode: 'points' | 'percentage' | 'tier';
}

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

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#e2e8f0"
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
            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px' }}
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

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="label" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#e2e8f0"
            unit={(displayMode === 'percentage' || displayMode === 'tier') ? '%' : ''}
            tickFormatter={(val) => val.toFixed(1)}
            domain={[0, (displayMode === 'percentage' || displayMode === 'tier') ? 100 : totalMax]}
          />
          <Tooltip
            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '12px' }}
            formatter={(val) => makeFormatter(displayMode)(Number(val))}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '13px', fontWeight: 500 }}
          />
          <Bar
            dataKey="total"
            name={(displayMode === 'percentage' || displayMode === 'tier') ? '合計得点 (%)' : '合計得点 (pt)'}
            fill="#3b82f6"
            radius={[4, 4, 0, 0] as [number, number, number, number]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export const AnalysisOverallDistChart: React.FC<AnalysisOverallDistChartProps> = ({
  activeT,
  subtotalBarData,
  totalBarData,
  displayMode
}) => {
  const hasDeduction = activeT.hasDeduction ?? false;

  return (
    <div className="flex flex-col gap-6">
      {/* 小計グラフ */}
      <div className="card shadow-sm w-full animate-in">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
          <span>{hasDeduction ? '全体得点分布（小計）' : MESSAGES.ANALYSIS_TOTAL_DIST_TITLE}</span>
          <span className="text-[10px] font-normal text-slate-400 italic px-2 py-1 bg-slate-50 border border-slate-100 rounded">
            {MESSAGES.ANALYSIS_SORT_NOTE}
          </span>
        </h3>
        <SubtotalBarChart activeT={activeT} subtotalBarData={subtotalBarData} displayMode={displayMode} />
      </div>

      {/* 合計グラフ（減点有効時のみ） */}
      {hasDeduction && totalBarData.length > 0 && (
        <div className="card shadow-sm w-full animate-in border-danger/10">
          <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>全体得点分布（合計）</span>
            <span className="text-[10px] font-normal text-slate-400 italic px-2 py-1 bg-slate-50 border border-slate-100 rounded">
              {MESSAGES.ANALYSIS_SORT_NOTE}
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mb-5">バーの始点が −減点値、頂点が合計得点を示します</p>
          <TotalBarChart activeT={activeT} totalBarData={totalBarData} displayMode={displayMode} />
        </div>
      )}
    </div>
  );
};

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
  displayMode
}) => {
  const totalMax = activeT.criteria.reduce((s, c) => s + c.maxScore, 0);
  const hasDeduction = activeT.hasDeduction ?? false;

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
                data={subtotalBarData.map(d => {
                  if (displayMode === 'points') return d;
                  return {
                    ...d,
                    [c.id]: c.maxScore > 0 ? (Number(d[c.id]) / c.maxScore) * 100 : 0
                  };
                })}
                margin={{ top: 10, right: 10, left: -20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={50} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#e2e8f0"
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
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', padding: '8px', border: '1px solid #e2e8f0' }}
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
      ))}

      {/* 減点の個別グラフ（有効時のみ） */}
      {hasDeduction && (
        <div className="card shadow-sm w-full animate-in border-danger/10">
          <h3 className="text-base font-bold text-danger mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: DEDUCTION_COLOR }} />
            <span className="flex-1">減点</span>
          </h3>
          <div className="w-full h-[240px]">
            <ResponsiveContainer>
              <BarChart
                data={subtotalBarData.map(d => ({
                  ...d,
                  deduction: displayMode === 'percentage'
                    ? (totalMax > 0 ? (Number(d['deduction'] ?? 0) / totalMax) * 100 : 0)
                    : Number(d['deduction'] ?? 0)
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" angle={-45} textAnchor="end" height={50} tick={{ fontSize: Math.max(9, 12 - Math.floor(selectedPlayersCount / 5)), fill: '#64748b' }} interval={0} stroke="#e2e8f0" />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  stroke="#e2e8f0"
                  unit={displayMode === 'percentage' ? '%' : ''}
                  tickFormatter={(val) => val.toFixed(1)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(239, 68, 68, 0.05)' }}
                  contentStyle={{ borderRadius: '10px', fontSize: '11px', padding: '8px', border: '1px solid #fca5a5' }}
                  formatter={(val) => makeFormatter(displayMode)(Number(val))}
                />
                <Bar
                  dataKey="deduction"
                  name={(displayMode === 'percentage' || displayMode === 'tier') ? '減点 (%)' : '減点 (pt)'}
                  fill={DEDUCTION_COLOR}
                  radius={[4, 4, 0, 0] as [number, number, number, number]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};
