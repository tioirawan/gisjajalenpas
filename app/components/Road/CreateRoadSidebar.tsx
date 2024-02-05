"use client";

import { useRoadLayersHook } from "@/app/hooks/useRoadLayersHook";
import useCreateRoad from "@/app/stores/create_road_store";
import useLayersStore, { LayerInformation } from "@/app/stores/layers_store";
import { Listbox, Transition } from "@headlessui/react";
import L from "leaflet";
import { Fragment, useEffect, useMemo, useState } from "react";
import { GiPathDistance } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdCheck, MdCircle } from "react-icons/md";
import { VscActivateBreakpoints } from "react-icons/vsc";
import FeaturePropertyEditor from "../FeaturePropertyEditor";

export default function CreateRoadSidebar() {
  const {
    isCreatingRoad,
    cancelCreatingRoad,
    geojsonFeature,
    roadProperties,
    setRoadProperties,
    setRoadPhotos,
    saveCreatedRoad,
    isLoading,
  } = useCreateRoad((state) => ({
    isCreatingRoad: state.isCreatingRoad,
    cancelCreatingRoad: state.cancelCreatingRoad,
    geojsonFeature: state.geojsonFeature,
    roadProperties: state.roadProperties,
    setRoadProperties: state.setRoadProperties,
    setRoadPhotos: state.setRoadPhotos,
    saveCreatedRoad: state.saveCreatedRoad,
    isLoading: state.isLoading,
  }));

  const loadLayer = useLayersStore((state) => state.loadLayer);

  const roadsLayer = useRoadLayersHook();
  const [selectedLayer, setSelectedLayer] = useState<LayerInformation | null>(
    roadsLayer[0]
  );

  const [properties, setProperties] = useState<Record<string, any>>({});

  useEffect(() => {
    // copy properties from selected layer, keys only, empty value
    if (!selectedLayer) return;

    const candidateProperties =
      selectedLayer.layer.features[0].properties[0].data ?? {};
    const newProperties = Object.keys(candidateProperties).reduce(
      (acc: any, curr) => {
        acc[curr] = "";
        return acc;
      },
      {}
    );
    setProperties(newProperties);
  }, [selectedLayer]);

  const distance = useMemo(() => {
    if (!geojsonFeature) return 0;

    const layers = L.geoJSON(geojsonFeature);
    const layer = layers.getLayers()[0] as L.Polyline;
    const latlngs = layer.getLatLngs() as L.LatLng[];

    const distance = latlngs.reduce((prev, curr, idx) => {
      if (idx === latlngs.length - 1) return prev;

      return prev + curr.distanceTo(latlngs[idx + 1]);
    }, 0);

    // show distance in meter if less than 1000, else show in kilometer
    if (distance < 1000) return `${distance.toFixed(2)} m`;
    return `${(distance / 1000).toFixed(2)} km`;
  }, [geojsonFeature]);

  const points = useMemo(() => {
    if (!geojsonFeature) return 0;

    return geojsonFeature.geometry.coordinates.length;
  }, [geojsonFeature]);

  async function submit() {
    if (!selectedLayer) return;
    try {
      await saveCreatedRoad(selectedLayer!.id);

      loadLayer(selectedLayer!.id);
    } catch (e) {}
  }

  return (
    <aside
      className={`
        ${
          isCreatingRoad
            ? "w-1/2 md:w-1/3 sm:w-2/5 lg:w-1/4 xl:w-1/5 shrink-0"
            : "w-0 "
        }
        transition-all duration-500 ease-in-out
        overflow-y-auto 
        h-full border-r bg-white`}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold ">Tambah Jalan</h1>
          <small className="inline-block">
            Buat ruas jalan baru dengan menggambar pada peta
          </small>
        </div>
        <button onClick={() => cancelCreatingRoad()} className="pl-2">
          <IoClose />
        </button>
      </div>

      <hr />

      <div className="max-w-sm mx-auto p-4">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-gray-700 text-sm font-bold block mb-2"
          >
            Layer
          </label>
          <Listbox value={selectedLayer} onChange={setSelectedLayer}>
            <div className="relative mt-1">
              {/* className="border focus:border-green-500 focus:outline-none rounded transition-all duration-300" */}
              <Listbox.Button className="relative w-full cursor-default border focus:border-green-500 focus:outline-none rounded bg-white py-2 pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {selectedLayer?.layer.name ?? "Pilih Layer"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <MdCircle
                    className="h-5 w-5"
                    aria-hidden="true"
                    style={{ color: selectedLayer?.layer.color }}
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {roadsLayer.map((layer, layerIdx) => (
                    <Listbox.Option
                      key={layerIdx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-green-100 text-green-900"
                            : "text-gray-900"
                        }`
                      }
                      value={layer}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {layer.layer.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                              <MdCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-gray-700 text-sm font-bold block mb-2"
          >
            Polyline
          </label>

          <div className="flex">
            <div className="w-1/2 bg-slate-200 p-2 mr-2 rounded-lg flex flex-col justify-center items-center">
              <span className="text-5xl my-2 text-green-500">
                <VscActivateBreakpoints />
              </span>
              <span className="text-sm font-bold">{points} Titik</span>
            </div>

            <div className="w-1/2 bg-slate-200 p-2 mr-2 rounded-lg flex flex-col justify-center items-center">
              <span className="text-5xl my-2 text-green-500">
                <GiPathDistance />
              </span>
              <span className="text-sm font-bold">{distance}</span>
            </div>
          </div>
        </div>

        {/* debug only show geojson */}
        {/* <textarea
          className="w-full h-28"
          value={JSON.stringify(geojsonFeature, null, 2)}
          readOnly
        ></textarea> */}

        <div className="mb-4">
          <label
            htmlFor="name"
            className="text-gray-700 text-sm font-bold block mb-2"
          >
            Properti
          </label>
          <FeaturePropertyEditor
            initialData={properties}
            isLoading={isLoading}
            onSave={(data, photos) => {
              setRoadProperties(data);
              setRoadPhotos(photos);

              submit();
            }}
          />
        </div>
      </div>
    </aside>
  );
}
