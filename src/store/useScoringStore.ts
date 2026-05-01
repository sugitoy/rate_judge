// src/store/useScoringStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerScore } from '../types';

export interface ScoringState {
  tournamentScores: Record<string, Record<string, PlayerScore>>;
  updateScore: (tournamentId: string, playerId: string, criteriaId: string, absoluteScore: number) => void;
  updateDeduction: (tournamentId: string, playerId: string, deduction: number) => void;
  updateComment: (tournamentId: string, playerId: string, comment: string) => void;
  importScores: (tournamentId: string, scores: Record<string, PlayerScore>) => void;
  deleteTournamentScores: (tournamentId: string) => void;
  clearAllScores: () => void;
}

export const useScoringStore = create<ScoringState>()(
  persist(
    (set) => ({
      tournamentScores: {},

      updateScore: (tournamentId, playerId, criteriaId, absoluteScore) =>
        set((state) => {
          const tScores = state.tournamentScores[tournamentId] || {};
          const pScore = tScores[playerId] || { playerId, scores: {}, comment: '' };

          return {
            tournamentScores: {
              ...state.tournamentScores,
              [tournamentId]: {
                ...tScores,
                [playerId]: {
                  ...pScore,
                  scores: {
                    ...pScore.scores,
                    [criteriaId]: absoluteScore,
                  },
                },
              },
            },
          };
        }),

      updateDeduction: (tournamentId, playerId, deduction) =>
        set((state) => {
          const tScores = state.tournamentScores[tournamentId] || {};
          const pScore = tScores[playerId] || { playerId, scores: {}, comment: '' };

          return {
            tournamentScores: {
              ...state.tournamentScores,
              [tournamentId]: {
                ...tScores,
                [playerId]: {
                  ...pScore,
                  deduction,
                },
              },
            },
          };
        }),

      updateComment: (tournamentId, playerId, comment) =>
        set((state) => {
          const tScores = state.tournamentScores[tournamentId] || {};
          const pScore = tScores[playerId] || { playerId, scores: {}, comment: '' };

          return {
            tournamentScores: {
              ...state.tournamentScores,
              [tournamentId]: {
                ...tScores,
                [playerId]: {
                  ...pScore,
                  comment,
                },
              },
            },
          };
        }),

      importScores: (tournamentId, scores) =>
        set((state) => ({
          tournamentScores: {
            ...state.tournamentScores,
            [tournamentId]: {
              ...(state.tournamentScores[tournamentId] || {}),
              ...scores,
            },
          },
        })),

      deleteTournamentScores: (tournamentId) =>
        set((state) => {
          const newScores = { ...state.tournamentScores };
          delete newScores[tournamentId];
          return { tournamentScores: newScores };
        }),

      clearAllScores: () => set({ tournamentScores: {} }),
    }),
    {
      name: 'scoring-storage',
      version: 2,
    }
  )
);
