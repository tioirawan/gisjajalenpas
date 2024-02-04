import prisma from "@/libs/prismadb";

type StaHistoryRouteParams = {
  sta: string;
};

export async function GET(
  request: Request,
  { params }: { params: StaHistoryRouteParams }
) {
  const { sta } = params;

  const history = await prisma.staHistory.findMany({
    where: {
      idSta: parseInt(sta),
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

