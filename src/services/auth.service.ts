import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { ConflictError, UnauthorizedError } from '../errors/errors.js';

export class AuthService {
  private userRepo = new UserRepository();

  async register(email: string, pass: string, username: string) {
    const existingEmail = await this.userRepo.findByIdentifier(email);
    const existingUsername = await this.userRepo.findByIdentifier(username);

    if (existingEmail || existingUsername) {
      throw new ConflictError('Email or username already exists');
    }

    const hash = await argon2.hash(pass);
    const newUser = await this.userRepo.createUser(email, hash, username);

    const token = jwt.sign(
      { username: username }, 
      process.env.JWT_SECRET!, 
      { subject: newUser.id, expiresIn: '7d' }
    );

    return { token, username, userId: newUser.id };
  }

  async login(identifier: string, pass: string) {
    const user = await this.userRepo.findByIdentifier(identifier);

    if (!user || !(await argon2.verify(user.passwordHash, pass))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const username = user.profile?.username || 'Unknown';
    const token = jwt.sign(
      { username: username }, 
      process.env.JWT_SECRET!, 
      { subject: user.id, expiresIn: '7d' }
    );

    return { token, username, userId: user.id };
  }
}