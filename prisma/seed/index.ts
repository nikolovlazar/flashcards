import { PrismaClient } from "@prisma/client";

import { flashcards, categories } from "./data";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({ data: categories });
  await prisma.flashcard.createMany({ data: flashcards });
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
