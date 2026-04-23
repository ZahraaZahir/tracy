import {prisma, pool} from '../src/lib/prisma.js';

async function main() {
  console.log('Seeding NPCs...');

  const puzzles = [
    {
      id: 'npc_cow_01',
      templateCode:
        'class Cow(Entity):\n  var mass = 50\n  var gravity = {{s1:0}}\n  var velocity_y = 0\n  def apply_physics(self):\n    self.velocity_y += self.gravity\n    self.position_y += self.velocity_y\n    if self.position_y >= 300:\n      self.position_y = 300\n      self.velocity_y = 0',

      solutionMap: {s1: {type: 'float', value: 9.81}},

      errorMessages: {
        s1: 'The cow is still defying gravity! Check the gravity constant.',
      },
    },
    {
      id: 'npc_girl_farmer_01',
      templateCode:
        'class Farmer(Entity):\n  def update_movement(self):\n    self.move_right = true\n    self.move_left = {{s1:true}}',

      solutionMap: {s1: {type: 'boolean', value: false}},

      errorMessages: {
        s1: 'Logic Conflict: A character cannot move left and right simultaneously.',
      },
    },
    {
      id: 'npc_mouse_01',
      templateCode:
        'class Garden(Entity):\n  def update(self):\n    var selected_seed = {{s1:null}}\n    if selected_seed != null:\n       self.spawn_object(selected_seed)\n    else\n      return',

      solutionMap: {s1: {type: 'string', value: 'Sunflower'}},

      errorMessages: {
        s1: 'The soil remains empty. Tracy, the mouse needs to plant these Sunflowers!',
      },
    },
  ];

  for (const p of puzzles) {
    await prisma.gameEntity.upsert({
      where: {id: p.id},
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
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
