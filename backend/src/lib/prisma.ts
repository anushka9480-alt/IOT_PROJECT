import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapterPath = resolveAdapterPath(databaseUrl);
const adapter = new PrismaBetterSqlite3({
  url: adapterPath,
});

function resolveAdapterPath(url: string) {
  if (!url.startsWith('file:')) {
    return url;
  }

  const rawPath = url.slice('file:'.length);
  const normalizedPath =
    process.platform === 'win32' && /^\/[A-Za-z]:\//.test(rawPath)
      ? rawPath.slice(1)
      : rawPath;

  if (path.isAbsolute(normalizedPath)) {
    return normalizedPath;
  }

  return path.resolve(process.cwd(), 'prisma', normalizedPath);
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
