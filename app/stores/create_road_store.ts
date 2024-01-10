import { create } from "zustand";
import { FeatureWithProperties } from "../types";

type RoadFeature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>;

type CreateRoadStore = {
  isCreatingRoad: boolean,
  isLoading: boolean,
  geojsonFeature: RoadFeature | null,
  roadProperties: Record<string, any>,
  startCreatingRoad: () => void,
  setGeojsonFeature: (feature: RoadFeature | null) => void,
  setRoadProperties: (properties: Record<string, any>) => void,
  saveCreatedRoad: (layerId: number) => Promise<FeatureWithProperties | null>,
  cancelCreatingRoad: () => void,
}

const useCreateRoad = create<CreateRoadStore>((set, get) => ({
  isCreatingRoad: false,
  isLoading: false,
  geojsonFeature: null,
  roadProperties: {},
  startCreatingRoad: () => {
    set(() => ({
      isCreatingRoad: true,
    }));
  },
  setGeojsonFeature: (feature: RoadFeature | null) => {
    set(() => ({
      geojsonFeature: feature,
    }));
  },

  setRoadProperties: (properties: Record<string, any>) => {
    set(() => ({
      roadProperties: properties,
    }));
  },
  saveCreatedRoad: async (layerId) => {
    set(() => ({
      isLoading: true,
    }));

    const { geojsonFeature, roadProperties } = get();

    // combine
    const feature = {
      ...geojsonFeature,
      properties: {
        ...geojsonFeature?.properties,
        ...roadProperties,
      },
    };

    // save
    const response = await fetch(`/api/layers/${layerId}/feature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feature),
    });

    const createdFeature = await response.json();

    // add to map
    set(() => ({
      isLoading: false,
      isCreatingRoad: false,
      geojsonFeature: null,
      roadProperties: {},
    }));

    return createdFeature;
  },
  cancelCreatingRoad: () => {
    set(() => ({
      isCreatingRoad: false,
      isLoading: false,
      geojsonFeature: null,
      roadProperties: {},
    }));
  },

}));

export default useCreateRoad;
