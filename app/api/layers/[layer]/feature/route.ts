import prisma from "@/app/libs/prismadb";

type LayerFeatureRouteParams = {
  layer: string;
};

// add feature
export async function POST(request: Request, { params }: { params: LayerFeatureRouteParams }) {
  const { layer } = params;

  // const feature = await prisma.featureCollection.findUnique({
  //   where: {
  //     id: parseInt(layer),
  //   }
  // }).

  const body = await request.json();

  const geometry = body.geometry;
  const properties = body.properties;

  const feature = await prisma.feature.create({
    data: {
      featureCollectionId: parseInt(layer),
      type: "Feature",
      geometry: {
        create: geometry,
      },
      properties: {
        create: [
          {
            data: properties,
          },
        ],
      },
    },
  });

  return Response.json(feature);
}

export async function DELETE(request: Request, { params }: { params: LayerFeatureRouteParams }) {
  const { layer } = params;

  const feature = await prisma.featureCollection.delete({
    where: {
      id: parseInt(layer),
    },
  });

  return Response.json(feature);
}

export async function PATCH(request: Request, { params }: { params: LayerFeatureRouteParams }) {
  const { layer } = params;
  const body = await request.json();

  const feature = await prisma.featureCollection.update({
    where: {
      id: parseInt(layer),
    },
    data: {
      ...body,
    },
  });

  return Response.json(feature);

}