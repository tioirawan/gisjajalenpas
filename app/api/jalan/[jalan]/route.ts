import prisma from "@/libs/prismadb";

type LayerRouteParams = {
  jalan: string;
};

export async function GET(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { jalan } = params;

  const road = await prisma.jalan.findUnique({
    where: {
      id: parseInt(jalan),
    },
    include: {
      ruas: {
        include: {
          sta: true,
        },
      },
    },
  });

  return Response.json(road);
}

export async function DELETE(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { jalan } = params;

  const road = await prisma.jalan.delete({
    where: {
      id: parseInt(jalan),
    },
  });

  return Response.json(road);
}

export async function PATCH(
  request: Request,
  { params }: { params: LayerRouteParams }
) {
  const { jalan } = params;
  const body = await request.json();

  const feature = await prisma.jalan.update({
    where: {
      id: parseInt(jalan),
    },
    data: {
      ...body,
    },
  });

  return Response.json(feature);
}
