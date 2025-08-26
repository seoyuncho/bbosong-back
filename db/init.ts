import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const station = await prisma.station.create({
    data: {
      name: '시청역 점',
      address: '서울특별시 중구 시청역 근처', // 원하는 주소 입력
      initial_umbrella_count: 30,
      current_umbrella_count: 30, // 초기 값은 initial과 동일하게
      max_umbrella_capacity: 50,  // 필요하면 수정
    },
  });

  console.log('✅ Station created:', station);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
