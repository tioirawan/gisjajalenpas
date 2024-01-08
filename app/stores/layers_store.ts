import { create } from "zustand";
import { FeatureCollectionFull } from "../types";

export type LayerInformation = {
  id: number;
  layer: FeatureCollectionFull;
  visible: boolean;
}

type LayersStore = {
  layers: LayerInformation[];
  isLoading: boolean;
  loadLayers: () => void;
  addLayer: (layer: FeatureCollectionFull) => void;
  deleteLayer: (layerId: number) => void;
  loadLayer: (layerId: number) => Promise<FeatureCollectionFull>;
  toggleLayerVisibility: (layerId: number) => void;
  isLayerVisible: (layerId: number) => boolean;
};

const useLayersStore = create<LayersStore>((set, get) => ({
  layers: [],
  isLoading: false,
  loadLayers: async () => {
    set({ isLoading: true });

    const response = await fetch(`/api/layers`);
    const data = await response.json();

    // sort data bridge, road, area
    const score: { [key: string]: number } = {
      bridge: 0,
      road: 1,
      area: 2,
    };

    data.sort((a: FeatureCollectionFull, b: FeatureCollectionFull) => {
      return score[a.type] - score[b.type];
    });

    set({
      layers:
        data.map((layer: FeatureCollectionFull) => ({
          id: layer.id,
          layer, visible: true,
        }))
      , isLoading: false
    })
  },
  addLayer: (layer) => {
    set((state) => ({
      layers: [...state.layers, { id: layer.id, layer, visible: true }],
    }));
  },
  deleteLayer: async (layerId: number) => {
    const response = await fetch(`/api/layers/${layerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      set((state) => ({
        layers: state.layers.filter((l) => l.id !== layerId),
      }));
    }
  },
  loadLayer: async (layerId) => {
    const response = await fetch(`/api/layers/${layerId}`);
    const layer = await response.json();

    set((state) => {
      const newLayers = state.layers.map((l) => {
        if (l.id === layerId) {
          return { ...l, layer };
        }
        return l;
      });

      return {
        layers: newLayers,
      };
    });

    return layer as FeatureCollectionFull;
  },
  toggleLayerVisibility: (layerId) =>
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id === layerId) {
          return { ...l, visible: !l.visible };
        }
        return l;
      }),
    })),
  isLayerVisible: (layerId) => {
    const layerInfo = get().layers.find((l) => l.id === layerId);
    return layerInfo ? layerInfo.visible : false;
  },
}));

export default useLayersStore;
