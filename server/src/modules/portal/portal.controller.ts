import type { Request, Response } from 'express';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireRouteParam } from '../../utils/routeParams.js';
import {
  portalLoginOtpSchema,
  portalLoginVerifySchema,
  portalRegisterSchema,
  reportOtpRequestSchema,
  reportOtpVerifySchema,
} from './portal.validation.js';
import {
  getPortalProfile,
  getPortalRecordForUser,
  listPortalRecords,
  registerPortalUser,
  requestFullReportOtp,
  requestLoginOtp,
  verifyFullReportOtp,
  verifyLoginOtp,
} from './portal.service.js';
import { readNumerologyPdfStream } from './portalPdf.service.js';
import type { NumerologyResult } from '../numerology/numerologyCalculator.js';

const portalCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: (env.isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const body = portalRegisterSchema.parse(req.body);
  const session = await registerPortalUser(body);
  res.cookie(env.portalCookieName, session.token, portalCookieOptions);
  res.status(201).json({ success: true, user: session.user });
});

export const postLoginOtp = asyncHandler(async (req: Request, res: Response) => {
  const body = portalLoginOtpSchema.parse(req.body);
  const result = await requestLoginOtp(body.email);
  res.json({ success: true, ...result });
});

export const postLoginVerify = asyncHandler(async (req: Request, res: Response) => {
  const body = portalLoginVerifySchema.parse(req.body);
  const session = await verifyLoginOtp(body.email, body.otp);
  res.cookie(env.portalCookieName, session.token, portalCookieOptions);
  res.json({ success: true, user: session.user });
});

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.portalCookieName, { path: '/' });
  res.json({ success: true });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await getPortalProfile(req.portalUser!.userId);
  res.json({ success: true, user });
});

export const getRecords = asyncHandler(async (req: Request, res: Response) => {
  const records = await listPortalRecords(req.portalUser!.userId);
  res.json({ success: true, records });
});

export const downloadRecordPdf = asyncHandler(async (req: Request, res: Response) => {
  const record = await getPortalRecordForUser(
    req.portalUser!.userId,
    requireRouteParam(req.params.recordId, 'recordId'),
  );
  if (!record.pdfFileName) {
    res.status(404).json({ success: false, message: 'PDF not available' });
    return;
  }
  const stream = readNumerologyPdfStream(record.pdfFileName);
  if (!stream) {
    res.status(404).json({ success: false, message: 'PDF file missing' });
    return;
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${record.pdfFileName}"`);
  stream.pipe(res);
});

export const postReportOtp = asyncHandler(async (req: Request, res: Response) => {
  const body = reportOtpRequestSchema.parse(req.body);
  const result = await requestFullReportOtp({
    email: body.email,
    phone: body.phone || undefined,
    fullName: body.fullName,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    calculation: body.calculation as unknown as NumerologyResult,
  });
  res.json({ success: true, ...result });
});

export const postReportVerify = asyncHandler(async (req: Request, res: Response) => {
  const body = reportOtpVerifySchema.parse(req.body);
  const verified = await verifyFullReportOtp({
    email: body.email,
    otp: body.otp,
    userId: req.portalUser?.userId,
  });
  if (verified.token) {
    res.cookie(env.portalCookieName, verified.token, portalCookieOptions);
  }
  res.json({
    success: true,
    recordId: verified.record.id,
    raashi: verified.raashi,
    message: 'Full report sent to your email and linked to your account.',
  });
});
