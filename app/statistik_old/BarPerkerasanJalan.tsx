type BarPerkerasanJalanProps = {
  layer: FeatureCollectionFull;
};

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { FeatureCollectionFull } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarPerkerasanJalan({ layer }: BarPerkerasanJalanProps) {
  const { features } = layer;

  const chartId = "bar-perkerasan-jalan";

  const data = useMemo(() => {
    // from features, count the number of each type based on first properties data with key Tipe_Ker_1
    const result: Record<string, number> = {};

    features.forEach((feature) => {
      const data = feature.properties[0]?.data as { [key: string]: any };
      const types: string[] = data["Tipe_Ker_1"]?.split(", ") ?? [];

      // loop types, add it to result
      types.forEach((type) => {
        type = type.trim();

        if (result[type]) {
          result[type] += 1;
        } else {
          result[type] = 1;
        }
      });
    });

    return result;
  }, [features]);

  function downloadChart() {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "perkerasan-jalan.png";
    link.click();
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-xl font-semibold text-center">Perkerasan Jalan</h1>

      <hr className="my-4" />

      <Bar
        id={chartId}
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              label: "",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              data: Object.values(data),
            },
          ],
        }}
        height={100}
        width={100}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />

      <div className="flex justify-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={downloadChart}
        >
          Perkerasan Jalan (PNG)
        </button>
      </div>
    </div>
  );
}
