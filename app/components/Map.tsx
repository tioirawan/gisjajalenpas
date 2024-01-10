"use client";

import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import {
  CircleMarker,
  MapContainer,
  Pane,
  Polygon,
  Polyline,
} from "react-leaflet";
import seedColor from "seed-color";
import useLayersStore from "../stores/layers_store";
import useSelectedFeatureStore from "../stores/selected_feature_store";
import { swapLngLat } from "../utils/helper";
import BaseLayer from "./BaseLayer";

// import "leaflet.polylinemeasure";

// export const PolylineMeasureControl = createControlComponent(
//   (props) => new Control.PolylineMeasure(props)
// );

export default function Map() {
  const { setSelectedFeature, selectedFeature } = useSelectedFeatureStore();

  const { layers: layersInformation, isVisible } = useLayersStore((state) => ({
    layers: [...state.layers].reverse(),
    isVisible: state.isLayerVisible,
  }));

  return (
    <MapContainer
      center={[-7.786, 112.8582]}
      zoom={11}
      className="h-full w-full absolute bg-white"
      style={{ backgroundColor: "red" }}
      renderer={L.canvas({
        tolerance: 500,
      })}
    >
      <BaseLayer />

      {/* <PolylineMeasureControl /> */}

      <Pane name="bridge" style={{ zIndex: 503 }} />
      <Pane name="road" style={{ zIndex: 502 }} />
      <Pane name="area" style={{ zIndex: 501 }} />

      {layersInformation.map((information, i) => {
        if (!isVisible(information.id)) return null;
        switch (information.layer.type) {
          case "road":
            return information.layer.features.map((feature, i) => (
              <Polyline
                key={i}
                pane="road"
                positions={
                  swapLngLat(feature?.geometry[0]?.coordinates as any) as any
                }
                pathOptions={{
                  color: information.layer.color,
                  // color: selectedFeature == road ? "red" : "black",
                  weight:
                    selectedFeature?.id == feature.id
                      ? information.layer.weight! + 2
                      : information.layer.weight!,
                  dashArray: information.layer.dashed ? [7, 7] : [],
                  dashOffset: information.layer.dashed ? "10" : "15",
                }}
                eventHandlers={{
                  click: (e) => {
                    setSelectedFeature(feature);
                  },
                }}
              ></Polyline>
            ));
          case "bridge":
            return information.layer.features.map((feature, i) => (
              <CircleMarker
                key={i}
                pane="bridge"
                center={
                  swapLngLat(feature?.geometry[0]?.coordinates as any) as any
                }
                radius={
                  selectedFeature?.id == feature.id
                    ? information.layer.radius! + 2
                    : information.layer.radius!
                }
                pathOptions={{
                  color: "black",
                  weight: 1,
                  fill: true,
                  fillColor: information.layer.color,
                  fillOpacity: 0.5,
                }}
                eventHandlers={{
                  click: (e) => {
                    setSelectedFeature(feature);
                  },
                }}
              ></CircleMarker>
            ));
          case "area":
            return information.layer.features.map((feature, i) => (
              <Polygon
                key={i}
                pane="area"
                positions={
                  swapLngLat(feature?.geometry[0]?.coordinates as any) as any
                }
                pathOptions={{
                  // color: seedColor(feature.properties[0]).toHex(),
                  color: information.layer.color,
                  fillColor: seedColor(feature.id.toString()).toHex(),
                  opacity: selectedFeature?.id == feature.id ? 1 : 0.5,
                  weight: information.layer.weight!,
                  fillOpacity: selectedFeature?.id == feature.id ? 1 : 0.25,
                }}
                eventHandlers={{
                  click: (e) => {
                    setSelectedFeature(feature);
                  },
                }}
              ></Polygon>
            ));
          default:
            return null;
        }
      })}

      {/* <FeatureGroup>
        <DraftControl />
      </FeatureGroup> */}
    </MapContainer>
  );
}
