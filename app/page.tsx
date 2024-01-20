"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Puff } from "react-loader-spinner";
import AdminOnly from "./components/AdminOnly";
import AuthenticatedOnly from "./components/AuthenticatedOnly";
import FeatureSidebar from "./components/Feature/FeatureSidebar";
import LayerSidebar from "./components/Layer/LayerSidebar";
import NavBar from "./components/NavBar";
import useLayersStore from "./stores/layers_store";

const DynamicMap = dynamic(() => import("./components/Map"), {
  loading: () => (
    <Puff
      visible={true}
      height="40"
      width="40"
      color="#4fa94d"
      ariaLabel="puff-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  ),
  ssr: false,
});

const DynamicCreateRoadSidebar = dynamic(
  () => import("./components/Road/CreateRoadSidebar"),
  {
    ssr: false,
  }
);

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
        <AuthenticatedOnly>
          <FeatureSidebar />
        </AuthenticatedOnly>

        <AdminOnly>
          <DynamicCreateRoadSidebar />
        </AdminOnly>

        <div className="flex-grow bg-slate-100 w-full relative flex justify-center items-center">
          {/* test */}
          <DynamicMap />
        </div>

        <LayerSidebar />
      </main>
    </div>
  );
}
