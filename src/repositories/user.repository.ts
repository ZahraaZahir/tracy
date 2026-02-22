import { prisma } from '../lib/prisma.js';

export class UserRepository {

async findByIdentifier(identifier: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { profile: { username: identifier } }
      ]
    },
    include: { profile: true }
  });
}

  async createUser(email: string, passwordHash: string, username: string) {
    return await prisma.user.create({
      data: {
        email: email,
        passwordHash: passwordHash,
        profile: {
          create: { username: username }
        }
      }
    });
  }
}