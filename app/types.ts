import { Prisma } from "@prisma/client";

export type FeatureCollectionType = 'road' | 'bridge' | 'area';

export type FeatureWithProperties = Prisma.FeatureGetPayload<{
  include: {
    properties: {
      include: { photos: true };
    }; geometry: true
  };
}>;

export type FeatureProperty = Prisma.PropertiesGetPayload<{
  include: { photos: true };
}>;

export type FeatureCollectionFull = Prisma.FeatureCollectionGetPayload<{
  include: {
    features: {
      include: {
        properties: {
          include: {
            photos: true;
          };
        },
        geometry: true,
      },
    }
  },
}>

export type NewPhoto = {
  file: File;
  description: string;
};

export type UserRole = 'ADMIN' | 'OPERATOR' | 'OPD';