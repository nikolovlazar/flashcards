import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Otherwise, a new client will be created on every reload
  // @ts-ignore
  global["prisma"] = global["prisma"] || new PrismaClient({ adapter });
  // @ts-ignore
  prisma = global["prisma"];
}

export default prisma;
