import prisma from "@/libs/prismadb";

type JalanRuasRouteParams = {
  jalan: string;
  ruas: string;
};

export async function GET(request: Request, { params }: { params: JalanRuasRouteParams }) {
  const ruas = await prisma.ruas.findFirst({
    where: {
      nomorRuas: parseInt(params.ruas),
    },
    include: {
      pictures: {
        include: {
          picture: true,
        },
      },
      sta: {
        include: {
          pictures: {
            include: {
              picture: true,
            },
          },
        },
      },
    }
  });

  return Response.json(ruas);
}