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
    <div className="modal-overlay z-50">
      <div className="modal-content max-w-2xl w-full mx-4 rounded-xl shadow-2xl p-0 overflow-hidden border border-gray-200">
        <div className="bg-white border-b border-gray-200 p-5 flex justify-between items-center z-10 relative">
          <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            {player.name}{MESSAGES.SCORING_MODAL_TITLE_SUFFIX}
          </h3>

          <ToggleSwitch
            className="mb-0 bg-gray-100"
            options={[
              { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
              { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS }
            ]}
            value={inputMode}
            onChange={(val) => toggleInputMode(val as 'percentage' | 'points')}
          />
        </div>

        <div className="p-6 bg-gray-50/80 overflow-y-auto max-h-[60vh]">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <PenLine size={20} className="text-blue-500" />
              <h4 className="font-bold text-gray-700 text-lg">スコア入力</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              {activeT.criteria.map((c) => (
                <div key={c.id} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0 pt-1">
                  <span className="font-medium text-gray-700">{c.name} <span className="text-xs font-normal text-gray-400">({c.maxScore}pt)</span></span>
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
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={20} className="text-blue-500" />
              <h4 className="font-bold text-gray-700 text-lg">コメント</h4>
            </div>
            <textarea
              className="form-input w-full p-4 h-32 text-sm rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm resize-none transition-shadow"
              placeholder={MESSAGES.SCORING_MODAL_DESC_PH}
              value={valCmt}
              onChange={(e) => setValCmt(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl z-10 relative">
          <button onClick={onClose} className="btn btn-outline px-6 bg-white hover:bg-gray-50">{MESSAGES.CLOSE}</button>
          <button onClick={() => { onSaveComment(valCmt); onClose(); }} className="btn btn-primary px-8 shadow-sm">{MESSAGES.SAVE}</button>
        </div>
      </div>
    </div>
  );
};
