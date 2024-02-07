"use client";
import L, { Icon } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdClose,
  MdLayers,
  MdLayersClear,
  MdOutlineAddRoad,
} from "react-icons/md";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Pane,
  Polygon,
  Polyline,
  Popup,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import seedColor from "seed-color";
import useCreateRoad from "../stores/create_road_store";
import useCurrentPositionStore from "../stores/current_position_store";
import useLayersStore from "../stores/layers_store";
import useSelectedFeatureStore from "../stores/selected_feature_store";
import { colorFromKondisi, swapLngLat } from "../utils/helper";
import AdminOnly from "./AdminOnly";
import BaseLayer from "./BaseLayer";
import FeaturePropertyDetailPopup from "./Feature/FeaturePropertyPopup";
import DrawPolyline from "./Map/DrawPolyline";

import useJalanStore from "../stores/jalan_store";
import useSelectedRuasStore from "../stores/selected_ruas_store";
import useSelectedStaStore from "../stores/selected_sta_store";
import { AutoLocateControl } from "./AutoLocateControl";

const healthIcon = new Icon({
  iconUrl:
    "https://static.vecteezy.com/system/resources/previews/009/267/136/non_2x/location-icon-design-free-png.png",
  iconSize: [25, 35], // size of the icon
  iconAnchor: [12, 35], // point of the icon which will correspond to marker's location,
  tooltipAnchor: [0, -35 - 4],
});

const AutoboundToRuas = () => {
  const map = useMap();
  const selectedRuas = useSelectedRuasStore((state) => state.selected);
  useEffect(() => {
    const coordinates = selectedRuas?.sta.reduce((acc: any[], curr) => {
      return [...acc, ...(curr.coordinates as any)[0]];
    }, []);

    const bounds = L.latLngBounds(swapLngLat(coordinates as any) as any);

    if (selectedRuas) {
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1,
      });
    }
  }, [selectedRuas, map]);
  return null;
};

export default function Map() {
  const [map, setMap] = useState<any>(null);
  const [currentZoom, setCurrentZoom] = useState(11);

  const { setSelectedFeature, selectedFeature } = useSelectedFeatureStore();

  const { position, updatePosition } = useCurrentPositionStore();

  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  const onZoom = useCallback(() => {
    setCurrentZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on("zoom", onZoom);
    }
  }, [map, onZoom]);

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

  const { dataKondisiJalan, isRoadVisible } = useJalanStore((state) => ({
    dataKondisiJalan: state.roads,
    isRoadVisible: state.isJalanVisible,
  }));

  // kondisi jalan
  // const dataKondisiJalan = useJalanStore((state) => state.roads);
  const selectedRuas = useSelectedRuasStore((state) => state.selected);
  const setSelectedRuas = useSelectedRuasStore((state) => state.set);
  const selectedSta = useSelectedStaStore((state) => state.selected);
  const setSelectedSta = useSelectedStaStore((state) => state.set);

  const icons = useMemo(() => {
    const result: Record<number, L.DivIcon> = {};

    for (let jalan of dataKondisiJalan) {
      const color = seedColor(jalan.road.id.toString()).toHex();
      const markerHtmlStyles = `
        background-color: ${color};
        width: 16px;
        height: 16px;
        display: block;
        left: -8px;
        top: -8px;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

      const icon = new L.DivIcon({
        className: "my-custom-pin",
        iconAnchor: [-8, 0],
        html: `<span style="${markerHtmlStyles}" />`,
      });

      result[jalan.road.id] = icon;
    }
    return result;
  }, [dataKondisiJalan]);

  return (
    <MapContainer
      ref={setMap}
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

      {selectedRuas && (
        <button
          onClick={() => setSelectedRuas(null)}
          className="float-right z-[500] relative p-4 rounded-lg bg-slate-200 text-xl text-green-900 shadow-lg border-green-900 border-2 hover:bg-slate-300 hover:text-slate-800 mt-4"
        >
          <MdClose />
        </button>
      )}

      <ZoomControl position="bottomright" />
      <AutoLocateControl position="bottomright" />
      {/* <PolylineMeasureControl /> */}

      <AutoboundToRuas />

      <Pane name="sta" style={{ zIndex: 504 }} />
      <Pane name="bridge" style={{ zIndex: 503 }} />
      <Pane name="road" style={{ zIndex: 502 }} />
      <Pane name="area" style={{ zIndex: 501 }} />

      {selectedRuas &&
        selectedRuas.sta.map((sta, i) => {
          return (
            <Polyline
              key={`sta-line-${sta.id}`}
              pane="sta"
              positions={swapLngLat(sta.coordinates as any) as any}
              pathOptions={{
                color: colorFromKondisi(sta.kondisi),
                // color: selectedFeature == road ? "red" : "black",
                weight: selectedSta?.id == sta.id ? 10 : 3,
              }}
              eventHandlers={{
                click: (e) => {
                  setSelectedSta(sta);
                },
              }}
            ></Polyline>
          );
        })}

      {selectedRuas &&
        selectedRuas.sta.map((sta, i) => {
          const coordinates = (sta.coordinates as any)[0];
          const lastCoordinate = coordinates[coordinates.length - 1];
          return (
            <Marker
              key={`sta-marker-${sta.id}`}
              position={[lastCoordinate[1], lastCoordinate[0]]}
              icon={healthIcon}
              // icon={
              //   // new Icon({
              //   //   iconUrl:
              //   //     "https://static.vecteezy.com/system/resources/previews/009/267/136/non_2x/location-icon-design-free-png.png",
              //   //   iconSize: [25, 35], // size of the icon
              //   //   iconAnchor: [12, 35], // point of the icon which will correspond to marker's location,
              //   //   tooltipAnchor: [0, -35 - 4],
              //   // })
              //   // dynamic color based on
              // }
              eventHandlers={{
                click: (e) => {
                  setSelectedSta(sta);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, 0]} opacity={1} permanent>
                {sta.sta}
              </Tooltip>
            </Marker>
          );
        })}

      {!selectedRuas && (
        <>
          {/* marker ruas jalan */}
          {dataKondisiJalan.map((jalan, i) => {
            if (!isRoadVisible(jalan.id)) return null;
            const ruas = jalan.road.ruas;

            return ruas.map((ruas, i) => {
              return (
                <Marker
                  key={i}
                  position={[ruas.latitude!, ruas.longitude!]}
                  icon={icons[jalan.road.id]}
                  eventHandlers={{
                    click: (e) => {
                      setSelectedRuas(ruas);
                    },
                  }}
                >
                  {currentZoom > 14 && (
                    <Tooltip
                      className="marker-tooltip"
                      direction="top"
                      offset={[0, 0]}
                      opacity={1}
                      permanent={true}
                    >
                      {ruas.namaRuas}
                    </Tooltip>
                  )}
                </Marker>
              );
            });
          })}

          {layersInformation.map((information, i) => {
            if (!isLayerVisible(information.id)) return null;
            switch (information.layer.type) {
              case "road":
                return information.layer.features.map((feature, i) => (
                  <Polyline
                    key={i}
                    pane="road"
                    positions={
                      swapLngLat(
                        feature?.geometry[0]?.coordinates as any
                      ) as any
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
                      swapLngLat(
                        feature?.geometry[0]?.coordinates as any
                      ) as any
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
                      swapLngLat(
                        feature?.geometry[0]?.coordinates as any
                      ) as any
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
        </>
      )}
    </MapContainer>
  );
}
