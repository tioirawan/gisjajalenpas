import { Prisma } from "@prisma/client";

export type FeatureWithProperties = Prisma.FeatureGetPayload<{
  include: { properties: true; geometry: true };
}>;

export type FeatureProperty = Prisma.PropertiesGetPayload<{}>;

export type FeatureCollectionFull = Prisma.FeatureCollectionGetPayload<{
  include: {
    features: {
      include: {
        properties: true,
        geometry: true,
      },
    }
  },
}>