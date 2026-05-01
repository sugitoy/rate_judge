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
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-950 rounded-2xl max-w-5xl w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-cyan-500/30 animate-in zoom-in-95 duration-200 dark:shadow-[0_0_50px_-10px_rgba(6,182,212,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-6 flex items-center shrink-0 gap-8">
          {/* Nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrevPlayer?.(valCmt)}
              disabled={!hasPrev}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-400"
              title={MESSAGES.SCORING_PREV_PLAYER}
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onNextPlayer?.(valCmt)}
              disabled={!hasNext}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-slate-400"
              title={MESSAGES.SCORING_NEXT_PLAYER}
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Player Info (Dropdown) & Result */}
          <div className="flex-1 min-w-0 flex items-center justify-between gap-6">
            <div className="min-w-0 flex-1 flex flex-col">
              <Select
                value={player.id}
                onChange={(val) => onSelectPlayer?.(val, valCmt)}
                options={players.map(p => ({
                  value: p.id,
                  label: `No.${p.entryNumber} ${p.name}`
                }))}
                className="w-full max-w-md [&>button]:border-slate-200 dark:[&>button]:border-slate-700 [&>button]:hover:border-cyan-500 [&>button]:hover:bg-slate-50/80 dark:[&>button]:hover:bg-slate-800/80 [&>button]:px-4 [&>button]:py-2 [&>button]:text-2xl [&>button]:font-bold [&>button]:shadow-sm [&>button]:rounded-xl [&>button]:transition-all [&>button>svg]:w-5 [&>button>svg]:h-5 [&>button>svg]:text-primary dark:[&>button>svg]:text-cyan-400 [&>button>svg]:opacity-100 dark:[&>button]:bg-slate-950 dark:[&>button]:text-white dark:[&>button]:shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
              />
              <div className="flex items-center gap-4 text-xs font-bold mt-1">
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest">SCORE</span>
                <div className="text-3xl font-black text-primary dark:text-cyan-400 tabular-nums leading-none">
                  {formatScore(total)}
                </div>
              </div>
              {rank && rank > 0 && (
                <div className={`px-4 py-1 rounded-lg text-lg font-black shadow-sm border transition-all ${
                  rank === 1 ? 'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/60 dark:shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                  rank === 2 ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-100 border-slate-200 dark:border-slate-500 dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]' :
                  rank === 3 ? 'bg-orange-50 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/60 dark:shadow-[0_0_20px_rgba(249,115,22,0.3)]' :
                  'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  {rank}<span className="text-xs ml-0.5">{MESSAGES.ANALYSIS_RANK_SUFFIX}</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-40 shrink-0 border-l border-slate-100 pl-8">
            <ToggleSwitch
              small
              className="mb-0 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
        <div className="bg-slate-50/40 dark:bg-slate-950/40 overflow-y-auto max-h-[85vh] grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Column: Score Input (1/2 width) */}
          <div className="p-8 border-r border-slate-100 dark:border-slate-700">
            <div className="space-y-4">
              {activeT.criteria.map((c) => (
                <div key={c.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md dark:hover:border-cyan-500 dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center gap-4 group">
                  <div className="w-24 shrink-0">
                    <div className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-tight mb-0.5">
                      {c.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">MAX {c.maxScore}pt</div>
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
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-4 flex items-center gap-4 transition-all hover:border-rose-500/50">
                  <div className="w-24 shrink-0">
                    <div className="font-bold text-danger dark:text-danger-light text-sm leading-tight mb-0.5">
                      {MESSAGES.SCORING_TABLE_HEAD_DEDUCTION}
                    </div>
                    <div className="text-[10px] font-bold text-danger/50 dark:text-danger/40 uppercase tracking-wider">{MESSAGES.SCORING_ABS_INPUT}</div>
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
          <div className="p-8 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-2">
            <textarea
              className={`form-input w-full p-4 h-full text-sm rounded-xl border-slate-200 dark:border-slate-700 focus:border-primary dark:focus:border-cyan-500 focus:ring-primary/10 dark:focus:ring-cyan-500/20 shadow-sm resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-white dark:bg-slate-950 dark:text-white ${
                valCmt.length > 1000 ? 'border-danger ring-danger/10' : ''
              }`}
              placeholder={MESSAGES.SCORING_MODAL_DESC_PH}
              value={valCmt}
              onChange={(e) => {
                const newVal = e.target.value;
                if (newVal.length <= 1000 || newVal.length < valCmt.length) {
                  setValCmt(newVal);
                  onSaveComment(newVal);
                }
              }}
            />
            <div className="flex justify-between items-center px-1">
              {valCmt.length > 1000 ? (
                <p className="text-[10px] text-danger font-bold uppercase">{MESSAGES.SCORING_ERR_COMMENT_LENGTH}</p>
              ) : (
                <div />
              )}
              <span className={`text-[10px] font-bold ${valCmt.length > 900 ? 'text-danger dark:text-danger-light' : 'text-slate-400 dark:text-slate-500'}`}>
                {valCmt.length} / 1000
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end shrink-0 gap-3">
          <button 
            onClick={onClose} 
            className="btn btn-outline py-2.5 px-10"
          >
            {MESSAGES.CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
};
