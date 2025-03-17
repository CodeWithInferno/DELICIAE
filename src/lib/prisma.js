import { PrismaClient } from "@prisma/client";

// In Next.js, the `global` object is the same across hot reloads
// in development. We can store a single `PrismaClient` and reuse it.
let globalWithPrisma = global;

let prisma;

if (!globalWithPrisma.prisma) {
  globalWithPrisma.prisma = new PrismaClient({
    log: ["query"], // or ["error", "warn"] etc. if you like
  });
}

prisma = globalWithPrisma.prisma;

export { prisma };
