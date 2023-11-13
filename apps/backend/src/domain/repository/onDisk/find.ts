import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const player = await prisma.player.findUnique({
    where: {
      id: "1111",
    },
  });
  console.log(player);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
