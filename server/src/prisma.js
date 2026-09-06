import { PrismaClient } from '@prisma/client';

const prisma = globalThis.shoplyPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.shoplyPrisma = prisma;
}

export default prisma;
