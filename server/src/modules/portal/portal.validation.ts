import { z } from 'zod';

export const portalRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(20).optional(),
});

export const portalLoginOtpSchema = z.object({
  email: z.string().email(),
});

export const portalLoginVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const reportOtpRequestSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional().or(z.literal('')),
  fullName: z.string().min(2).max(120),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['male', 'female']),
  calculation: z.record(z.unknown()),
});

export const reportOtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
