"use client";

import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MdLayers, MdLayersClear, MdOutlineAddRoad } from "react-icons/md";
import {
  CircleMarker,
  MapContainer,
  Pane,
  Polygon,
  Polyline,
  Popup,
  ZoomControl,
} from "react-leaflet";
import seedColor from "seed-color";
import useCreateRoad from "../stores/create_road_store";
import useCurrentPositionStore from "../stores/current_position_store";
import useLayersStore from "../stores/layers_store";
import useSelectedFeatureStore from "../stores/selected_feature_store";
import { swapLngLat } from "../utils/helper";
import AdminOnly from "./AdminOnly";
import BaseLayer from "./BaseLayer";
import FeaturePropertyDetailPopup from "./Feature/FeaturePropertyPopup";
import DrawPolyline from "./Map/DrawPolyline";

import { AutoLocateControl } from "./AutoLocateControl";

export default function Map() {
  const { setSelectedFeature, selectedFeature } = useSelectedFeatureStore();

  const { position, updatePosition } = useCurrentPositionStore();

  useEffect(() => {
    updatePosition();
  }, []);

  const { isCreatingRoad, startCreatingRoad, setGeojsonFeature } =
    useCreateRoad((state) => ({
      isCreatingRoad: state.isCreatingRoad,
      startCreatingRoad: state.startCreatingRoad,
      setGeojsonFeature: state.setGeojsonFeature,
    }));

  const {
    layers: layersInformation,
    isLayerVisible,
    isVisible,
    toggleVisibility,
  } = useLayersStore((state) => ({
    layers: [...state.layers].reverse(),
    isLayerVisible: state.isLayerVisible,
    isVisible: state.isVisible,
    toggleVisibility: state.toggleVisibility,
  }));

  return (
    <MapContainer
      center={[-7.786, 112.8582]}
      zoom={11}
      zoomControl={false}
      className="h-full w-full absolute bg-white"
      style={{ backgroundColor: "red" }}
      renderer={L.canvas({
        tolerance: 500,
      })}
    >
      <BaseLayer />

      {isCreatingRoad && (
        <DrawPolyline
          onChange={(value) => {
            setGeojsonFeature(value);
          }}
        />
      )}

      {!isCreatingRoad && (
        <AdminOnly>
          <button
            onClick={() => startCreatingRoad()}
            className="z-[500] relative p-4 rounded-lg bg-slate-200 text-xl text-green-900 shadow-lg border-green-900 border-2 hover:bg-slate-300 hover:text-slate-800 m-4"
          >
            <MdOutlineAddRoad />
          </button>
        </AdminOnly>
      )}

      <button
        onClick={() => toggleVisibility()}
        className="float-right z-[500] relative p-4 rounded-lg bg-slate-200 text-xl text-green-900 shadow-lg border-green-900 border-2 hover:bg-slate-300 hover:text-slate-800 m-4"
      >
        {!isVisible ? <MdLayers /> : <MdLayersClear />}
      </button>

      <ZoomControl position="bottomright" />
      <AutoLocateControl position="bottomright" />
      {/* <PolylineMeasureControl /> */}

      <Pane name="bridge" style={{ zIndex: 503 }} />
      <Pane name="road" style={{ zIndex: 502 }} />
      <Pane name="area" style={{ zIndex: 501 }} />
      {layersInformation.map((information, i) => {
        if (!isLayerVisible(information.id)) return null;
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
              >
                <Popup>
                  <FeaturePropertyDetailPopup
                    feature={feature}
                    onDetail={() => {
                      setSelectedFeature(feature);
                    }}
                  />
                </Popup>
              </Polyline>
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

      {position && (
        <CircleMarker
          center={[position.coords.latitude, position.coords.longitude]}
          radius={5}
          pathOptions={{
            color: "blue",
            weight: 2,
            fill: true,
            fillColor: "#0000FF",
            fillOpacity: 1,
            stroke: true,
          }}
        ></CircleMarker>
      )}
      {/* <FeatureGroup>
        <DraftControl />
      </FeatureGroup> */}
    </MapContainer>
  );
}
