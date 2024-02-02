import { create } from "zustand";
import { JalanWithRuas } from "../types";


type JalanStore = {
  data: JalanWithRuas[];
  loading: boolean;
  error: string | null;

  fetch: () => void;
};

const useJalanStore = create<JalanStore>((set) => ({
  data: [],
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
  }
}));

export default useJalanStore;


