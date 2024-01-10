import { useState } from "react";
import useLayersStore, { LayerInformation } from "../../stores/layers_store";
import EditForm from "./EditForm";
import ImportForm from "./ImportForm";
import LayersList from "./LayersList";

export default function LayerSidebar() {
  const [isImporting, setIsImporting] = useState(false);
  const [isEditing, setIsEditing] = useState<LayerInformation | null>(null);

  const { layers, isLoading, loadLayers } = useLayersStore((state) => ({
    layers: state.layers,
    isLoading: state.isLoading,
    loadLayers: state.loadLayers,
  }));

  return (
    <aside
      className={`w-1/5 shrink-0
        transition-all duration-500 ease-in-out
        h-full border-l bg-white`}
    >
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
      ) : (
        <LayersList onImporting={setIsImporting} onEdit={setIsEditing} />
      )}
    </aside>
  );
}
