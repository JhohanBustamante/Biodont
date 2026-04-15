const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

prisma.$executeRawUnsafe('PRAGMA journal_mode=WAL;').catch(() => {});

module.exports = prisma;