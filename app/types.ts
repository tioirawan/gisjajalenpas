import { Prisma } from "@prisma/client";

export type FeatureCollectionType = "road" | "bridge" | "area";

export type FeatureWithProperties = Prisma.FeatureGetPayload<{
  include: {
    properties: {
      include: { photos: true };
    };
    geometry: true;
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
        };
        geometry: true;
      };
    };
  };
}>;

export type NewPhoto = {
  file: File;
  description: string;
};

export type UserRole = "ADMIN" | "OPERATOR" | "OPD";

export type JalanWithRuas = Prisma.JalanGetPayload<{
  include: {
    ruas: true;
  };
}>;

export type RuasWithSta = Prisma.RuasGetPayload<{
  include: {
    sta: {
      include: {
        pictures: {
          include: {
            picture: true;
          };
        }
      };
    }
  };
}>;

export type StaWithPictures = Prisma.StaGetPayload<{
  include: {
    pictures: {
      include: {
        picture: true;
      };
    }
  };
}>;

export type StaPicture = Prisma.PicturesOnStaGetPayload<{
  include: {
    picture: true;
  };
}>;

export type StaHistoryWithPictures = Prisma.StaHistoryGetPayload<{
  include: {
    pictures: {
      include: {
        picture: true;
      };
    };
  };
}>;

export type StaHistoryPicture = Prisma.PicturesOnStaHistoryGetPayload<{
  include: {
    picture: true;
  };
}>;