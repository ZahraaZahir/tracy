import {prisma} from '../lib/prisma.js';
import {INITIAL_GAME_STATE} from '../config/game.config.js';

export class UserRepository {
  async findByIdentifier(identifier: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [{email: identifier}, {profile: {username: identifier}}],
      },
      include: {profile: true},
    });
  }

  async createUser(email: string, passwordHash: string, username: string) {
    return await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        profile: {
          create: {username: username},
        },
        saveState: {
          create: {
            posX: INITIAL_GAME_STATE.posX,
            posY: INITIAL_GAME_STATE.posY,
            mapName: INITIAL_GAME_STATE.mapName,
          },
        },
      },
    });
  }
}
