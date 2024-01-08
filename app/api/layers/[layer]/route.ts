import prisma from "@/app/libs/prismadb";

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