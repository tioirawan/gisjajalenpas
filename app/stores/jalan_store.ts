import { create } from "zustand";
import { JalanWithRuas } from "../types";

export type JalanInformation = {
  id: number;
  road: JalanWithRuas;
  visible: boolean;
};

type JalanStore = {
  data: JalanWithRuas[];
  road: JalanWithRuas | null;
  roads: JalanInformation[];
  loading: boolean;
  error: string | null;
  deleteRoad: (roadId: number) => void;
  updateRoad: (roadId: number, road: Record<string, any>) => void;
  fetch: () => void;
  loadRoad: (id: number) => void;
  toggleJalanVisibility: (jalanId: number) => void;
  isJalanVisible: (jalanId: number) => boolean;
};

const useJalanStore = create<JalanStore>((set, get) => ({
  data: [],
  roads: [],
  road: null,
  loading: false,
  error: null,
  deleteRoad: async (roadId: number) => {
    const response = await fetch(`/api/jalan/${roadId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      set((state) => ({
        roads: state.roads.filter((l) => l.id !== roadId),
      }));
    }
  },
  updateRoad: async (roadId, road) => {
    const response = await fetch(`/api/jalan/${roadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(road),
    });

    if (response.ok) {
      await get().loadRoad(roadId);
    }
  },
  fetch: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/jalan", { next: { revalidate: 10 }});
      const data = await response.json();
      set({
        data,
        loading: false,
        roads: data.map((road: JalanWithRuas) => ({
          id: road.id,
          road,
          visible: true,
        })),
      });
    } catch (error) {
      set({ error: "Gagal memuat data kondisi jalan", loading: false });
    }
  },
  loadRoad: async (id: number) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/jalan/${id}`);
      const road = await response.json();
      set((state) => {
        const newRoads = state.roads.map((l) => {
          if (l.id === id) {
            return { ...l, road };
          }
          return l;
        });

        return {
          roads: newRoads,
          road,
          loading: false,
        };
      });
    } catch (error) {
      set({ error: "Gagal memuat data kondisi jalan", loading: false });
    }
  },
  toggleJalanVisibility: (layerId) =>
    set((state) => ({
      roads: state.roads.map((l) => {
        if (l.id === layerId) {
          const visibility = !l.visible;
          localStorage.setItem(`jalan-${l.id}`, JSON.stringify(visibility));
          return { ...l, visible: visibility };
        }
        return l;
      }),
    })),
  isJalanVisible: (layerId) => {
    const visibility = localStorage.getItem(`jalan-${layerId}`);

    return visibility ? JSON.parse(visibility) : true;
  },
}));

export default useJalanStore;
