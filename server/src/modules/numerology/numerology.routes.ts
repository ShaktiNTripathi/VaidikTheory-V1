import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { postCalculateNumerology, postExportPdf } from './numerology.controller.js';

export const numerologyRouter = Router();

const calcLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

numerologyRouter.post('/calculate', calcLimiter, postCalculateNumerology);
numerologyRouter.post('/export-pdf', calcLimiter, postExportPdf);
