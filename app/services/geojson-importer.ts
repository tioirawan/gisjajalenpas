
import prisma from "@/libs/prismadb";
import { PrismaClient } from "@prisma/client";
import { FeatureCollectionType } from "../types";


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
                  data: feature.properties as any
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