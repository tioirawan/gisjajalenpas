import { create } from "zustand";
import { FeatureWithProperties, NewPhoto } from "../types";

type RoadFeature = GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>;

type CreateRoadStore = {
  isCreatingRoad: boolean,
  isLoading: boolean,
  geojsonFeature: RoadFeature | null,
  roadProperties: Record<string, any>,
  roadPhotos: Array<NewPhoto>,
  startCreatingRoad: () => void,
  setGeojsonFeature: (feature: RoadFeature | null) => void,
  setRoadProperties: (properties: Record<string, any>) => void,
  setRoadPhotos: (photos: Array<NewPhoto>) => void,
  saveCreatedRoad: (layerId: number) => Promise<FeatureWithProperties | null>,
  cancelCreatingRoad: () => void,
}

const useCreateRoad = create<CreateRoadStore>((set, get) => ({
  isCreatingRoad: false,
  isLoading: false,
  geojsonFeature: null,
  roadProperties: {},
  roadPhotos: [],
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
  setRoadPhotos: (photos: Array<NewPhoto>) => {
    set(() => ({
      roadPhotos: photos,
    }));
  },
  saveCreatedRoad: async (layerId) => {
    set(() => ({
      isLoading: true,
    }));

    const { geojsonFeature, roadProperties, roadPhotos } = get();

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

    if (!response.ok) {
      return null;
    }

    const createdFeature = await response.json() as FeatureWithProperties;

    // upload photos
    for (const photo of roadPhotos) {
      const formData = new FormData();
      formData.append("file", photo.file);
      formData.append("description", photo.description);

      const response = await fetch(`/api/properties/${createdFeature.properties[0].id}/photos`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return null;
      }
    }

    // add to map
    set(() => ({
      isLoading: false,
      isCreatingRoad: false,
      geojsonFeature: null,
      roadProperties: {},
      roadPhotos: [],
    }));

    return createdFeature;
  },
  cancelCreatingRoad: () => {
    set(() => ({
      isCreatingRoad: false,
      isLoading: false,
      geojsonFeature: null,
      roadProperties: {},
      roadPhotos: [],
    }));
  },

}));

export default useCreateRoad;
