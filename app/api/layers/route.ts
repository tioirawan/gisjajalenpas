import prisma from "@/app/libs/prismadb";

export async function GET() {
  const features = await prisma.featureCollection.findMany({
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

  return Response.json(features);
}