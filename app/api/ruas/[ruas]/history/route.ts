import prisma from "@/libs/prismadb";

type RuasHistoryRouteParams = {
  ruas: string;
};

export async function GET(
  request: Request,
  { params }: { params: RuasHistoryRouteParams }
) {
  const { ruas } = params;

  const history = await prisma.ruasHistory.findMany({
    where: {
      nomorRuas: parseInt(ruas),
    },
    orderBy: { createdAt: "desc" },
    include: {
      pictures: {
        include: {
          picture: true,
        },
      },
    },
  });

  return Response.json(history);
}

