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
          sta: {
            include: {
              pictures: {
                include: {
                  picture: true,
                }
              },
            },
          }
        },
      },
    },
  });

  return Response.json(road);
}
