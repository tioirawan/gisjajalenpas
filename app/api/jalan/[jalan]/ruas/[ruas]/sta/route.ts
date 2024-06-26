import prisma from "@/libs/prismadb";

type JalanRuasSTARouteParams = {
  jalan: string;
  ruas: string;
};

export async function GET(
  request: Request,
  { params }: { params: JalanRuasSTARouteParams }
) {
  const { jalan, ruas } = params;

  const sta = await prisma.sta.findMany({
    where: {
      nomorRuas: parseInt(ruas),
    },
    include: {
      pictures: {
        include: {
          picture: true,
        },
      },
    },
  });

  return Response.json(sta);
}
