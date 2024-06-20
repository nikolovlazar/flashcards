import { PrismaClient } from '@prisma/client';

import { categories } from './data/categories';
import { flashcards } from './data/flashcards';

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
