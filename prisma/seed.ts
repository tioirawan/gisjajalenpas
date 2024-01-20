const { PrismaClient } = require('@prisma/client');
const { hash } = require("bcrypt");

const client = new PrismaClient();

async function main() {
  const user = await client.user.create({
    data: {
      username: "admin",
      password: await hash("admin", 10),
      role: "ADMIN",
    },
  });

  console.log(user);
}

console.log("Seeding...");

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
