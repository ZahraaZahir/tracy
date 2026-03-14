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
    templateCode: 'var gravity = {{s1}}\nif gravity < 1:\n    status = "floating"',
    solutionMap: { s1: 9.8 },
    errorMessages: { s1: "Cows need Earth gravity to stay grounded!" }
  },
  {
    id: 'npc_mouse_01',
    templateCode: 'func update():\n    size = {{s1}}\n    speed = 10',
    solutionMap: { s1: 1 },
    errorMessages: { s1: "The mouse is too big for its holes!" }
  }
];

for (const p of puzzles) {
  await prisma.gameEntity.upsert({
    where: { id: p.id },
    update: { templateCode: p.templateCode, solutionMap: p.solutionMap, errorMessages: p.errorMessages },
    create: { id: p.id, templateCode: p.templateCode, solutionMap: p.solutionMap, errorMessages: p.errorMessages }
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