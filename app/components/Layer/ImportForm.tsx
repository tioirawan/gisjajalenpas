import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ImportFormState, saveGeoJSON } from "../../actions";

type ImportFormProps = {
  onSuccess: () => void;
};

const initialState: ImportFormState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-sm mt-4 transition-all duration-300 ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "Loading..." : "Submit"}
    </button>
  );
}

export default function ImportForm({ onSuccess }: ImportFormProps) {
  const [state, formAction] = useFormState(saveGeoJSON, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <div className="max-w-lg mx-auto overflow-hidden">
      <form
        action={formAction}
        // onSubmit={onSuccess}
        className="max-w-sm mx-auto bg-white rounded shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="file" className="text-gray-700 font-bold block mb-1">
            File
          </label>
          <input
            type="file"
            name="file"
            id="file"
            accept=".geojson"
            className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
          />

          {state.error?.file && (
            <p className="text-red-500 text-sm">{state.error.file}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="text-gray-700 font-bold block mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
          />

          {state.error?.name && (
            <p className="text-red-500 text-sm">{state.error.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="text-gray-700 font-bold block mb-1">
            Type
          </label>
          <select
            name="type"
            id="type"
            className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
          >
            <option value="road">Road</option>
            <option value="bridge">Bridge</option>
            <option value="area">Area</option>
          </select>

          {state.error?.type && (
            <p className="text-red-500 text-sm">{state.error.type}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="color" className="text-gray-700 font-bold block mb-1">
            Color
          </label>
          <input
            type="color"
            name="color"
            id="color"
            className="border focus:border-blue-500 focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
          />

          {state.error?.color && (
            <p className="text-red-500 text-sm">{state.error.color}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="weight"
            className="text-gray-700 font-bold block mb-1"
          >
            Weight
          </label>
          <input
            type="range"
            name="weight"
            id="weight"
            className="border focus:border-blue-500 w-full focus:outline-none rounded-sm px-3 py-2 transition-all duration-300"
            min={1}
            max={5}
            step={1}
          />

          {state.error?.weight && (
            <p className="text-red-500 text-sm">{state.error.weight}</p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="dashed"
              id="dashed"
              className="border border-gray-200 rounded-sm px-2 py-1"
            />
            <label htmlFor="dashed" className="ml-2 text-gray-700">
              Dashed
            </label>
          </div>

          {state.error?.dashed && (
            <p className="text-red-500 text-sm">{state.error.dashed}</p>
          )}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
