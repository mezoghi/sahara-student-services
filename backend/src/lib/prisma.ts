import { PrismaClient } from '@prisma/client';

// Prevent exhausting database connections in development with hot-reload
// and provide a single PrismaClient instance across the app.

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
