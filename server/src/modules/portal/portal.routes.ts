import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requirePortalAuth } from '../../middleware/portalAuthMiddleware.js';
import { optionalPortalAuth } from '../../middleware/optionalPortalAuth.js';
import {
  downloadRecordPdf,
  getMe,
  getRecords,
  logoutUser,
  postLoginOtp,
  postLoginVerify,
  postReportOtp,
  postReportVerify,
  registerUser,
} from './portal.controller.js';

export const portalRouter = Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

portalRouter.post('/auth/register', registerUser);
portalRouter.post('/auth/otp', otpLimiter, postLoginOtp);
portalRouter.post('/auth/otp/verify', otpLimiter, postLoginVerify);
portalRouter.post('/auth/logout', logoutUser);
portalRouter.get('/auth/me', requirePortalAuth, getMe);

portalRouter.get('/records', requirePortalAuth, getRecords);
portalRouter.get('/records/:recordId/pdf', requirePortalAuth, downloadRecordPdf);

portalRouter.post('/report-request/otp', otpLimiter, postReportOtp);
portalRouter.post('/report-request/verify', otpLimiter, optionalPortalAuth, postReportVerify);
