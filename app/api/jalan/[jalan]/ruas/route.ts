import prisma from "@/libs/prismadb";

type JalanRuasRouteParams = {
  jalan: string;
};

export async function GET(request: Request, { params }: { params: JalanRuasRouteParams }) {
  const { jalan } = params;

  const ruas = await prisma.ruas.findMany({
    where: {
      idJalan: parseInt(jalan),
    },
  });

  return Response.json(ruas);
}