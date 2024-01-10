import { useCallback, useEffect, useState } from "react";
import { IoAdd, IoTrash } from "react-icons/io5";

type FeaturePropertyEditorProps = {
  initialData?: Record<string, any>;
  isLoading?: boolean;
  onSave?: (data: Record<string, any>) => void;
};

export default function FeaturePropertyEditor(
  props: FeaturePropertyEditorProps
) {
  const toArray = useCallback(
    (data?: Record<string, any>): Array<[string, any]> => {
      return (
        Object.keys(data ?? {}).map((key) => [key, (data as any)[key]]) ?? []
      );
    },
    []
  );

  const [data, setData] = useState<Array<[string, any]>>(
    toArray(props.initialData)
  );

  useEffect(() => {
    setData(toArray(props.initialData));
  }, [props.initialData, toArray]);

  function onInputChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    // update data, wether it's the key or the value
    const [key, index] = e.target.name.split("-");
    const i = parseInt(index);
    const value = e.target.value;

    const newData = [...data];

    if (key === "key") {
      newData[i][0] = value;
    } else {
      newData[i][1] = value;
    }

    setData(newData);
  }

  function toJson() {
    return data
      .filter(([key, value]) => key !== "")
      .reduce((acc: Record<string, any>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  const align = "align-middle";

  return (
    <div className="flex flex-col">
      <table className="table-auto text-sm">
        <tbody key={data.length}>
          {data.map((d, i) => (
            <tr key={`${i}`}>
              <td className={`py-1 font-bold text-xs ${align} w-28`}>
                <input
                  type="text"
                  name={`key-${i}`}
                  className="border  focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  defaultValue={d[0]}
                  onChange={onInputChange}
                />
              </td>
              <td className={`py-1 text-xs px-1 ${align}`}>:</td>
              <td className={`py-1 text-xs ${align}`} colSpan={2}>
                <textarea
                  name={`value-${i}`}
                  className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                  rows={1}
                  defaultValue={d[1]}
                  onChange={onInputChange}
                />
              </td>

              <td className={`pl-2 py-1 px-1 ${align}`}>
                <button
                  className="text-red-500 hover:text-red-800 transition-all duration-300"
                  onClick={() => {
                    const newData = [...data];

                    newData.splice(i, 1);

                    setData(newData);
                  }}
                >
                  <IoTrash />
                </button>
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
          onClick={() => {
            setData([...data, ["", ""]]);
          }}
        >
          <IoAdd />
        </button>
      </div>

      {/* save button */}
      <div className="flex justify-stretch pt-4">
        <button
          // className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full"
          className={
            "bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full" +
            (props.isLoading ? " opacity-50" : "")
          }
          onClick={
            props.isLoading
              ? undefined
              : () => {
                  props.onSave?.(toJson());
                }
          }
        >
          {props.isLoading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
