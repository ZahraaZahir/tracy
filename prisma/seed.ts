import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Game Entities with Puzzle Logic...');
  const puzzles = [
    {
      id: 'npc_cow_01',
      glitched: { gravity: 0, floating: true },
      fixed: { gravity: 9.8, floating: false }
    },
    {
      id: 'npc_girl_farmer_01',
      glitched: { move_speed: 0, animation: "frozen" },
      fixed: { move_speed: 100, animation: "walk" }
    },
    {
      id: 'npc_mouse_01',
      glitched: { size_multiplier: 10 },
      fixed: { size_multiplier: 1 }
    }
  ];

  for (const p of puzzles) {
    await prisma.gameEntity.upsert({
      where: { id: p.id },
      update: { 
        glitchedCode: p.glitched, 
        fixedCode: p.fixed 
      },
      create: { 
        id: p.id, 
        glitchedCode: p.glitched, 
        fixedCode: p.fixed 
      },
    });
  }

  console.log('Seed complete. 3 NPCs initialized.');
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