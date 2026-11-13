import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/errors.js';
import type { PortalTokenPayload } from '../../middleware/portalAuthMiddleware.js';
import { getRaashiFromBirthDate } from '../raashi/raashiCalculator.js';
import type { NumerologyResult } from '../numerology/numerologyCalculator.js';
import { sendEmail } from '../../utils/mail.js';
import { logger } from '../../utils/logger.js';
import { portalUploadsDir, writeNumerologyPdfFile } from './portalPdf.service.js';

function parseUtcDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function signPortalToken(payload: PortalTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function generateOtpCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

export async function registerPortalUser(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}) {
  const existing = await prisma.portalUser.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'An account with this email already exists');
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.portalUser.create({
    data: {
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone ?? null,
    },
    select: { id: true, email: true, fullName: true, phone: true, createdAt: true },
  });
  return { user, token: signPortalToken({ userId: user.id, email: user.email }) };
}

export async function requestLoginOtp(email: string) {
  const otp = generateOtpCode();
  const codeHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otpChallenge.deleteMany({ where: { email, purpose: 'LOGIN' } });
  await prisma.otpChallenge.create({
    data: {
      email,
      codeHash,
      purpose: 'LOGIN',
      payload: {},
      expiresAt,
    },
  });

  await sendEmail({
    to: email,
    subject: `${env.brand.name} — sign-in code`,
    text: `Your Vaidik Theory sign-in code is ${otp}. It is valid for 10 minutes.`,
  });
  logger.dev(`[OTP] login requested for ${email}`);

  return {
    message: 'OTP sent to your email address',
    devOtp: env.nodeEnv === 'development' || env.exposeOtpInDev ? otp : undefined,
  };
}

export async function verifyLoginOtp(email: string, otp: string) {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { email, purpose: 'LOGIN' },
    orderBy: { createdAt: 'desc' },
  });
  if (!challenge || challenge.expiresAt < new Date()) {
    throw new AppError(400, 'OTP expired — please request a new code');
  }
  const otpValid = await bcrypt.compare(otp, challenge.codeHash);
  if (!otpValid) {
    throw new AppError(400, 'Invalid OTP');
  }

  const user = await ensurePortalUser(email);
  await prisma.otpChallenge.delete({ where: { id: challenge.id } });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
    },
    token: signPortalToken({ userId: user.id, email: user.email }),
  };
}

async function ensurePortalUser(email: string, extras?: { fullName?: string; phone?: string | null; dateOfBirth?: Date }) {
  const existing = await prisma.portalUser.findUnique({ where: { email } });
  if (existing) {
    return existing;
  }
  return prisma.portalUser.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 12),
      fullName: extras?.fullName ?? null,
      phone: extras?.phone ?? null,
      dateOfBirth: extras?.dateOfBirth ?? null,
    },
  });
}

export async function getPortalProfile(userId: string) {
  const user = await prisma.portalUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      dateOfBirth: true,
      createdAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

export async function listPortalRecords(userId: string) {
  return prisma.userNumerologyRecord.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function getPortalRecordForUser(userId: string, recordId: string) {
  const record = await prisma.userNumerologyRecord.findFirst({
    where: { id: recordId, userId },
  });
  if (!record) {
    throw new AppError(404, 'Report not found');
  }
  return record;
}

export async function requestFullReportOtp(input: {
  email: string;
  phone?: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  calculation: NumerologyResult;
}) {
  const otp = generateOtpCode();
  const codeHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otpChallenge.deleteMany({ where: { email: input.email, purpose: 'FULL_REPORT' } });

  await prisma.otpChallenge.create({
    data: {
      email: input.email,
      phone: input.phone || null,
      codeHash,
      purpose: 'FULL_REPORT',
      payload: {
        fullName: input.fullName,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        calculation: input.calculation as object,
      },
      expiresAt,
    },
  });

  const message = `Your ${env.brand.name} verification code is ${otp}. Valid for 10 minutes.`;
  await sendEmail({
    to: input.email,
    subject: `${env.brand.name} — verification code`,
    text: message,
  });

  logger.dev(`[OTP] full report requested for ${input.email}`);

  return {
    message: 'OTP sent to your email address',
    devOtp: env.nodeEnv === 'development' || env.exposeOtpInDev ? otp : undefined,
  };
}

export async function verifyFullReportOtp(input: {
  email: string;
  otp: string;
  userId?: string;
}) {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { email: input.email, purpose: 'FULL_REPORT' },
    orderBy: { createdAt: 'desc' },
  });

  if (!challenge || challenge.expiresAt < new Date()) {
    throw new AppError(400, 'OTP expired — please request a new code');
  }

  const otpValid = await bcrypt.compare(input.otp, challenge.codeHash);
  if (!otpValid) {
    throw new AppError(400, 'Invalid OTP');
  }

  const payload = challenge.payload as unknown as {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    calculation: NumerologyResult;
  };

  const dob = parseUtcDate(payload.dateOfBirth);
  const raashi = getRaashiFromBirthDate(dob);
  const pdfFileName = `portal-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.pdf`;

  await writeNumerologyPdfFile(pdfFileName, payload.fullName, payload.calculation, raashi);

  let userId = input.userId ?? null;
  if (!userId) {
    const user = await ensurePortalUser(input.email, {
      fullName: payload.fullName,
      phone: challenge.phone,
      dateOfBirth: dob,
    });
    userId = user.id;
  }

  const record = await prisma.userNumerologyRecord.create({
    data: {
      userId,
      email: input.email,
      phone: challenge.phone,
      fullName: payload.fullName,
      dateOfBirth: dob,
      gender: payload.gender,
      calculationJson: payload.calculation as object,
      raashiJson: raashi as object,
      pdfFileName,
      recordKind: 'FULL_REPORT',
    },
  });

  await prisma.otpChallenge.delete({ where: { id: challenge.id } });

  const pdfPath = `${portalUploadsDir}/${pdfFileName}`;
  await sendEmail({
    to: input.email,
    subject: `${env.brand.name} — your full numerology report`,
    text:
      `Namaste ${payload.fullName},\n\nYour full numerology report is attached. ` +
      `Raashi: ${raashi.hindi} (${raashi.english}).\n\n` +
      `We have also registered this report on your phone number ending ${challenge.phone?.slice(-4) ?? '****'}.\n\n` +
      `— ${env.brand.name}`,
    attachments: [{ filename: pdfFileName, path: pdfPath }],
  });

  logger.dev(`[report] PDF stored and email sent for record ${record.id}`);

  let token: string | undefined;
  if (userId) {
    token = signPortalToken({ userId, email: input.email });
  }

  return { record, token, raashi };
}
