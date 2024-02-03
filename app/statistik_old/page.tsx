"use client";

import { useEffect, useMemo, useState } from "react";
import { Circles } from "react-loader-spinner";
import NavBar from "../components/NavBar";
import useLayersStore from "../stores/layers_store";
import BarPerkerasanJalan from "./BarPerkerasanJalan";
import PieKondisiJalan from "./PieKondisiJalan";

export default function Laporan() {
  const { layers, isLoading, loadLayers } = useLayersStore((state) => ({
    layers: state.layers,
    isLoading: state.isLoading,
    loadLayers: state.loadLayers,
  }));

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const selectedLayer = useMemo(() => {
    if (!selectedLayerId) return null;

    return layers.find((layer) => layer.id === parseInt(selectedLayerId));
  }, [layers, selectedLayerId]);

  useEffect(() => {
    loadLayers();
  }, [loadLayers]);

  const jumlahPanjang = useMemo(() => {
    return selectedLayer?.layer.features.reduce((acc, feature) => {
      const panjang = parseFloat(
        (feature.properties[0].data as any)["Panjang_1"] ?? 0
      );

      return acc + panjang;
    }, 0);
  }, [selectedLayer?.layer.features]);

  console.log(layers);

  return (
    <div className="flex flex-col items-stretch h-screen ">
      <NavBar />

      <main
        className="container mx-auto px-4 py-8 overflow-y-auto w-full"
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <h1 className="text-xl font-semibold text-center">
          Data Jalan Kabupaten Pasuruan
        </h1>

        <hr />

        {/* select layer */}
        <select
          className="w-full p-2 my-4 border rounded-md"
          value={selectedLayerId ?? ""}
          onChange={(e) => setSelectedLayerId(e.target.value)}
        >
          <option value="">Pilih Jalan</option>
          {layers
            .filter((layer) => layer.layer.type === "road")
            .map((layer) => (
              <option key={layer.id} value={layer.id}>
                {layer.layer.name}
              </option>
            ))}
        </select>

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
        ) : selectedLayer ? (
          <div className="flex flex-col justify-stretch">
            <table className="border-collapse border border-slate-200 mb-4">
              <tbody>
                <tr>
                  <th className="border border-slate-300 p-2 font-bold text-left w-1/4">
                    Jumlah Ruas
                  </th>
                  <td className="border border-slate-300 p-2">
                    {selectedLayer?.layer.features.length} Ruas
                  </td>
                </tr>
                <tr>
                  <th className="border border-slate-300 p-2 font-bold text-left w-1/4">
                    Panjang Total
                  </th>
                  <td className="border border-slate-300 p-2">
                    {jumlahPanjang?.toFixed(2)} Km
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex w-full overflow-x-auto">
              <div className="w-1/2 flex-grow shrink-0 pr-4">
                <BarPerkerasanJalan layer={selectedLayer?.layer} />
              </div>
              <div className="w-1/2 flex-grow shrink-0 ml-1">
                <PieKondisiJalan layer={selectedLayer?.layer} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Pilih Jalan</p>
          </div>
        )}
      </main>
    </div>
  );
}
