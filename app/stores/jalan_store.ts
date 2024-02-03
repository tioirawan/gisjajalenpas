import { create } from "zustand";
import { JalanWithRuas } from "../types";

type JalanStore = {
  data: JalanWithRuas[];
  road: JalanWithRuas | null;
  loading: boolean;
  error: string | null;

  fetch: () => void;
  loadRoad: (id: string) => void;
};

const useJalanStore = create<JalanStore>((set) => ({
  data: [],
  road: null,
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/jalan");
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: "Gagal memuat data kondisi jalan", loading: false });
    }
  },
  loadRoad: async (id: string) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/jalan/${id}`);
      const road = await response.json();
      set({ loading: false, road });
    } catch (error) {
      set({ error: "Gagal memuat data kondisi jalan", loading: false });
    }
  },
}));

export default useJalanStore;
