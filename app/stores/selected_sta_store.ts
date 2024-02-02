import { Sta } from "@prisma/client";
import { create } from "zustand";

type SelectedStaStore = {
  selected: Sta | null;
  isLoading: boolean;
  error: string | null;
  set: (ruas: Sta | null) => void;
};

const useSelectedStaStore = create<SelectedStaStore>((set) => ({
  selected: null,
  isLoading: false,
  error: null,
  set: (sta) => set({ selected: sta }),
}));

export default useSelectedStaStore;