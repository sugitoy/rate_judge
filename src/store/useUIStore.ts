import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidePanelOpen: boolean;
  selectedPlayerIds: string[];
  initializedTournamentId: string | null;
  toggleSidePanel: () => void;
  setSidePanel: (isOpen: boolean) => void;
  setSelectedPlayerIds: (ids: string[]) => void;
  togglePlayerSelection: (id: string) => void;
  setInitializedTournamentId: (id: string | null) => void;
  displayMode: 'points' | 'percentage';
  setDisplayMode: (mode: 'points' | 'percentage') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidePanelOpen: true,
      selectedPlayerIds: [],
      initializedTournamentId: null,
      displayMode: 'points',
      toggleSidePanel: () => set((state) => ({ isSidePanelOpen: !state.isSidePanelOpen })),
      setSidePanel: (isOpen: boolean) => set({ isSidePanelOpen: isOpen }),
      setSelectedPlayerIds: (ids: string[]) => set({ selectedPlayerIds: ids }),
      togglePlayerSelection: (id: string) => set((state) => ({
        selectedPlayerIds: state.selectedPlayerIds.includes(id)
          ? state.selectedPlayerIds.filter((pid) => pid !== id)
          : [...state.selectedPlayerIds, id],
      })),
      setInitializedTournamentId: (id: string | null) => set({ initializedTournamentId: id }),
      setDisplayMode: (mode: 'points' | 'percentage') => set({ displayMode: mode }),
    }),
    {
      name: 'rate-judge-ui-storage',
    }
  )
);
