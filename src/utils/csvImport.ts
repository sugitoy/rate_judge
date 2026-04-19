// src/utils/csvImport.ts
import Papa from 'papaparse';
import type { Criteria, Player, PlayerScore, TournamentConfig } from '../types';

/**
 * 構成情報CSVから大会設定と審査項目を抽出
 */
export const parseConfigCSV = (file: File): Promise<Partial<TournamentConfig>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data as string[][];
        let hasName = false;

        rows.forEach(row => {
          if (row.length >= 2 && row[0].trim() === '大会名') hasName = true;
        });

        if (!hasName) {
          reject(new Error('INVALID_CONFIG'));
          return;
        }

        const newCriteria: Criteria[] = [];
        const configData: Partial<TournamentConfig> = {};

        rows.forEach(row => {
          if (row.length >= 2) {
            const key = row[0].trim();
            const val = row[1].trim();
            if (key === '大会名') configData.name = val;
            else if (key === '部門') configData.division = val;
            else if (key === '入力単位') configData.inputUnit = Number(val) || 1;
            else if (key.startsWith('審査項目:')) {
              newCriteria.push({
                id: Date.now().toString() + Math.random(),
                name: key.replace('審査項目:', '').trim(),
                maxScore: Number(val) || 0
              });
            }
          }
        });

        if (newCriteria.length > 0) configData.criteria = newCriteria;
        resolve(configData);
      },
      error: (err) => reject(err),
    });
  });
};

/**
 * 選手情報CSVから選手リストを抽出
 */
export const parsePlayersCSV = (file: File): Promise<Player[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as string[][];

        if (rows.length === 0 || (rows.length === 1 && rows[0].length < 1)) {
          reject(new Error('INVALID_PLAYERS'));
          return;
        }

        const newPlayers: Player[] = [];
        let startIndex = 0;
        if (rows[0] && (rows[0][0].includes('氏名') || rows[0][0].includes('名前'))) {
          startIndex = 1;
        }

        for (let i = startIndex; i < rows.length; i++) {
          if (rows[i].length >= 1) {
            newPlayers.push({
              id: Date.now().toString() + Math.random(),
              name: rows[i][0]?.trim() || '',
              affiliation: rows[i][1]?.trim() || '',
              props: rows[i][2]?.trim() || '',
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
 * スコアCSVから採点情報を抽出
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
        
        const header = rows[0];
        const criteriaIndices = activeT.criteria.map(c => ({
          cId: c.id,
          idx: header.findIndex(h => h.trim() === c.name)
        })).filter(ci => ci.idx !== -1);

        const newScoresData: Record<string, PlayerScore> = {};

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const rawName = row[header.findIndex(h => h.includes('氏名')) || 1]?.trim();
          const pMatched = activeT.players.find(p => p.name === rawName);

          if (pMatched) {
            const pScoreData: Record<string, { criteriaId: string, absoluteScore: number }> = {};
            criteriaIndices.forEach(ci => {
              const val = Number(row[ci.idx]) || 0;
              pScoreData[ci.cId] = { criteriaId: ci.cId, absoluteScore: val };
            });
            const cmtIdx = header.findIndex(h => h.includes('コメント'));
            const cmt = cmtIdx !== -1 ? row[cmtIdx] : '';

            newScoresData[pMatched.id] = {
              playerId: pMatched.id,
              scores: pScoreData,
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
