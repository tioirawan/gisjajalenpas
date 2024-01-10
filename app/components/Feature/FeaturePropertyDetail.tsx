import { useEffect, useState } from "react";
import { IoAdd, IoTrash } from "react-icons/io5";
import { FeatureProperty } from "../../types";

type FeaturePropertyDetailProp = {
  // feature: FeatureWithProperties | null;
  property: FeatureProperty | undefined;
  isEditing?: boolean;
  onSave?: (data: Record<string, any>) => void;
};
export default function FeaturePropertyDetail({
  property,
  isEditing,
  onSave,
}: FeaturePropertyDetailProp) {
  const [data, setData] = useState<Array<[string, any]>>(
    Object.keys(property?.data ?? {}).map((key) => [
      key,
      (property?.data as any)[key],
    ]) ?? []
  );

  useEffect(() => {
    setData(
      Object.keys(property?.data ?? {}).map((key) => [
        key,
        (property?.data as any)[key],
      ]) ?? []
    );
  }, [isEditing, property?.data]);

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

  const align = isEditing ? "align-middle" : "align-top";

  return (
    <div className="flex flex-col">
      <table className="table-auto text-sm">
        <tbody key={data.length}>
          {data.map((d, i) => (
            <tr key={`${i}`}>
              <td className={`py-1 font-bold text-xs ${align} w-28`}>
                {isEditing ? (
                  <input
                    type="text"
                    name={`key-${i}`}
                    className="border  focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                    defaultValue={d[0]}
                    onChange={onInputChange}
                  />
                ) : (
                  d[0]
                )}
              </td>
              <td className={`py-1 text-xs px-1 ${align}`}>:</td>
              <td
                className={`py-1 text-xs ${align}`}
                colSpan={isEditing ? 2 : 1}
              >
                {/* {values[i]} */}
                {isEditing ? (
                  <textarea
                    name={`value-${i}`}
                    className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-2 py-1 transition-all duration-300"
                    rows={1}
                    defaultValue={d[1]}
                    onChange={onInputChange}
                  />
                ) : (
                  d[1]
                )}
              </td>

              {isEditing && (
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
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* add field button */}
      {isEditing && (
        <div className="flex justify-end pt-2">
          <button
            className="bg-white shadow-lg text-green-700 px-4 py-2 rounded hover:bg-green-800 hover:text-white transition-all duration-300"
            onClick={() => {
              setData([...data, ["", ""]]);
            }}
          >
            <IoAdd />
          </button>
        </div>
      )}

      {/* save button */}
      {isEditing && (
        <div className="flex justify-stretch pt-4">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all duration-300 w-full"
            onClick={() => {
              onSave?.(toJson());
            }}
          >
            Simpan
          </button>
        </div>
      )}
    </div>
  );
}
