import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stations = await prisma.station.createMany({
    data: [
      {
        name: '시청역 4번출구점',
        address: '서울특별시 중구 시청역 근처',
        latitude: 37.566809,
        longitude: 126.977518,
        initial_umbrella_count: 30,
        current_umbrella_count: 30,
        max_umbrella_capacity: 50,
      },
      {
        name: '시청역 7번출구점',
        address: '서울특별시 중구 시청역 근처',
        latitude: 37.564344,
        longitude: 126.977249,
        initial_umbrella_count: 30,
        current_umbrella_count: 30,
        max_umbrella_capacity: 50,
      },
      // 추가 스테이션도 여기 배열에 계속 넣으면 됨
    ],
    skipDuplicates: true, // 같은 name이 있으면 무시
  });
  console.log('✅ Station created:', stations);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
