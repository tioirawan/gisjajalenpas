import { JalanInformation } from "@/app/stores/jalan_store";
import { useState } from "react";
import useLayersStore, { LayerInformation } from "../../stores/layers_store";
import EditForm from "./EditForm";
import ImportForm from "./ImportForm";
import LayersList from "./LayersList";
import RoadEditForm from "./RoadEditForm";

export default function LayerSidebar() {
  const [isImporting, setIsImporting] = useState(false);
  const [isEditing, setIsEditing] = useState<LayerInformation | null>(null);
  const [isRoadEditing, setIsRoadEditing] = useState<JalanInformation | null>(
    null
  );

  const { isVisible, loadLayers, toggleVisibility } = useLayersStore(
    (state) => ({
      loadLayers: state.loadLayers,
      isVisible: state.isVisible,
      toggleVisibility: state.toggleVisibility,
    })
  );

  return (
    <aside
      className={`
        ${isVisible ? "md:w-1/3 xl:w-1/4 2xl:w-1/5 w-full shrink-0" : "w-0 p-0"}
        transition-all duration-500 ease-in-out
        h-full border-l bg-white`}
    >
      <button
        className="md:hidden bg-slate-200 text-slate-800
         w-full text-xl font-bold p-4 "
        onClick={() => {
          toggleVisibility();
        }}
      >
        TUTUP
      </button>
      {isImporting ? (
        <ImportForm
          onSuccess={() => {
            setIsImporting(false);
            loadLayers();
          }}
          onClose={() => {
            setIsImporting(false);
          }}
        />
      ) : isEditing ? (
        <EditForm
          layerInformation={isEditing}
          onClose={() => {
            setIsEditing(null);
          }}
          onSuccess={() => {
            setIsEditing(null);
          }}
        />
      ) : isRoadEditing ? (
        <RoadEditForm
          roadInformation={isRoadEditing}
          onClose={() => {
            setIsRoadEditing(null);
          }}
          onSuccess={() => {
            setIsRoadEditing(null);
          }}
        />
      ) : (
        <LayersList
          onRoadEdit={setIsRoadEditing}
          onImporting={setIsImporting}
          onEdit={setIsEditing}
        />
      )}
    </aside>
  );
}
