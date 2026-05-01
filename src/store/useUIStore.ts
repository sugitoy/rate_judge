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
  displayMode: 'points' | 'percentage' | 'tier';
  setDisplayMode: (mode: 'points' | 'percentage' | 'tier') => void;
  sortKey: string; // 'entryNo' | 'total' | criterionId
  sortOrder: 'asc' | 'desc';
  setSortConfig: (key: string, order: 'asc' | 'desc') => void;
  isConfigDirty: boolean;
  setIsConfigDirty: (dirty: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidePanelOpen: true,
      selectedPlayerIds: [],
      initializedTournamentId: null,
      displayMode: 'points',
      sortKey: 'entryNo',
      sortOrder: 'asc',
      isConfigDirty: false,
      isEditing: false,
      theme: 'light',
      toggleSidePanel: () => set((state) => ({ isSidePanelOpen: !state.isSidePanelOpen })),
      setSidePanel: (isOpen: boolean) => set({ isSidePanelOpen: isOpen }),
      setSelectedPlayerIds: (ids: string[]) => set({ selectedPlayerIds: ids }),
      togglePlayerSelection: (id: string) => set((state) => ({
        selectedPlayerIds: state.selectedPlayerIds.includes(id)
          ? state.selectedPlayerIds.filter((pid) => pid !== id)
          : [...state.selectedPlayerIds, id],
      })),
      setInitializedTournamentId: (id: string | null) => set({ initializedTournamentId: id }),
      setDisplayMode: (mode: 'points' | 'percentage' | 'tier') => set({ displayMode: mode }),
      setSortConfig: (key: string, order: 'asc' | 'desc') => set({ sortKey: key, sortOrder: order }),
      setIsConfigDirty: (dirty: boolean) => set({ isConfigDirty: dirty }),
      setIsEditing: (isEditing: boolean) => set({ isEditing }),
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    {
      name: 'rate-judge-ui-storage',
      partialize: (state) => {
        const { isConfigDirty, isEditing, ...rest } = state;
        return rest;
      },
    }
  )
);
