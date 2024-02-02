/* eslint-disable @next/next/no-img-element */
import { Tab, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import AdminOnly from "../AdminOnly";
import AuthenticatedOnly from "../AuthenticatedOnly";
import ConditionDetail from "./ConditionDetail";
import ConditionEditor from "./ConditionEditior";
import ConditionHistory from "./ConditionHistory";

export default function RoadCondition({
  setIsStaDetail,
  setSelectedFeature,
}: {
  setIsStaDetail: (value: boolean) => void;
  setSelectedFeature: (value: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Kondisi Jalan</h1>

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
              clsx(
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
          <AuthenticatedOnly>
            <Tab
              key="tab_riwayat"
              className={({ selected }) =>
                clsx(
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
          </AuthenticatedOnly>
        </Tab.List>
        <Tab.Panels>
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
                    {isEditing ? (
                      <IoClose className="text-red-500" />
                    ) : (
                      <FaPencilAlt className="text-green-700" />
                    )}
                  </div>
                </button>
              </AdminOnly>
              {isEditing ? (
                <ConditionEditor />
              ) : (
                <ConditionDetail setIsStaDetail={setIsStaDetail} />
              )}
            </Transition>
          </Tab.Panel>
          <AuthenticatedOnly>
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
                <ConditionHistory setIsStaDetail={setIsStaDetail} />
              </Transition>
            </Tab.Panel>
          </AuthenticatedOnly>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}
