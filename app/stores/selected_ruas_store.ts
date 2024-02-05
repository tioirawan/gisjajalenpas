import { Ruas } from "@prisma/client";
import { create } from "zustand";
import { RuasWithSta } from "../types";

type SelectedRuasStore = {
  selected: RuasWithSta | null;
  isLoading: boolean;
  error: string | null;
  set: (ruas: Ruas | null) => Promise<void>;
  refresh(): Promise<void>;
};

const useSelectedRuasStore = create<SelectedRuasStore>((set, get) => ({
  selected: null,
  isLoading: false,
  error: null,
  set: async (ruas) => {
    if (!ruas) {
      set({ selected: null });
      return;
    }

    set({ isLoading: true });
    try {
      const idJalan = ruas?.idJalan;
      const nomorRuas = ruas?.nomorRuas;
      const response = await fetch(`/api/jalan/${idJalan}/ruas/${nomorRuas}/sta`);
      const sta = await response.json();

      set({ selected: { ...ruas, sta } as RuasWithSta, isLoading: false });
    } catch (error) {
      set({ error: "Gagal memuat data kondisi jalan", isLoading: false });
    }
  },
  refresh: async () => {
    const ruas = get().selected;
    if (ruas) {
      await get().set(ruas);
    }
  }
}));

export default useSelectedRuasStore;