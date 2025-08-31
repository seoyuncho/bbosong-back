import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function deleteAllUmbrellaTraces() {
  try {
    const result = await prisma.umbrellatraces.deleteMany({});
    console.log(`Deleted ${result.count} rows from umbrellatraces`);
  } catch (error) {
    console.error("Error deleting umbrellatraces:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUmbrellaTraces();