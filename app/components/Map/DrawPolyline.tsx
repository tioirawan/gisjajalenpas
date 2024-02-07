import { useLeafletContext } from "@react-leaflet/core";
import L, { LayerGroup } from "leaflet";
import "leaflet-draw";
// import "leaflet-draw/dist/leaflet.draw.css";
import { useCallback, useEffect, useRef, useState } from "react";

type DrawPolylineProps = {
  onChange: (
    value: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | null
  ) => void;
};

export default function DrawPolyline(props: DrawPolylineProps) {
  const context = useLeafletContext();
  const propsRef = useRef(props);
  const [feature, setFeature] = useState<GeoJSON.Feature<
    GeoJSON.LineString | GeoJSON.MultiLineString
  > | null>(null);

  useEffect(() => {
    propsRef.current.onChange(feature);
  }, [feature, propsRef]);

  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  const controlFullRef = useRef<L.Control.Draw>(
    new L.Control.Draw({
      draw: {
        polyline: {
          shapeOptions: {
            color: "#166434",
            weight: 3,
            opacity: 1,
          },
          icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: "leaflet-div-icon leaflet-editing-icon",
          }),
          allowIntersection: false,
          guidelineDistance: 10,
          showLength: true,
        },
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
      },
    })
  );

  const controlEditOnlyRef = useRef<L.Control.Draw>(
    new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
      },
    })
  );

  const onDrawCreated = useCallback(
    async (e: L.LeafletEvent) => {
      const layer = (e as any).layer as L.Polyline;
      drawnItemsRef.current?.addLayer(layer);
      setFeature(await layer.toGeoJSON());
    },
    [setFeature]
  );

  const onDrawEdited = useCallback(async (e: L.LeafletEvent) => {
    const layers = (e as any).layers as LayerGroup;

    const layer = layers.getLayers()[0] as L.Polyline;

    setFeature(await layer.toGeoJSON());
  }, []);

  const onDrawDeleted = useCallback((e: L.LeafletEvent) => {
    setFeature(null);
  }, []);

  useEffect(() => {
    if (feature == null) {
      context.map.addControl(controlFullRef.current);
      context.map.removeControl(controlEditOnlyRef.current);
    } else {
      context.map.removeControl(controlFullRef.current);
      context.map.addControl(controlEditOnlyRef.current);
    }
  }, [feature, context.map]);

  useEffect(() => {
    const map = context.map;

    map.addLayer(drawnItemsRef.current);

    map.on(L.Draw.Event.CREATED, onDrawCreated);
    map.on(L.Draw.Event.EDITED, onDrawEdited);
    map.on(L.Draw.Event.DELETED, onDrawDeleted);

    const controlFull = controlFullRef.current;
    const controlEditOnly = controlEditOnlyRef.current;
    const drawnItems = drawnItemsRef.current;

    return () => {
      if (controlFull) map.removeControl(controlFull);
      if (controlEditOnly) map.removeControl(controlEditOnlyRef.current);
      if (drawnItems) map.removeLayer(drawnItems);

      map.off(L.Draw.Event.CREATED, onDrawCreated);
      map.off(L.Draw.Event.EDITED, onDrawEdited);
      map.off(L.Draw.Event.DELETED, onDrawDeleted);
    };
  }, [context.map, onDrawCreated, onDrawEdited, onDrawDeleted]);

  return null;
}
