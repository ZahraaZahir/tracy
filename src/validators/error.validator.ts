import z from 'zod';

export const ErrorMessagesSchema = z.record(z.string(), z.string());

