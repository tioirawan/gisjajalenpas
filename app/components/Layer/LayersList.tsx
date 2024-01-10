import useBaseLayerStore from "@/app/stores/base_layer_store";
import useLayersStore from "@/app/stores/layers_store";
import { BiImport } from "react-icons/bi";
import { Circles } from "react-loader-spinner";
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
        <button onClick={() => props.onImporting(true)}>
          <BiImport />
        </button>
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

      {/* radio button to select between arcgis, openstreetmap atau tanpa peta dasar */}
      <div className="flex flex-col px-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="radio"
            checked={baseLayer === "esri"}
            onChange={() => setBaseLayer("esri")}
          />
          <span className="ml-2">Esri World Imagery</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="radio"
            checked={baseLayer === "openstreetmap"}
            onChange={() => setBaseLayer("openstreetmap")}
          />
          <span className="ml-2">OpenStreetMap</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="radio"
            checked={baseLayer === "stadia"}
            onChange={() => setBaseLayer("stadia")}
          />
          <span className="ml-2">Stadia Alidade Smooth</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio"
            name="radio"
            checked={baseLayer === null}
            onChange={() => setBaseLayer(null)}
          />
          <span className="ml-2">Tanpa Peta Dasar</span>
        </label>
      </div>
    </>
  );
}
