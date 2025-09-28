import { PrismaClient } from '@prisma/client';

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = globalThis as GlobalWithPrisma;

export const isDatabaseEnabled = Boolean(process.env.DATABASE_URL);

const createClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

let prismaInstance: PrismaClient | null = null;

if (isDatabaseEnabled) {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  prismaInstance = globalForPrisma.prisma ?? null;
} else if (process.env.NODE_ENV !== 'production') {
  console.warn('[prisma] DATABASE_URL is not configured. Database-backed features are disabled.');
}

const disabledClient = new Proxy({} as PrismaClient, {
  get() {
    throw new Error('Database access attempted, but DATABASE_URL is not configured.');
  },
});

export const prisma = prismaInstance ?? disabledClient;
export const prismaOptional = prismaInstance;

if (process.env.NODE_ENV !== 'production' && prismaInstance) {
  globalForPrisma.prisma = prismaInstance;
}
