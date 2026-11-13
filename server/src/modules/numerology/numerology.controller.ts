import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { numerologyCalculateSchema } from './numerology.validation.js';
import { calculateFullNumerologyProfile } from './numerologyCalculator.js';
import { getRaashiFromBirthDate } from '../raashi/raashiCalculator.js';
import { buildNumerologyPdf } from './pdf-report.builder.js';

function parseUtcDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export const postCalculateNumerology = asyncHandler(async (req: Request, res: Response) => {
  const body = numerologyCalculateSchema.parse(req.body);
  const result = calculateFullNumerologyProfile(
    {
      dateOfBirth: parseUtcDate(body.dateOfBirth),
      fullName: body.fullName,
    },
    { gender: body.gender ?? 'male' },
  );
  const raashi = getRaashiFromBirthDate(parseUtcDate(body.dateOfBirth));
  res.json({ success: true, result, raashi });
});

export const postExportPdf = asyncHandler(async (req: Request, res: Response) => {
  const body = numerologyCalculateSchema.parse(req.body);
  const dob = parseUtcDate(body.dateOfBirth);
  const result = calculateFullNumerologyProfile(
    { dateOfBirth: dob, fullName: body.fullName },
    { gender: body.gender ?? 'male' },
  );
  const raashi = getRaashiFromBirthDate(dob);
  const name = body.fullName?.trim() || 'Guest';
  const doc = buildNumerologyPdf(name, result, raashi);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="numerology-preview.pdf"');
  doc.pipe(res);
  doc.end();
});
