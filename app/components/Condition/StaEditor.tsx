import { IoAdd, IoTrash } from "react-icons/io5";
import { staDetailDummy } from "./dummies";

export default function StaEditor() {
  return (
    <div className="flex flex-col">
      <table className="table-auto text-sm">
        <tbody>
          {staDetailDummy.map((item, index) => (
            <tr key={index}>
              <td className={`py-1 font-bold text-xs w-28`}>
                <input
                  type="text"
                  className="border  focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  defaultValue={item.title}
                />
              </td>
              <td className={`py-1 text-xs px-1`}>:</td>
              <td className={`py-1 text-xs`} colSpan={2}>
                <textarea
                  className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  rows={1}
                  defaultValue={item.value}
                />
              </td>

              <td className={`pl-2 py-1 px-1`}>
                {item.title !== "RENCANA ANGGARAN" && (
                  <button className="text-red-500 hover:text-red-800 transition-all duration-300">
                    <IoTrash />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* add field button */}
      <div className="flex justify-end pt-2">
        <button
          className="bg-white shadow-lg text-green-700 px-4 py-2 rounded hover:bg-green-800 hover:text-white transition-all duration-300"
          // prevent submit
          type="button"
        >
          <IoAdd />
        </button>
      </div>

      {/* photos editor, can remove or add photos and can also add description */}
      <h1 className="text-sm font-bold mt-4 mb-2">Foto</h1>

      <div className="grid grid-cols-2 gap-2">
        {0 === 0 && (
          <div className="w-full">
            <span className="text-xs text-gray-500">Tidak ada foto</span>
          </div>
        )}
      </div>

      {/* add photo button */}
      <div className="w-full pt-4">
        <label
          htmlFor="photo"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo"
            // onChange={(e) => {
            //   const files = [];

            //   for (let i = 0; i < e.target.files!.length; i++) {
            //     const file = e.target.files![i];

            //     files.push({
            //       file,
            //       description: "",
            //     });
            //   }

            //   setPhotos([...photos, ...files]);
            //   newPhotos.current = [...newPhotos.current, ...files];
            // }}
          />
          Tambah Foto
        </label>
      </div>

      {/* save button */}
      <div className="flex justify-stretch pt-4">
        <button
          // className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full"
          className={
            "bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full"
          }
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
