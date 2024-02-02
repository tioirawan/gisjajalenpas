import prisma from "@/libs/prismadb";

export async function GET() {
  const jalan = await prisma.jalan.findMany({
    include: {
      ruas: true,
    },
  });

  return Response.json(jalan);
}