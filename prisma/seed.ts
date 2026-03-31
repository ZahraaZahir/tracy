import { prisma, pool } from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Seeding NPCs...');

  const puzzles = [
    {
      id: 'npc_cow_01',
      // BUG: -5.0 (Gravity is inverted, cow is flying up)
      templateCode:
        'class Cow(Entity):\n    def apply_physics(self):\n        self.gravity_multiplier = {{s1:-5.0}}\n        self.is_floating = (self.gravity_multiplier == 0)',
      solutionMap: { s1: 1.0 },
      errorMessages: {
        s1: 'The cow is still defying gravity! Check the gravity constant.',
      },
    },
    {
      id: 'npc_girl_farmer_01',
      // BUG: true (Both right and left are true, she is stuck)
      templateCode:
        'class Farmer(Entity):\n    def update_movement(self):\n        self.move_right = true\n        self.move_left = {{s1:true}}\n',
      solutionMap: { s1: false },
      errorMessages: {
        s1: 'Logic Conflict: A character cannot move left and right simultaneously.',
      },
    },
    {
      id: 'npc_mouse_01',
      // BUG: "EMPTY_HANDS" instead of null
      templateCode:
        'class Garden(Entity):\n    def update(self):\n        var active_seed = {{s1:"EMPTY_HANDS"}}\n        # ERROR: Plant() expects SeedObject, received NULL',
      solutionMap: { s1: 'Sunflower' },
      errorMessages: {
        s1: 'The soil remains empty. Tracy, the mouse needs to plant these Sunflowers!',
      },
    },
  ];

  for (const p of puzzles) {
    await prisma.gameEntity.upsert({
      where: { id: p.id },
      update: {
        templateCode: p.templateCode,
        solutionMap: p.solutionMap,
        errorMessages: p.errorMessages,
      },
      create: {
        id: p.id,
        templateCode: p.templateCode,
        solutionMap: p.solutionMap,
        errorMessages: p.errorMessages,
      },
    });
  }

  console.log('Seed complete. All demo NPCs are seeded.');
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