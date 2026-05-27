import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
  var prismaDatabaseUrl: string | undefined;
}

// Create a new Prisma client instance if one doesn't exist in the global scope.
// This prevents creating multiple instances of Prisma Client in development and
// avoids failing at import-time when build tooling evaluates the module.
const databaseUrl = process.env.DATABASE_URL;

const prisma =
  globalThis.prisma && globalThis.prismaDatabaseUrl === databaseUrl
    ? globalThis.prisma
    : new PrismaClient(
        databaseUrl
          ? {
              datasources: {
                db: {
                  url: databaseUrl,
                },
              },
            }
          : undefined,
      );

// In development, store the Prisma client instance in the global scope
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
  globalThis.prismaDatabaseUrl = databaseUrl;
}

export default prisma;
