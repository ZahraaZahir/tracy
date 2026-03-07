import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';


const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);


const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');


  await prisma.gameEntity.upsert({
    where: { id: 'npc_01' },
    update: {}, 
    create: {
      id: 'npc_01',
      glitchedCode: { 
        visual_mode: 'corrupted', 
        intensity: 0.8, 
        color: '#FF00FF' 
      },
      fixedCode: { 
        visual_mode: 'normal', 
        intensity: 0, 
        color: '#FFFFFF' 
      },
    },
  });

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