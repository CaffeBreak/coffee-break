import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const player = await prisma.player.create({
    data: {
      id: "1111",
      name: "aaaa",
      isDead: false,
      joinedRoomId: undefined,
      role: "PENDING",
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
