import { useState } from "react";
import { BiImport } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { Circles } from "react-loader-spinner";
import useLayersStore from "../stores/layers_store";
import ImportForm from "./ImportForm";

export default function LayerSidebar() {
  const [isImporting, setIsImporting] = useState(false);

  const { layers, isLoading, isVisible, toggleVisibility, loadLayers } =
    useLayersStore((state) => ({
      layers: state.layers,
      isLoading: state.isLoading,
      isVisible: state.isLayerVisible,
      toggleVisibility: state.toggleLayerVisibility,
      loadLayers: state.loadLayers,
    }));

  return (
    <aside
      className={`w-1/5 shrink-0
        transition-all duration-500 ease-in-out
        h-full p-4 bg-white`}
    >
      {isImporting ? (
        <>
          <h1 className="text-xl font-bold pb-4 flex justify-between items-center">
            Impor
            <button onClick={() => setIsImporting(false)}>
              <IoClose />
            </button>
          </h1>
          <ImportForm
            onSuccess={() => {
              setIsImporting(false);
              loadLayers();
            }}
          />
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold pb-4 flex justify-between items-center">
            Legenda
            <button onClick={() => setIsImporting(true)}>
              <BiImport />
            </button>
          </h1>

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
              <ul>
                {layers.map((information) => {
                  const classByType: Record<string, string> = {
                    road: "w-4 h-1",
                    bridge: "w-2 h-2 rounded-full",
                    area: "w-4 h-4 rounded-sm",
                  };

                  return (
                    <li
                      key={information.layer.id}
                      className="flex flex-row items-center"
                    >
                      <input
                        type="checkbox"
                        checked={isVisible(information.layer.id)}
                        onChange={() => toggleVisibility(information.id)}
                      />
                      <div className="w-8 flex items-center justify-center">
                        <span
                          className={`inline-block mx-2 ${
                            classByType[information.layer.type]
                          }`}
                          style={{ backgroundColor: information.layer.color }}
                        ></span>
                      </div>
                      <span className="flex-grow text-sm">
                        {information.layer.name}
                      </span>
                      {/* checkbox */}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </aside>
  );
}
