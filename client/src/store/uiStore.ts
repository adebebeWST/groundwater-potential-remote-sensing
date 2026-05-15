import { create } from 'zustand';

interface UIState {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  loading: boolean;
  error: string | null;
  selectedCandidateId: number | null;
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCandidateId: (id: number | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  leftPanelOpen:       true,
  rightPanelOpen:      true,
  loading:             false,
  error:               null,
  selectedCandidateId: null,

  setLeftPanelOpen:       open  => set({ leftPanelOpen: open }),
  setRightPanelOpen:      open  => set({ rightPanelOpen: open }),
  setLoading:             loading => set({ loading }),
  setError:               error   => set({ error }),
  setSelectedCandidateId: id    => set({ selectedCandidateId: id })
}));
