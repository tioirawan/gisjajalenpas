import prisma from "@/libs/prismadb";

export async function GET() {
  const jalan = await prisma.jalan.findMany({
    include: {
      ruas: {
        include: {
          pictures: {
            include: {
              picture: true,
            },
          },
        }
      }
    },
  });

  return Response.json(jalan);
}