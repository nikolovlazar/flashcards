import { PrismaClient } from '@prisma/client';

import users from './data/users.json';
import categories from './data/categories.json';
import flashcards from './data/flashcards.json';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({ data: users });
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
