import { create } from "zustand";
import { FeatureCollectionFull } from "../types";

type SelectedLayerStore = {
  selectedLayer: FeatureCollectionFull | null;
  setSelectedLayer: (layer: FeatureCollectionFull | null) => void;
};

const useSelectedLayerStore = create<SelectedLayerStore>((set) => ({
  selectedLayer: null,
  setSelectedLayer: (layer) => set({ selectedLayer: layer }),
}));

export default useSelectedLayerStore;