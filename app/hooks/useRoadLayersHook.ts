import useLayersStore from "../stores/layers_store";

export function useRoadLayersHook() {
  const layers = useLayersStore(state => state.layers);

  const roadLayers = layers.filter(information => information.layer.type === "road");

  return roadLayers;
}