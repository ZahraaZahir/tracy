import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {UserRepository} from '../repositories/user.repository.js';

export class AuthService {
  private userRepo = new UserRepository();

  async register(email: string, pass: string, username: string) {
    const existingEmail = await this.userRepo.findByIdentifier(email);
    const existingUsername = await this.userRepo.findByIdentifier(username);

    if (existingEmail || existingUsername) {
      throw new Error('USER_ALREADY_EXISTS');
    }

    const hash = await argon2.hash(pass);

    const newUser = await this.userRepo.createUser(email, hash, username);

    const token = jwt.sign(
      {userId: newUser.id},
      process.env.JWT_SECRET || 'dev-secret',
      {expiresIn: '7d'},
    );

    return {token, username};
  }

  async login(identifier: string, pass: string) {
    const user = await this.userRepo.findByIdentifier(identifier);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, pass);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      {userId: user.id},
      process.env.JWT_SECRET || 'dev-secret',
      {expiresIn: '7d'},
    );

    return {token, username: user.profile?.username};
  }
}
