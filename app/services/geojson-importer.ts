
import prisma from "@/libs/prismadb";
import { PrismaClient } from "@prisma/client";
import { FeatureCollectionType } from "../types";


function tryParseInt(value: string, defaultValue: number | null) {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    return defaultValue;
  }

  return parsed;
}
// SCHEMA
// model FeatureCollection {
//   id        String    @id @default(auto()) @map("_id") @db.ObjectId
//   name      String
//   type      String
//   color     String
//   features  Feature[]
//   createdAt DateTime  @default(now())
// }

// model Feature {
//   id         String       @id @default(auto()) @map("_id") @db.ObjectId
//   type       String
//   properties Properties[]
//   geometry   Geometry[]
//   createdAt  DateTime     @default(now())

//   featureCollectionId String            @db.ObjectId
//   FeatureCollection   FeatureCollection @relation(fields: [featureCollectionId], references: [id])
// }

// model Properties {
//   id        String   @id @default(auto()) @map("_id") @db.ObjectId
//   data      Json
//   createdAt DateTime @default(now())

//   featureId String  @db.ObjectId
//   Feature   Feature @relation(fields: [featureId], references: [id])
// }

// model Geometry {
//   id          String   @id @default(auto()) @map("_id") @db.ObjectId
//   type        String
//   coordinates Json
//   createdAt   DateTime @default(now())

//   featureId String  @db.ObjectId
//   Feature   Feature @relation(fields: [featureId], references: [id])
// }

export type FeatureCollectionDetail = {
  name: string;
  type: FeatureCollectionType,
  color: string;
  weight: number | null;
  dashed: boolean | null;
  radius: number | null;
};

export class GeoJSONImporter {
  private client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  async importGeoJSON(geoJSON: GeoJSON.FeatureCollection, detail: FeatureCollectionDetail) {
    "use server"

    const featureCollection = await this.client.featureCollection.create({
      data: {
        name: detail.name,
        type: detail.type,
        color: detail.color,
        weight: detail.weight,
        dashed: detail.dashed,
        radius: detail.radius,
        features: {
          create: geoJSON.features.map((feature) => ({
            type: feature.type,
            properties: {
              create: [
                {
                  data: feature.properties as any,
                  // baik: tryParseInt(feature.properties?.Kon_Baik_1, null),
                  // sedang: tryParseInt(feature.properties?.Kon_Sdg_1, null),
                  // rusakRingan: tryParseInt(feature.properties?.Kon_Rgn_1, null),
                  // rusakBerat: tryParseInt(feature.properties?.Kon_Rusa_1, null),
                  // mantap: tryParseInt(feature.properties?.Kon_Mntp_1, null),
                  // tidakMantap: tryParseInt(feature.properties?.Kon_T_Mn_1, null),
                  // perkerasan: feature.properties?.Tipe_Ker_1,
                },
              ],
            },
            geometry: {
              create: {
                type: feature.geometry.type,
                coordinates: (feature.geometry as any)?.coordinates ?? [],
              },
            },
          })),
        },
      },
    });

    return featureCollection;
  }

}