import { create } from "zustand";

export type BaseLayer = "esri" | "openstreetmap" | "stadia";

type BaseLayerStore = {
  baseLayer: BaseLayer | null;
  setBaseLayer: (layer: BaseLayer | null) => void;
};

const useBaseLayerStore = create<BaseLayerStore>((set) => ({
  baseLayer: "openstreetmap",
  setBaseLayer: (layer) => set({ baseLayer: layer }),
}));

export default useBaseLayerStore;


