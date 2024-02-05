import useSelectedStaStore from "@/app/stores/selected_sta_store";
import { StaHistoryWithPictures, StaWithPictures } from "@/app/types";
import { Dialog, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { Circles } from "react-loader-spinner";
import StaDetail from "./StaDetail";

moment.locale("id");

export default function StaHistory() {
  const sta = useSelectedStaStore((state) => state.selected);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sta) return;

    setLoading(true);

    fetch(`/api/sta/${sta.id}/history`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      });
  }, [sta]);

  return (
    <div className="flex flex-col">
      {loading && (
        <Circles
          height="35"
          width="35"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass="self-center mt-4"
          visible={true}
        />
      )}

      {history.length === 0 && !loading && (
        <p className="text-center mt-4">Tidak ada data</p>
      )}

      <ul className="list-none">
        {history.map((sta: StaHistoryWithPictures) => (
          <HistoryTile key={sta.id} sta={sta} />
        ))}
      </ul>
    </div>
  );
}

type HistoryTileProps = {
  sta: StaHistoryWithPictures;
};
function HistoryTile({ sta }: HistoryTileProps) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <li className="flex justify-between text-sm p-4 my-2 rounded bg-slate-100">
      {moment(sta.createdAt).format("LLL")}
      <button onClick={openModal}>
        <IoEye />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {moment(sta.createdAt).format("LLL")}
                  </Dialog.Title>
                  <div className="mt-2 pt-3 pb-2">
                    <StaDetail sta={sta as unknown as StaWithPictures} />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Tutup
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </li>
  );
}
