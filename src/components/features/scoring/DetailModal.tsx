// src/components/features/scoring/DetailModal.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig, Player } from '../../../types';
import { ScoreCell } from './ScoreCell';
import { DeductionCell } from './DeductionCell';
import { ToggleSwitch } from '../../ui/ToggleSwitch';

import { formatScore } from '../../../utils/scoreFormatter';

import { Select } from '../../ui/Select';

interface DetailModalProps {
  player: Player;
  players: Player[];
  activeT: TournamentConfig;
  scores: Record<string, number | undefined>;
  selectedTiers?: Record<string, string | undefined>;
  deduction: number;
  comment: string;
  rank?: number;
  total: number;
  inputMode: 'percentage' | 'points' | 'tier';
  toggleInputMode: (mode: 'percentage' | 'points' | 'tier') => void;
  onSaveScore: (criterionId: string, val: number) => void;
  onSaveTier: (criterionId: string, tier: string | undefined) => void;
  onSaveDeduction: (val: number) => void;
  onSaveComment: (val: string) => void;
  onClose: () => void;
  onPrevPlayer?: (currentComment: string) => void;
  onNextPlayer?: (currentComment: string) => void;
  onSelectPlayer?: (playerId: string, currentComment: string) => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  player,
  players,
  activeT,
  scores,
  selectedTiers,
  deduction,
  comment,
  rank,
  total,
  inputMode,
  toggleInputMode,
  onSaveScore,
  onSaveTier,
  onSaveDeduction,
  onSaveComment,
  onClose,
  onPrevPlayer,
  onNextPlayer,
  onSelectPlayer,
  hasPrev,
  hasNext
}) => {
  const [valCmt, setValCmt] = useState(comment);

  // 選手が切り替わった際にコメントの状態を同期する
  React.useEffect(() => {
    setValCmt(comment);
  }, [player.id, comment]);

  const hasDeduction = activeT.hasDeduction ?? false;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-6 flex items-center shrink-0 gap-8">
          {/* Nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrevPlayer?.(valCmt)}
              disabled={!hasPrev}
              className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-slate-600"
              title="前の選手"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onNextPlayer?.(valCmt)}
              disabled={!hasNext}
              className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-slate-600"
              title="次の選手"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Player Info (Dropdown) & Result */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
              <Select
                value={player.id}
                onChange={(val) => onSelectPlayer?.(val, valCmt)}
                options={players.map(p => ({
                  value: p.id,
                  label: `No.${p.entryNumber} ${p.name}`
                }))}
                className="w-full max-w-md [&>button]:border-none [&>button]:hover:bg-slate-50 [&>button]:px-0 [&>button]:text-2xl [&>button]:font-bold [&>button]:shadow-none [&>button]:rounded-none"
              />
              <div className="flex items-center gap-4 text-xs font-bold mt-1">
                {hasDeduction && deduction > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-danger-bg/20 text-danger rounded">
                    <span className="text-[10px] text-danger/50 uppercase tracking-wider">減点</span>
                    <span className="tabular-nums">-{formatScore(deduction)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SCORE</span>
                <div className="text-3xl font-black text-primary tabular-nums leading-none">
                  {formatScore(total)}
                </div>
              </div>
              {rank && rank > 0 && (
                <div className={`px-4 py-1 rounded-lg text-lg font-black shadow-sm border ${
                  rank === 1 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  rank === 2 ? 'bg-slate-50 text-slate-600 border-slate-200' :
                  rank === 3 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {rank}<span className="text-xs ml-0.5">{MESSAGES.ANALYSIS_RANK_SUFFIX}</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-40 shrink-0 border-l border-slate-100 pl-8">
            <ToggleSwitch
              small
              className="mb-0 bg-slate-50 border-slate-200"
              options={[
                { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS },
                { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
                { value: 'tier', label: MESSAGES.SCORING_TOGGLE_TIER }
              ]}
              value={inputMode}
              onChange={(val) => toggleInputMode(val as 'percentage' | 'points' | 'tier')}
            />
          </div>
        </div>

        {/* Content - 2 Column Layout (Equal Width) */}
        <div className="bg-slate-50/40 overflow-y-auto max-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column: Score Input (1/2 width) */}
          <div className="p-8 border-r border-slate-100">
            <div className="space-y-4">
              {activeT.criteria.map((c) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <div className="font-bold text-slate-700 text-sm leading-tight mb-0.5">
                      {c.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MAX {c.maxScore}pt</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <ScoreCell
                      criterion={c}
                      inputUnit={activeT.inputUnit}
                      mode={inputMode}
                      value={scores[c.id]}
                      selectedTier={selectedTiers?.[c.id]}
                      variant="detailed"
                      onChange={(val) => onSaveScore(c.id, val)}
                      onTierChange={(tier) => onSaveTier(c.id, tier)}
                    />
                  </div>
                </div>
              ))}

              {/* 減点入力行（有効時のみ） */}
              {hasDeduction && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4 flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <div className="font-bold text-danger text-sm leading-tight mb-0.5">
                      {MESSAGES.SCORING_TABLE_HEAD_DEDUCTION}
                    </div>
                    <div className="text-[10px] font-bold text-danger/50 uppercase tracking-wider">絶対値入力</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <DeductionCell
                      value={deduction}
                      showMinus={false}
                      variant="detailed"
                      onChange={onSaveDeduction}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Comment (1/2 width) */}
          <div className="p-8 bg-white/50">
            <textarea
              className="form-input w-full p-4 h-full text-sm rounded-xl border-slate-200 focus:border-primary focus:ring-primary/10 shadow-sm resize-none transition-all placeholder:text-slate-300 bg-white"
              placeholder={MESSAGES.SCORING_MODAL_DESC_PH}
              value={valCmt}
              onChange={(e) => {
                const newVal = e.target.value;
                setValCmt(newVal);
                onSaveComment(newVal);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end shrink-0">
          <button 
            onClick={onClose} 
            className="btn bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300 px-12 shadow-sm"
          >
            {MESSAGES.CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
};
