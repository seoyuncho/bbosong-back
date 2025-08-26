// e.g. src/scripts/reset-db.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function resetDB() {
  // 삭제 순서 중요 (FK 제약 고려)
  await prisma.umbrella.deleteMany();
  await prisma.station.deleteMany();
  // 다른 테이블 있으면 여기도 추가

  console.log("✅ All data deleted, schema remains intact");
}

resetDB().finally(() => prisma.$disconnect());
