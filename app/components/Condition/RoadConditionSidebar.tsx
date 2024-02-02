/* eslint-disable @next/next/no-img-element */
import useSelectedFeatureStore from "@/app/stores/selected_feature_store";
import useSelectedStaStore from "@/app/stores/selected_sta_store";
import clsx from "clsx";
import { useState } from "react";
import RoadCondition from "./RoadCondition";
import Sta from "./Sta";

export default function RoadConditionSidebar() {
  const [isStaDetail, setIsStaDetail] = useState(false);

  const { selectedFeature, setSelectedFeature } = useSelectedFeatureStore(
    (selectedFeature) => ({
      selectedFeature: selectedFeature.selectedFeature,
      setSelectedFeature: selectedFeature.setSelectedFeature,
    })
  );

  const { selectedSta, setSelectedSta } = useSelectedStaStore(
    (selectedSta) => ({
      selectedSta: selectedSta.selected,
      setSelectedSta: selectedSta.set,
    })
  );

  return (
    <aside
      className={clsx(
        selectedFeature || selectedSta
          ? "lg:w-4/6 xl:w-1/3 w-full p-4 shrink-0"
          : "w-0 p-0",
        "transition-all duration-500 ease-in-out overflow-y-auto border-r h-full  bg-white"
      )}
    >
      <div>
        {selectedSta ? (
          <Sta />
        ) : (
          <RoadCondition setSelectedFeature={setSelectedFeature} />
        )}
      </div>
    </aside>
  );
}
