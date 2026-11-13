import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { bookingsRouter } from './modules/bookings/bookings.routes.js';
import { numerologyRouter } from './modules/numerology/numerology.routes.js';
import { portalRouter } from './modules/portal/portal.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, service: 'vaidik-theory-api' });
  });

  app.use('/api/bookings', bookingsRouter);
  app.use('/api/numerology', numerologyRouter);
  app.use('/api/portal', authLimiter, portalRouter);

  app.use(errorHandler);
  return app;
}
