import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidePanelOpen: boolean;
  toggleSidePanel: () => void;
  setSidePanel: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidePanelOpen: true,
      toggleSidePanel: () => set((state) => ({ isSidePanelOpen: !state.isSidePanelOpen })),
      setSidePanel: (isOpen: boolean) => set({ isSidePanelOpen: isOpen }),
    }),
    {
      name: 'rate-judge-ui-storage',
    }
  )
);
