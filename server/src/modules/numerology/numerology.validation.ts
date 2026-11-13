import { z } from 'zod';

export const numerologyCalculateSchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fullName: z.string().min(2).max(120).optional(),
  gender: z.enum(['male', 'female']).optional(),
});
