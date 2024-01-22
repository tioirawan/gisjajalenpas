/* eslint-disable @next/next/no-img-element */
import useBaseLayerStore from "@/app/stores/base_layer_store";
import useLayersStore from "@/app/stores/layers_store";
import { BiImport } from "react-icons/bi";
import { Circles } from "react-loader-spinner";
import AdminOnly from "../AdminOnly";
import LayerTile from "./LayerTile";

type LayerListProps = {
  onImporting: (value: boolean) => void;
  onEdit: (value: any) => void;
};

export default function LayersList(props: LayerListProps) {
  const { layers, isLoading } = useLayersStore((state) => ({
    layers: state.layers,
    isLoading: state.isLoading,
  }));

  const { baseLayer, setBaseLayer } = useBaseLayerStore();

  return (
    <>
      <h1 className="text-xl font-bold p-4 flex justify-between items-center">
        Legenda
        <AdminOnly>
          <button onClick={() => props.onImporting(true)}>
            <BiImport />
          </button>
        </AdminOnly>
      </h1>

      <hr />

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Circles
            height="35"
            width="35"
            color="#4fa94d"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <>
          <ul className="p-4">
            {layers.map((information) => {
              return (
                <LayerTile
                  key={information.id}
                  layerInformation={information}
                  onEdit={(layerInformation) => {
                    props.onEdit(layerInformation);
                  }}
                />
              );
            })}
          </ul>
        </>
      )}

      <hr />

      <h2 className="text-lg font-bold p-4">Peta Dasar</h2>

      <div className="grid grid-cols-2 gap-2 px-4">
        <div
          className={`p-2 rounded-lg ${
            baseLayer === "esri"
              ? "bg-green-800 text-white"
              : "bg-slate-200 text-slate-800"
          } hover:bg-green-800 hover:text-white cursor-pointer`}
          onClick={() => setBaseLayer("esri")}
        >
          <img
            src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0"
            alt="esri"
            className="w-full rounded"
          />
          <p className={`text-center font-bold text-xs mt-2`}>Satelit</p>
        </div>
        <div
          className={`p-2 rounded-lg ${
            baseLayer === "openstreetmap"
              ? "bg-green-800 text-white"
              : "bg-slate-200 text-slate-800"
          } hover:bg-green-800 hover:text-white cursor-pointer`}
          onClick={() => setBaseLayer("openstreetmap")}
        >
          <img
            src="https://a.tile.openstreetmap.org/0/0/0.png"
            alt="openstreetmap"
            className="w-full rounded"
          />
          <p className={`text-center font-bold text-xs mt-2`}>Street View</p>
        </div>
        <div
          className={`p-2 rounded-lg ${
            baseLayer === "stadia"
              ? "bg-green-800 text-white"
              : "bg-slate-200 text-slate-800"
          } hover:bg-green-800 hover:text-white cursor-pointer`}
          onClick={() => setBaseLayer("stadia")}
        >
          <img
            src="https://tiles.stadiamaps.com/tiles/alidade_smooth/0/0/0.png"
            alt="stadia"
            className="w-full rounded"
          />
          <p className={`text-center font-bold text-xs mt-2`}>Simple</p>
        </div>
        <div
          className={`p-2 rounded-lg ${
            baseLayer === null
              ? "bg-green-800 text-white"
              : "bg-slate-200 text-slate-800"
          } hover:bg-green-800 hover:text-white cursor-pointer`}
          onClick={() => setBaseLayer(null)}
        >
          <div className="bg-white rounded-lg ">
            <img
              src="https://tiles.stadiamaps.com/tiles/alidade_smooth/0/0/0.png"
              alt="stadia"
              className="w-full rounded-lg opacity-0"
            />
          </div>
          <p className={`text-center font-bold text-xs mt-2`}>
            Tanpa Peta Dasar
          </p>
        </div>
      </div>
    </>
  );
}
