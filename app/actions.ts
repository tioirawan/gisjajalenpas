'use server'

import prisma from "@/app/libs/prismadb";
import { z } from "zod";
import { GeoJSONImporter } from "./services/geojson-importer";

// export async function saveGeoJSON(data: GeoJSON.FeatureCollection, detail: FeatureCollectionDetail) {
//   const importer = new GeoJSONImporter();

//   // import geojson
//   await importer.importGeoJSON(data, detail);
// }
// import { useState } from "react";

// type ImportFormProps = {
//   onSuccess: () => void;
// };


const MAX_FILE_SIZE = 10000000;
const ACCEPTED_TYPES = ["application/geo+json"];

const schema = z.object({
  file: z.any()
    .refine((files) => files?.length == 1, "Geojson file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      ".geojson file are accepted."
    ),
  name: z.string({
    required_error: "Name is required.",
  }).min(3, "Name must be at least 3 characters."),
  type: z.enum(["road", "bridge", "area"]),
  color: z.string(),

  // weight is requred only if type is road or area and will be null if type is bridge
  weight: z.preprocess((value) => isNaN(parseInt(value as string)) ? null : parseInt(value as string), z.number().nullable()),
  // radius is required only if type is bridge, and will be null if type is road or area
  radius: z.preprocess((value) => isNaN(parseInt(value as string)) ? null : parseInt(value as string), z.number().nullable()),

  dashed: z.preprocess((value) => value === "on", z.boolean()),
});

export type ImportFormState = {
  error: Record<string, string> | null;
  success: boolean;
};
export async function saveGeoJSON(prevState: ImportFormState | null, formData: FormData): Promise<ImportFormState> {
  const data = schema.safeParse({
    file: formData.getAll("file"),
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
    weight: formData.get("weight"),
    radius: formData.get("radius"),
    dashed: formData.get("dashed"),
  });

  if (!data.success) {
    return {
      error: data.error.flatten().fieldErrors as Record<string, string>,
      success: false,
    };
  }

  // read file
  const file = data.data.file[0];
  const fileContent = await file.text();
  const json = JSON.parse(fileContent);

  // check if file is valid geojson
  if (json.type !== "FeatureCollection") {
    return {
      error: {
        file: "Invalid geojson file.",
      },
      success: false,
    };
  }

  // check if data.type is match with geojson features type
  const featureTypes = json.features.map((feature: any) => feature.geometry.type) as string[];

  const mapper = {
    "road": ["LineString", "MultiLineString"],
    "bridge": ["Point", "MultiPoint"],
    "area": ["Polygon", "MultiPolygon"],
  }
  const inverseMapper: Record<string, string> = {
    "LineString": "Jalan",
    "MultiLineString": "Jalan",
    "Point": "Jembatan",
    "MultiPoint": "Jembatan",
    "Polygon": "Area",
    "MultiPolygon": "Area",
  }
  const matchAll = featureTypes.every((type: string) => mapper[data.data.type].includes(type));

  if (!matchAll) {
    return {
      error: {
        type: `Tipe salah, harap pilih ${inverseMapper[featureTypes[0]]}`,
      },
      success: false,
    };
  }

  const importer = new GeoJSONImporter();

  // import geojson
  await importer.importGeoJSON(json, {
    name: data.data.name,
    type: data.data.type,
    color: data.data.color,
    weight: data.data.weight,
    dashed: data.data.dashed,
    radius: data.data.radius,
  });

  return {
    error: null,
    success: true,
  };
}

// even though this is an update operation, it is actually adding a new property to the database
export async function updateFeatureProperty(featureId: number, data: Record<string, any>) {
  await prisma.properties.create({
    data: {
      data: data,
      featureId: featureId,
    }
  });
}