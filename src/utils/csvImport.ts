// src/utils/csvImport.ts
import Papa from 'papaparse';
import type { Criteria, Player, PlayerScore, TournamentConfig } from '../types';
import { MESSAGES } from '../constants/messages';
import { getClosestTier } from '../constants/tiers';
import { roundToUnit, clamp } from './scoreFormatter';

/**
 * 構成情報CSVから大会設定と審査項目を抽出 (横持ち形式対応)
 */
export const parseConfigCSV = (file: File): Promise<Partial<TournamentConfig>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
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

          if (h === MESSAGES.CSV_HEADER_T_NAME) {
            configData.name = val.substring(0, 100);
          } else if (h === MESSAGES.CSV_HEADER_T_DIV) {
            configData.division = val.substring(0, 50);
          } else if (h === MESSAGES.CSV_HEADER_T_UNIT) {
            const unit = Number(val);
            configData.inputUnit = [1, 0.5, 0.1].includes(unit) ? unit : 0.1;
          } else if (h.startsWith(MESSAGES.CSV_HEADER_CRITERIA_PREFIX)) {
            const cName = h.replace(MESSAGES.CSV_HEADER_CRITERIA_PREFIX, '').trim().substring(0, 50);
            const mScore = Number(val);
            if (cName && !isNaN(mScore)) {
              newCriteria.push({
                id: crypto.randomUUID(),
                name: cName,
                maxScore: Math.min(1000, Math.max(0.1, mScore))
              });
            }
          }
        });

        if (!configData.name) {
          reject(new Error('INVALID_CONFIG'));
          return;
        }

        // 審査項目名の重複排除
        const seenNames = new Set<string>();
        configData.criteria = newCriteria.filter(c => {
          if (seenNames.has(c.name)) return false;
          seenNames.add(c.name);
          return true;
        });
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
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
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
        // 「氏名」が完全一致するか、または1行目のいずれかの列にヘッダー特有のキーワードが含まれる場合にヘッダーとみなす
        const looksLikeHeader = nameIdx !== -1 || header.some(h => 
          ['氏名', '名前', '選手', '所属', 'チーム', '道具', '使用道具', '道具名', '失格'].some(k => h.includes(k))
        );

        if (looksLikeHeader) {
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
              name: nameVal.substring(0, 100),
              affiliation: (affilIdx !== -1 ? row[affilIdx]?.trim() : row[1]?.trim() || '').substring(0, 100),
              props: (propIdx !== -1 ? row[propIdx]?.trim() : row[2]?.trim() || '').substring(0, 100),
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
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }
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
                // スコアの丸めと範囲制限
                const crit = activeT.criteria.find(c => c.id === ci.cId);
                const correctedVal = crit 
                  ? clamp(roundToUnit(val, activeT.inputUnit), 0, crit.maxScore)
                  : val;
                
                pScoreData[ci.cId] = correctedVal;
                
                // スコアから最も近いTierを自動算出
                if (crit && crit.maxScore > 0) {
                  const pct = (correctedVal / crit.maxScore) * 100;
                  pSelectedTiers[ci.cId] = getClosestTier(pct).id;
                }
              }
            });
            
            const cmt = commentIdx !== -1 ? row[commentIdx]?.trim() : '';
            const rawDeduction = deductionIdx !== -1 ? Number(row[deductionIdx]) : undefined;
            const deductionVal = rawDeduction !== undefined && !isNaN(rawDeduction)
              ? clamp(roundToUnit(rawDeduction, 0.1), 0, 1000) // 減点は0.1単位、0〜1000程度に制限
              : undefined;

            newScoresData[pMatched.id] = {
              playerId: pMatched.id,
              scores: pScoreData,
              selectedTiers: pSelectedTiers,
              ...(deductionVal !== undefined ? { deduction: deductionVal } : {}),
              comment: cmt.substring(0, 1000)
            };
          }
        }

        resolve(newScoresData);
      },
      error: (err) => reject(err),
    });
  });
};
