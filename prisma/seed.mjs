import { PrismaClient } from "../src/generated/prisma/index.js";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // 2명의 유저 생성
  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username() + i,
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password(),
        bio: faker.lorem.sentence(),
      },
    });
    console.log("생성된 유저:", user);
    // 각 유저마다 3개의 트윗 생성
    for (let j = 0; j < 3; j++) {
      const tweet = await prisma.tweet.create({
        data: {
          tweet: faker.lorem.sentence(),
          userId: user.id,
        },
      });
      console.log("생성된 트윗:", tweet);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
