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
  weight: z.preprocess((value) => parseInt(value as string), z.number()),
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

  const importer = new GeoJSONImporter();

  // import geojson
  await importer.importGeoJSON(json, {
    name: data.data.name,
    type: data.data.type,
    color: data.data.color,
    weight: data.data.weight,
    dashed: data.data.dashed,
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