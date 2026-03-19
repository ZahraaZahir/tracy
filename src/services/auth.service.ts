import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {UserRepository} from '../repositories/user.repository.js';
import {ConflictError, UnauthorizedError} from '../errors/errors.js';

export class AuthService {
  private userRepo = new UserRepository();
  private readonly jwtSecret: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    this.jwtSecret = secret;
  }

  async register(email: string, pass: string, username: string) {
    const existingEmail = await this.userRepo.findByIdentifier(email);
    const existingUsername = await this.userRepo.findByIdentifier(username);

    if (existingEmail || existingUsername) {
      throw new ConflictError('Email or username already exists');
    }

    const hash = await argon2.hash(pass);
    const newUser = await this.userRepo.createUser(email, hash, username);

    const token = jwt.sign({userId: newUser.id}, this.jwtSecret, {
      expiresIn: '7d',
    });

    return {token, username};
  }

  async login(identifier: string, pass: string) {
    const user = await this.userRepo.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, pass);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign({userId: user.id}, this.jwtSecret, {
      expiresIn: '7d',
    });

    return {token, username: user.profile?.username};
  }
}
