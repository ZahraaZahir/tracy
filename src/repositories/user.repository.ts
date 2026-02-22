import { prisma } from '../lib/prisma.js';

export class UserRepository {

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
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