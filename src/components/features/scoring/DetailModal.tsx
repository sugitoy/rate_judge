// src/components/features/scoring/DetailModal.tsx
import React, { useState } from 'react';
import { PenLine, MessageSquare } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import type { TournamentConfig, Player } from '../../../types';
import { ScoreCell } from './ScoreCell';
import { ToggleSwitch } from '../../ui/ToggleSwitch';

interface DetailModalProps {
  player: Player;
  activeT: TournamentConfig;
  scores: Record<string, { absoluteScore: number }>;
  comment: string;
  inputMode: 'percentage' | 'points';
  toggleInputMode: (mode: 'percentage' | 'points') => void;
  onSaveScore: (cId: string, val: number) => void;
  onSaveComment: (val: string) => void;
  onClose: () => void;
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
  onClose
}) => {
  const [valCmt, setValCmt] = useState(comment);

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
            {player.name}{MESSAGES.SCORING_MODAL_TITLE_SUFFIX}
          </h3>

          <ToggleSwitch
            className="mb-0 bg-slate-50 border-slate-200"
            options={[
              { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
              { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS }
            ]}
            value={inputMode}
            onChange={(val) => toggleInputMode(val as 'percentage' | 'points')}
          />
        </div>

        {/* Content */}
        <div className="p-8 bg-slate-50/40 overflow-y-auto max-h-[70vh] flex flex-col gap-8">
          {/* Score Input Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={20} className="text-primary" />
              <h4 className="font-bold text-slate-700 text-lg">スコア入力</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              {activeT.criteria.map((c) => (
                <div key={c.id} className="flex justify-between items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                  <span className="font-medium text-slate-700">
                    {c.name} <span className="text-[10px] font-normal text-slate-400 block">MAX {c.maxScore}pt</span>
                  </span>
                  <ScoreCell
                    criterion={c}
                    inputUnit={activeT.inputUnit}
                    mode={inputMode}
                    value={scores[c.id]?.absoluteScore}
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
              className="form-input w-full p-4 h-36 text-sm rounded-xl border-slate-200 focus:border-primary focus:ring-primary/10 shadow-sm resize-none transition-all placeholder:text-slate-300 bg-white"
              placeholder={MESSAGES.SCORING_MODAL_DESC_PH}
              value={valCmt}
              onChange={(e) => setValCmt(e.target.value)}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="btn bg-white border-slate-200 text-slate-600 hover:bg-slate-100 px-6"
          >
            {MESSAGES.CLOSE}
          </button>
          <button 
            onClick={() => { onSaveComment(valCmt); onClose(); }} 
            className="btn btn-primary px-10 shadow-md shadow-primary/20"
          >
            {MESSAGES.SAVE}
          </button>
        </div>
      </div>
    </div>
  );
};
