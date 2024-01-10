"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import FeatureSidebar from "./components/Feature/FeatureSidebar";
import LayerSidebar from "./components/Layer/LayerSidebar";
import NavBar from "./components/NavBar";
import useLayersStore from "./stores/layers_store";

const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => <p className="align-middle">Loading...</p>,
  ssr: false,
});

export default function Home() {
  const loadLayers = useLayersStore((state) => state.loadLayers);

  useEffect(() => {
    loadLayers();
  }, [loadLayers]);

  return (
    <div className="flex flex-col items-stretch h-screen">
      <NavBar />

      <main
        className="flex flex-row flex-grow w-full items-stretch "
        // minus the height of the navbar
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <FeatureSidebar />

        <div className="flex-grow bg-teal-400 w-full relative flex justify-center items-center">
          {/* test */}
          <DynamicMap />
        </div>

        <LayerSidebar />
      </main>
    </div>
  );
}
