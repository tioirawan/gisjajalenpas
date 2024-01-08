"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import FeatureSidebar from "./components/FeatureSidebar";
import LayerSidebar from "./components/LayerSidebar";
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

      <main className="flex flex-row flex-grow h-full w-full items-stretch ">
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
