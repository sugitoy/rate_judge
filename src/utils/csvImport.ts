// src/utils/csvImport.ts
import Papa from 'papaparse';
import type { Criteria, Player, PlayerScore, TournamentConfig } from '../types';
import { MESSAGES } from '../constants/messages';
import { getClosestTier } from '../constants/tiers';

/**
 * 構成情報CSVから大会設定と審査項目を抽出 (横持ち形式対応)
 */
export const parseConfigCSV = (file: File): Promise<Partial<TournamentConfig>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];
        if (rows.length < 2) {
          reject(new Error('INVALID_CONFIG'));
          return;
        }

        const header = rows[0].map(h => h.trim());
        const data = rows[1].map(d => d.trim());
        
        const configData: Partial<TournamentConfig> = {};
        const newCriteria: Criteria[] = [];

        header.forEach((h, idx) => {
          const val = data[idx];
          if (!val) return;

          if (h === MESSAGES.CSV_HEADER_T_NAME) configData.name = val;
          else if (h === MESSAGES.CSV_HEADER_T_DIV) configData.division = val;
          else if (h === MESSAGES.CSV_HEADER_T_UNIT) configData.inputUnit = Number(val) || 1;
          else if (h.startsWith(MESSAGES.CSV_HEADER_CRITERIA_PREFIX)) {
            newCriteria.push({
              id: crypto.randomUUID(),
              name: h.replace(MESSAGES.CSV_HEADER_CRITERIA_PREFIX, '').trim(),
              maxScore: Number(val) || 0
            });
          }
        });

        if (!configData.name) {
          reject(new Error('INVALID_CONFIG'));
          return;
        }

        if (newCriteria.length > 0) configData.criteria = newCriteria;
        resolve(configData);
      },
      error: (err) => reject(err),
    });
  });
};

/**
 * 選手情報CSVから選手リストを抽出 (entryNumberを自動付与)
 */
export const parsePlayersCSV = (file: File): Promise<Player[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];

        if (rows.length === 0) {
          reject(new Error('INVALID_PLAYERS'));
          return;
        }

        const newPlayers: Player[] = [];
        const header = rows[0].map(h => h.trim());
        const nameIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_P_NAME);
        const affilIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_P_AFFIL);
        const propIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_P_PROP);
        const disqIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_P_DISQ);

        let startIndex = 0;
        if (nameIdx !== -1) {
          startIndex = 1;
        }

        for (let i = startIndex; i < rows.length; i++) {
          const row = rows[i];
          const nameVal = nameIdx !== -1 ? row[nameIdx]?.trim() : row[0]?.trim();
          if (nameVal) {
            const isDisqualified = disqIdx !== -1 
              ? (row[disqIdx]?.trim() === '1' || row[disqIdx]?.toLowerCase() === 'true' || row[disqIdx]?.toLowerCase() === 't')
              : false;

            newPlayers.push({
              id: crypto.randomUUID(),
              entryNumber: newPlayers.length + 1,
              name: nameVal,
              affiliation: affilIdx !== -1 ? row[affilIdx]?.trim() : row[1]?.trim() || '',
              props: propIdx !== -1 ? row[propIdx]?.trim() : row[2]?.trim() || '',
              isDisqualified
            });
          }
        }

        resolve(newPlayers);
      },
      error: (err) => reject(err),
    });
  });
};

/**
 * スコアCSVから採点情報を抽出 (エントリーNoで紐付け、簡易スコア形式)
 */
export const parseScoresCSV = (file: File, activeT: TournamentConfig): Promise<Record<string, PlayerScore>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];
        if (rows.length < 2) {
          reject(new Error('INVALID_SCORES'));
          return;
        }
        
        const header = rows[0].map(h => h.trim());
        const entryNoIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_S_ENTRY);
        
        const criteriaIndices = activeT.criteria.map(c => ({
          cId: c.id,
          idx: header.findIndex(h => h === c.name)
        })).filter(ci => ci.idx !== -1);

        const deductionIdx = header.findIndex(h => h === MESSAGES.ANALYSIS_DEDUCTION_LABEL);
        const commentIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_S_COMMENT);
        const newScoresData: Record<string, PlayerScore> = {};

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          let pMatched: Player | undefined;

          // 1. エントリーNoで検索
          if (entryNoIdx !== -1) {
            const entryNo = Number(row[entryNoIdx]);
            pMatched = activeT.players.find(p => p.entryNumber === entryNo);
          }
          
          // 2. 名前でバックアップ検索 (エントリーNoで見つからない場合)
          if (!pMatched) {
            const nameIdx = header.findIndex(h => h === MESSAGES.CSV_HEADER_P_NAME);
            if (nameIdx !== -1) {
              const rawName = row[nameIdx]?.trim();
              pMatched = activeT.players.find(p => p.name === rawName);
            }
          }

          if (pMatched) {
            const pScoreData: Record<string, number> = {};
            const pSelectedTiers: Record<string, string> = {};
            
            criteriaIndices.forEach(ci => {
              const val = Number(row[ci.idx]);
              if (!isNaN(val)) {
                pScoreData[ci.cId] = val;
                
                // スコアから最も近いTierを自動算出
                const crit = activeT.criteria.find(c => c.id === ci.cId);
                if (crit && crit.maxScore > 0) {
                  const pct = (val / crit.maxScore) * 100;
                  pSelectedTiers[ci.cId] = getClosestTier(pct).id;
                }
              }
            });
            
            const cmt = commentIdx !== -1 ? row[commentIdx]?.trim() : '';
            const deductionVal = deductionIdx !== -1 ? Number(row[deductionIdx]) : undefined;

            newScoresData[pMatched.id] = {
              playerId: pMatched.id,
              scores: pScoreData,
              selectedTiers: pSelectedTiers,
              ...(deductionVal !== undefined && !isNaN(deductionVal) ? { deduction: deductionVal } : {}),
              comment: cmt
            };
          }
        }

        resolve(newScoresData);
      },
      error: (err) => reject(err),
    });
  });
};
