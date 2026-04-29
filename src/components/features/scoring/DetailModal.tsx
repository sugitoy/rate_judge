// src/components/features/scoring/DetailModal.tsx
import React, { useState } from 'react';
import { PenLine, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig, Player } from '../../../types';
import { ScoreCell } from './ScoreCell';
import { ToggleSwitch } from '../../ui/ToggleSwitch';

interface DetailModalProps {
  player: Player;
  activeT: TournamentConfig;
  scores: Record<string, number | undefined>;
  comment: string;
  inputMode: 'percentage' | 'points';
  toggleInputMode: (mode: 'percentage' | 'points') => void;
  onSaveScore: (criterionId: string, val: number) => void;
  onSaveComment: (val: string) => void;
  onClose: () => void;
  onPrevPlayer?: (currentComment: string) => void; // 追加
  onNextPlayer?: (currentComment: string) => void; // 追加
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  player,
  activeT,
  scores,
  comment,
  inputMode,
  toggleInputMode,
  onSaveScore,
  onSaveComment,
  onClose,
  onPrevPlayer,
  onNextPlayer,
  hasPrev,
  hasNext
}) => {
  const [valCmt, setValCmt] = useState(comment);

  // 選手が切り替わった際にコメントの状態を同期する
  React.useEffect(() => {
    setValCmt(comment);
  }, [player.id, comment]);

  return (
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-6 flex items-center shrink-0 gap-6">
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

          <h3 className="font-bold text-xl text-slate-900 truncate whitespace-nowrap min-w-0 flex-1">
            <span className="text-slate-400 font-medium mr-3 tabular-nums">No.{player.entryNumber}</span>
            {player.name}
          </h3>

          <div className="w-40 shrink-0">
            <ToggleSwitch
              small
              className="mb-0 bg-slate-50 border-slate-200"
              options={[
                { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
                { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS }
              ]}
              value={inputMode}
              onChange={(val) => toggleInputMode(val as 'percentage' | 'points')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-slate-50/40 overflow-y-auto max-h-[85vh] flex flex-col gap-8">
          {/* Score Input Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={20} className="text-primary" />
              <h4 className="font-bold text-slate-700 text-lg">スコア入力</h4>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              {activeT.criteria.map((c) => (
                <div key={c.id} className="flex justify-between items-center gap-6 py-2 border-b border-slate-50 last:border-0 lg:last:border-b lg:[&:nth-last-child(-n+2)]:border-0">
                  <span className="font-bold text-slate-700 whitespace-nowrap">
                    {c.name}
                    <span className="text-[10px] font-normal text-slate-400 ml-2">MAX {c.maxScore}pt</span>
                  </span>
                  <ScoreCell
                    criterion={c}
                    inputUnit={activeT.inputUnit}
                    mode={inputMode}
                    value={scores[c.id]}
                    onChange={(val) => onSaveScore(c.id, val)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Comment Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={20} className="text-primary" />
              <h4 className="font-bold text-slate-700 text-lg">コメント</h4>
            </div>
            <textarea
              className="form-input w-full p-4 h-64 text-sm rounded-xl border-slate-200 focus:border-primary focus:ring-primary/10 shadow-sm resize-none transition-all placeholder:text-slate-300 bg-white"
              placeholder={MESSAGES.SCORING_MODAL_DESC_PH}
              value={valCmt}
              onChange={(e) => {
                const newVal = e.target.value;
                setValCmt(newVal);
                onSaveComment(newVal);
              }}
            />
          </section>
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
