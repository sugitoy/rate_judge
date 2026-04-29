// src/store/useTournamentStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TournamentConfig } from '../types';

export interface TournamentState {
  tournaments: Record<string, TournamentConfig>;
  activeTournamentId: string | null;
  addTournament: (config: TournamentConfig) => void;
  updateTournament: (id: string, config: Partial<TournamentConfig>) => void;
  deleteTournament: (id: string) => void;
  setActiveTournament: (id: string) => void;
  clearTournaments: () => void;
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set) => ({
      tournaments: {},
      activeTournamentId: null,

      addTournament: (config) =>
        set((state) => ({
          tournaments: { ...state.tournaments, [config.id]: config },
          activeTournamentId: config.id,
        })),

      updateTournament: (id, config) =>
        set((state) => ({
          tournaments: {
            ...state.tournaments,
            [id]: { ...state.tournaments[id], ...config },
          },
        })),

      deleteTournament: (id) =>
        set((state) => {
          const newTournaments = { ...state.tournaments };
          delete newTournaments[id];
          
          let nextActive = state.activeTournamentId;
          if (nextActive === id) {
            const remainingKeys = Object.keys(newTournaments);
            nextActive = remainingKeys.length > 0 ? remainingKeys[0] : null;
          }
          
          return {
            tournaments: newTournaments,
            activeTournamentId: nextActive,
          };
        }),

      setActiveTournament: (id) => set({ activeTournamentId: id }),

      clearTournaments: () => set({ tournaments: {}, activeTournamentId: null }),
    }),
    {
      name: 'tournament-storage',
      version: 2,
    }
  )
);
