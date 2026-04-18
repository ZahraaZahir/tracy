import {WorldRepository} from '../repositories/world.repository.js';
import {EntityRepository} from '../repositories/entity.repository.js';
import {InventoryService} from './inventory.service.js';
import {saveStateSchema, SaveStateData} from '../validators/world.validator.js';
import {
  LogicBlockSchema,
  LogicBlock,
} from '../validators/inventory.validator.js';
import {NotFoundError, UnauthorizedError} from '../errors/errors.js';

export class WorldService {
  private worldRepo = new WorldRepository();
  private entityRepo = new EntityRepository();
  private inventoryService = new InventoryService();

  async isEntityFixed(userId: string, entityId: string): Promise<boolean> {
    const save = await this.worldRepo.getWorldState(userId);
    if (!save) return false;
    return save.fixedGlitches.map((g) => g.id).includes(entityId);
  }

  async save(userId: string, rawData: SaveStateData) {
    const validData = saveStateSchema.parse(rawData);
    await this.worldRepo.saveWorldState(userId, validData);
    return await this.load(userId);
  }

  async load(userId: string) {
    const [save, totalEntities] = await Promise.all([
      this.worldRepo.getWorldState(userId),
      this.entityRepo.countAllEntities(),
    ]);

    if (!save) throw new NotFoundError('Save state missing');

    return {
      ...save,
      fixedGlitches: save.fixedGlitches.map((g) => g.id),
      totalEntities,
    };
  }

  async solve(userId: string, entityId: string, answers: Record<string, any>) {
    const entity = await this.entityRepo.getEntityById(entityId);
    if (!entity) throw new NotFoundError(`NPC ${entityId} not found`);

    if (await this.isEntityFixed(userId, entityId)) {
      return {success: true, alreadySolved: true, message: 'Already fixed'};
    }

    const state = await this.worldRepo.getWorldState(userId);
    if (!state) throw new NotFoundError('Save state missing');
    const inventory = Array.isArray(state.inventory)
      ? (state.inventory as LogicBlock[])
      : [];

    const solutions = entity.solutionMap as Record<string, any>;
    const errorMessages = entity.errorMessages as Record<string, any>;
    const usedBlockIds: string[] = [];

    for (const slotId of Object.keys(solutions)) {
      const blockParse = LogicBlockSchema.safeParse(answers[slotId]);
      if (!blockParse.success)
        return {success: false, wrongSlot: slotId, message: 'Invalid block'};

      const playerBlock = blockParse.data;
      if (!inventory.some((b) => b.blockId === playerBlock.blockId)) {
        throw new UnauthorizedError(`Block ${playerBlock.blockId} not owned.`);
      }

      if (
        JSON.stringify(playerBlock.value) !== JSON.stringify(solutions[slotId])
      ) {
        return {
          success: false,
          wrongSlot: slotId,
          message: errorMessages[slotId] || 'Logic mismatch',
        };
      }
      usedBlockIds.push(playerBlock.blockId);
    }

    await this.inventoryService.consumeBlocks(
      userId,
      usedBlockIds,
      state.version,
    );
    await this.worldRepo.addFixedGlitch(userId, entityId);

    return {success: true, message: 'Fixed!', ...(await this.load(userId))};
  }
}
