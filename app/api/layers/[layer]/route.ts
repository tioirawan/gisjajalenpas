import prisma from "@/libs/prismadb";

type LayerRouteParams = {
  layer: string;
};

export async function GET(request: Request, { params }: { params: LayerRouteParams }) {
  const { layer } = params;

  const feature = await prisma.featureCollection.findUnique({
    where: {
      id: parseInt(layer),
    },
    include: {
      features: {
        include: {
          properties: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              photos: true,
            }
          },
          geometry: {
            orderBy: { createdAt: "desc" },
            take: 1,
          }
        },
      }
    },
  });

  return Response.json(feature);
}

export async function DELETE(request: Request, { params }: { params: LayerRouteParams }) {
  const { layer } = params;

  const feature = await prisma.featureCollection.delete({
    where: {
      id: parseInt(layer),
    },
  });

  return Response.json(feature);
}

export async function PATCH(request: Request, { params }: { params: LayerRouteParams }) {
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