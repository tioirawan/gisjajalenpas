"use client";

import { useEffect, useMemo, useState } from "react";
import { Circles } from "react-loader-spinner";
import NavBar from "../components/NavBar";
import useJalanStore from "../stores/jalan_store";
import BarPerkerasanJalan from "./BarPerkerasanJalan";
import PieKondisiJalan from "./PieKondisiJalan";

export default function Laporan() {
  //   const { layers, isLoading, loadLayers } = useLayersStore((state) => ({
  //     layers: state.layers,
  //     isLoading: state.isLoading,
  //     loadLayers: state.loadLayers,
  //   }));

  const { loadRoads, roadError, roadLoading, roads, loadRoad, road } =
    useJalanStore((state) => ({
      roads: state.data,
      road: state.road,
      roadLoading: state.loading,
      roadError: state.error,
      loadRoads: state.fetch,
      loadRoad: state.loadRoad,
    }));

  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);

  const selectedRoad = useMemo(() => {
    if (!selectedRoadId) return null;

    return roads.find((road) => road.id === parseInt(selectedRoadId));
  }, [roads, selectedRoadId]);

  const jumlahSta = useMemo(() => {
    if (!road) return 0;

    const r: any = road;

    return r.ruas.reduce((acc: any, ruas: any) => {
      return acc + ruas.sta.length;
    }, 0);
  }, [road]);

  useEffect(() => {
    loadRoads();
  }, [loadRoads]);

  useEffect(() => {
    if (selectedRoadId) {
      loadRoad(parseInt(selectedRoadId));
    }
  }, [selectedRoadId, loadRoad]);

  const jumlahPanjang = useMemo(() => {
    return selectedRoad?.ruas.reduce((acc, ruas: any) => {
      const panjang = parseFloat(ruas.panjangSK ?? 0);

      return acc + panjang;
    }, 0);
  }, [selectedRoad]);

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
          value={selectedRoadId ?? ""}
          onChange={(e) => setSelectedRoadId(e.target.value)}
        >
          <option value="">Pilih Jalan</option>
          {roads.map((road) => (
            <option key={road.id} value={road.id}>
              {road.nama}
            </option>
          ))}
        </select>

        {roadLoading ? (
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
        ) : road ? (
          <div className="flex flex-col justify-stretch">
            <table className="border-collapse border border-slate-200 mb-4">
              <tbody>
                <tr>
                  <th className="border border-slate-300 p-2 font-bold text-left w-1/4">
                    Jumlah Ruas
                  </th>
                  <td className="border border-slate-300 p-2">
                    {selectedRoad?.ruas.length} Ruas ({jumlahSta} STA)
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
                <BarPerkerasanJalan road={road} />
              </div>
              <div className="w-1/2 flex-grow shrink-0 ml-1">
                <PieKondisiJalan road={road} />
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
