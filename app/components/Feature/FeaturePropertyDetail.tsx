/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { FeatureProperty } from "../../types";
import FeaturePropertyEditor from "../FeaturePropertyEditor";

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
      {isEditing ? (
        <FeaturePropertyEditor
          initialData={toJson()}
          photos={property?.photos ?? []}
          isLoading={false}
          onSave={onSave}
        />
      ) : (
        <>
          <table className="table-auto text-sm">
            <tbody key={data.length}>
              {data.map((d, i) => (
                <tr key={`${i}`}>
                  <td className={`py-1 font-bold text-xs ${align} w-28`}>
                    {d[0]}
                  </td>
                  <td className={`py-1 text-xs px-1 ${align}`}>:</td>
                  <td className={`py-1 text-xs ${align}`}>{d[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* images */}
          <h1 className="text-sm font-bold mt-4 mb-2">Foto</h1>

          <div className="grid grid-cols-2 gap-1">
            {property?.photos?.length === 0 && (
              <div className="w-full p-1">
                <span className="text-xs text-gray-500">Tidak ada foto</span>
              </div>
            )}

            {property?.photos?.map((photo, i) => (
              <div
                key={i}
                className="flex flex-col justify-center items-center"
              >
                <img
                  src={photo.url}
                  alt={photo.description ?? ""}
                  className="w-full h-32 object-cover rounded"
                />

                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {photo.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
