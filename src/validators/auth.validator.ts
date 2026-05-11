import {z} from 'zod';

export const registerSchema = z.object({
  email: z.email('Invalid email address format.'),
  username: z
    .string()
    .min(3, 'Developer ID must be at least 3 characters.')
    .max(20, 'Developer ID cannot exceed 20 characters.')
    .regex(
      /^[a-zA-Z0-9]+$/,
      'Developer ID must contain only letters and numbers (no spaces).',
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(64, 'Password cannot exceed 64 characters.'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Developer ID is required.'),
  password: z.string().min(1, 'Password is required.'),
});
