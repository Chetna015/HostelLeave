import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
  var prismaDatabaseUrl: string | undefined;
}

// Create a new Prisma client instance if one doesn't exist in the global scope
// This prevents creating multiple instances of Prisma Client in development
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

if (!directDatabaseUrl) {
  throw new Error('DIRECT_DATABASE_URL or DATABASE_URL is required');
}

const prisma =
  global.prisma && global.prismaDatabaseUrl === directDatabaseUrl
    ? global.prisma
    : new PrismaClient({
        datasources: {
          db: {
            url: directDatabaseUrl,
          },
        },
      });

// In development, store the Prisma client instance in the global scope
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
  global.prismaDatabaseUrl = directDatabaseUrl;
}

export default prisma;
