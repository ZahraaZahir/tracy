import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';

export class AuthService {
  private userRepo = new UserRepository();

  async register(email: string, pass: string, username: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('USER_ALREADY_EXISTS');
    }

    const hash = await argon2.hash(pass);
    const newUser = await this.userRepo.createUser(email, hash, username);

    const token = jwt.sign(
      { userId: newUser.id }, 
      process.env.JWT_SECRET || 'dev-secret', 
      { expiresIn: '7d' }
    );

    return { token, username };
  }
  async login(email: string, pass: string) {

  const user = await this.userRepo.findByEmail(email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }


  const isPasswordValid = await argon2.verify(user.passwordHash, pass);
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  // 3. Reward: Give them a new Passport (JWT)
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );

  return { token, username: user.profile?.username };
}
}