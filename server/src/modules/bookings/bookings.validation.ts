import { z } from 'zod';

export const contactBookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  serviceType: z.enum([
    'PERSONAL_CONSULTATION',
    'NAME_NUMEROLOGY',
    'LO_SHU_GRID',
    'MOBILE_NUMEROLOGY',
    'BUSINESS_CONSULTATION',
    'COMPLETE_PACKAGE',
  ]),
  message: z.string().max(2000).optional(),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});
