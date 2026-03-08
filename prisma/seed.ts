import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding NPC IDs into the world...');
  const entities = ['npc_01', 'npc_02', 'glitch_door_01'];

  for (const entityId of entities) {
    await prisma.gameEntity.upsert({
      where: { id: entityId },
      update: {}, 
      create: {
        id: entityId 
      },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });