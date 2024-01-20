import { Tab, Transition } from "@headlessui/react";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// import "react-tabs/style/react-tabs.css";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import { updateFeatureProperty } from "../../actions";
import useLayersStore from "../../stores/layers_store";
import useSelectedFeatureStore from "../../stores/selected_feature_store";
import AdminOnly from "../AdminOnly";
import FeaturePropertiesHistory from "./FeaturePropertiesHistory";
import FeaturePropertyDetail from "./FeaturePropertyDetail";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function FeatureSidebar() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFeature, setSelectedFeature } = useSelectedFeatureStore(
    (selectedFeature) => ({
      selectedFeature: selectedFeature.selectedFeature,
      setSelectedFeature: selectedFeature.setSelectedFeature,
    })
  );

  const loadLayer = useLayersStore((state) => state.loadLayer);

  const property = (selectedFeature?.properties[0]?.data ?? {}) as Record<
    string,
    any
  >;

  const titleCandidates = Object.values(property);
  const title = property?.Jdl ?? titleCandidates[0] ?? "Feature";

  return (
    <aside
      className={`
        ${selectedFeature ? "w-1/5 p-4 shrink-0" : "w-0 p-0"}
        transition-all duration-500 ease-in-out
        overflow-y-auto 
        border-r
        h-full  bg-white`}
    >
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">{title}</h1>

        <button
          className="text-xl font-bold"
          onClick={() => {
            setSelectedFeature(null);
          }}
        >
          <IoClose />
        </button>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1  p-1">
          <Tab
            key="tab_data"
            className={({ selected }) =>
              classNames(
                "w-full py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                selected
                  ? "bg-white text-gray-700 border-b-4 border-green-500"
                  : "text-gray-500 hover:bg-white/[0.12] hover:text-green-500"
              )
            }
          >
            Data
          </Tab>

          <Tab
            key="tab_riwayat"
            className={({ selected }) =>
              classNames(
                "w-full py-2.5 text-sm font-medium leading-5",
                "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                selected
                  ? "bg-white text-gray-700 border-b-4 border-green-500"
                  : "text-gray-500 hover:bg-white/[0.12] hover:text-green-500"
              )
            }
          >
            Riwayat
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel key="tab_data" className="py-4">
            <Transition
              appear
              show={true}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <AdminOnly>
                <button
                  className={`mb-4 w-full py-2 pl-4 pr-2 rounded  flex justify-between items-center ${
                    isEditing ? "bg-red-500" : "bg-green-700"
                  } transition-all duration-300`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <p className="text-white text-lg font-bold">
                    {isEditing ? "Batal" : "Edit"}
                  </p>
                  <div className="p-2 bg-white rounded">
                    {isLoading ? (
                      <Oval
                        visible={true}
                        height="16"
                        width="16"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        strokeWidth={4}
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    ) : isEditing ? (
                      <IoClose className="text-red-500" />
                    ) : (
                      <FaPencilAlt className="text-green-700" />
                    )}
                  </div>
                </button>
              </AdminOnly>

              <FeaturePropertyDetail
                key={selectedFeature?.id}
                property={selectedFeature?.properties[0]}
                isEditing={isEditing}
                onSave={async (
                  data,
                  newPhotos,
                  updatedPhotos,
                  deletedPhotos
                ) => {
                  setIsEditing(false);

                  setIsLoading(true);
                  const property = await updateFeatureProperty(
                    selectedFeature?.id!,
                    data,
                    selectedFeature?.properties[0]?.photos ?? [],
                    updatedPhotos,
                    deletedPhotos
                  );

                  for (const photo of newPhotos) {
                    const formData = new FormData();
                    formData.append("file", photo.file);
                    formData.append("description", photo.description);

                    const response = await fetch(
                      `/api/properties/${property.id}/photos`,
                      {
                        method: "POST",
                        body: formData,
                      }
                    );

                    if (!response.ok) {
                      return null;
                    }
                  }

                  const newLayer = await loadLayer(
                    selectedFeature?.featureCollectionId!
                  );

                  setSelectedFeature(
                    newLayer.features.find((f) => f.id === selectedFeature?.id)!
                  );
                  setIsLoading(false);
                }}
              />
            </Transition>
          </Tab.Panel>

          <Tab.Panel key="tab_riwayat" className="py-4">
            <Transition
              appear
              show={true}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {selectedFeature && (
                <FeaturePropertiesHistory feature={selectedFeature!} />
              )}
            </Transition>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </aside>
  );
}
