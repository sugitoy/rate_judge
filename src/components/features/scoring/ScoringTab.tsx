// src/components/features/scoring/ScoringTab.tsx
import React, { useState } from 'react';
import { Download, Upload, Trophy, Medal, FileText } from 'lucide-react';
import { MESSAGES } from '../../../constants/messages';
import { useTournamentStore } from '../../../store/useTournamentStore';
import { useScoringStore } from '../../../store/useScoringStore';
import { useScoringData } from '../../../hooks/useScoringData';
import { exportScoringToCSV } from '../../../utils/csvExport';
import { parseScoresCSV } from '../../../utils/csvImport';
import { ScoreCell } from './ScoreCell';
import { DetailModal } from './DetailModal';
import { ToggleSwitch } from '../../ui/ToggleSwitch';

export const ScoringTab = () => {
  const { tournaments, activeTournamentId } = useTournamentStore();
  const { tournamentScores, updateScore, updateComment, importScores } = useScoringStore();

  const [inputMode, setInputMode] = useState<'percentage' | 'points'>('points');
  const [commentModalData, setCommentModalData] = useState<{ playerId: string } | null>(null);

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;
  const currentScores = activeTournamentId ? tournamentScores[activeTournamentId] || {} : {};

  const { tableData } = useScoringData(activeT, currentScores);

  if (!activeT || activeT.players.length === 0 || activeT.criteria.length === 0) {
    return (
      <div className="card text-center p-10 mt-6">
        <p className="text-gray-500 mb-4">{MESSAGES.NO_DATA}</p>
      </div>
    );
  }

  const handleExportCSV = () => {
    exportScoringToCSV(activeT.name, activeT.criteria, tableData);
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const newScoresData = await parseScoresCSV(file, activeT);
      if (Object.keys(newScoresData).length > 0) {
        importScores(activeT.id, newScoresData);
        alert(MESSAGES.SCORING_IMPORT_SUCCESS);
      } else {
        alert(MESSAGES.SCORING_IMPORT_ERR);
      }
    } catch {
      alert(MESSAGES.SCORING_IMPORT_ERR);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-xl font-bold">{MESSAGES.SCORING_TITLE}</h2>
          <div className="flex items-center gap-3 mt-2 pr-4 pl-0 py-1">
            <span className="text-sm font-medium text-gray-500">{MESSAGES.SCORING_TOGGLE_MODE}:</span>
            <ToggleSwitch
              options={[
                { value: 'percentage', label: MESSAGES.SCORING_TOGGLE_PCT },
                { value: 'points', label: MESSAGES.SCORING_TOGGLE_ABS }
              ]}
              value={inputMode}
              onChange={(val) => setInputMode(val as 'percentage' | 'points')}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <label className="btn btn-outline flex items-center gap-1 cursor-pointer mb-0">
            <Upload size={16} /> {MESSAGES.CSV_IMPORT_SCORES}
            <input type="file" accept=".csv" onChange={handleImportCSV} style={{ display: 'none' }} />
          </label>
          <button onClick={handleExportCSV} className="btn btn-primary flex items-center gap-1">
            <Download size={16} /> {MESSAGES.CSV_EXPORT_SCORES}
          </button>
        </div>
      </div>

      <div className="card w-full overflow-x-auto shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="p-3 w-10 text-center font-bold text-gray-400 sticky left-0 z-10 bg-gray-100 border-r">{MESSAGES.CONFIG_PLAYER_TH_NO}</th>
              <th className="p-3 text-left font-bold text-gray-600 sticky left-10 z-10 bg-gray-100 shadow-[1px_0_0_#e5e7eb] whitespace-nowrap min-w-[200px]">{MESSAGES.SCORING_TH_PLAYER}</th>

              {activeT.criteria.map(c => (
                <th key={c.id} className="p-3 text-center border-l border-gray-200 min-w-[140px]">
                  <div className="font-bold text-gray-800">{c.name}</div>
                  <div className="text-[11px] text-gray-500 font-normal">満点: {c.maxScore} (単位: {activeT.inputUnit})</div>
                </th>
              ))}
              <th className="p-3 text-center border-l bg-blue-50 text-blue-900 border-blue-200">{MESSAGES.SCORING_TABLE_HEAD_TOTAL}</th>
              <th className="p-3 text-center bg-blue-50 text-blue-900">{MESSAGES.SCORING_TABLE_HEAD_RANK}</th>
              <th className="p-3 text-center border-l border-gray-200">{MESSAGES.SCORING_TABLE_DETAIL_BTN}</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.player.id} className="border-b border-gray-200 hover:bg-yellow-50 relative group">
                <td className="p-3 text-center font-bold text-gray-400 sticky left-0 z-10 bg-white group-hover:bg-yellow-50 border-r">{row.entryNo}</td>
                <td className="p-3 sticky left-10 z-10 bg-white group-hover:bg-yellow-50 shadow-[1px_0_0_#e5e7eb] align-middle">
                  <div className="font-bold text-gray-800 tabular-nums">{row.player.name}</div>
                  {(row.player.affiliation || row.player.props) && (
                    <div className="text-[10px] text-gray-400 opacity-70 mt-0.5 truncate max-w-[180px]">
                      {row.player.affiliation} / {row.player.props}
                    </div>
                  )}
                </td>

                {activeT.criteria.map(c => (
                  <td key={c.id} className="p-2 border-l border-gray-100 align-middle relative">
                    <ScoreCell
                      criterion={c}
                      inputUnit={activeT.inputUnit}
                      mode={inputMode}
                      value={row.scores[c.id]?.absoluteScore}
                      onChange={(val) => updateScore(activeT.id, row.player.id, c.id, val)}
                    />
                  </td>
                ))}

                <td className="p-3 text-center border-l align-middle bg-blue-50/30">
                  <div className="font-bold text-xl text-blue-700 tabular-nums">{row.total}<span className="text-sm text-blue-500 font-normal ml-1">pt</span></div>
                </td>
                <td className="p-3 text-center align-middle bg-blue-50/30">
                  {(() => {
                    const r = row.rank;
                    if (r === 1) return <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-400 rounded-full font-bold text-yellow-700 shadow-sm text-sm"><Trophy size={16} className="text-yellow-500" /> {r}{MESSAGES.DASHBOARD_RANK_SUFFIX}</div>;
                    if (r === 2) return <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded-full font-bold text-slate-700 shadow-sm text-sm"><Medal size={16} className="text-slate-500" /> {r}{MESSAGES.DASHBOARD_RANK_SUFFIX}</div>;
                    if (r === 3) return <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-300 rounded-full font-bold text-orange-800 shadow-sm text-sm"><Medal size={16} className="text-orange-500" /> {r}{MESSAGES.DASHBOARD_RANK_SUFFIX}</div>;
                    return <div className="inline-block px-3 py-1 bg-white border border-blue-200 rounded-full font-bold text-gray-600 shadow-sm text-sm">{r}{MESSAGES.DASHBOARD_RANK_SUFFIX}</div>;
                  })()}
                </td>
                <td className="p-3 text-center border-l align-middle">
                  <button
                    onClick={() => setCommentModalData({ playerId: row.player.id })}
                    className={`p-2 rounded-lg transition-all flex items-center justify-center mx-auto border outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 ${
                      row.comment
                        ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-sm'
                        : 'bg-white text-gray-400 border-gray-200 hover:text-blue-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    title="詳細・コメント"
                  >
                    <FileText size={18} strokeWidth={2} className={row.comment ? 'fill-blue-100' : ''} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {commentModalData && (() => {
        const rowData = tableData.find(d => d.player.id === commentModalData.playerId);
        if (!rowData) return null;
        return (
          <DetailModal
            player={rowData.player}
            activeT={activeT}
            scores={rowData.scores}
            comment={rowData.comment}
            inputMode={inputMode}
            toggleInputMode={(mode) => setInputMode(mode)}
            onSaveScore={(cId, val) => updateScore(activeT.id, rowData.player.id, cId, val)}
            onSaveComment={(cmt) => updateComment(activeT.id, rowData.player.id, cmt)}
            onClose={() => setCommentModalData(null)}
          />
        );
      })()}
    </div>
  );
};
