import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: requireEnv('DATABASE_URL'),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  portalCookieName: process.env.PORTAL_COOKIE_NAME ?? 'vaidik_portal_session',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? 'noreply@vaidiknumerology.com',
  },
  exposeOtpInDev: process.env.EXPOSE_OTP_IN_DEV === 'true',
  brand: {
    name: process.env.BRAND_NAME ?? 'Vaidik Theory',
    tagline: process.env.BRAND_TAGLINE ?? 'Driver, Conductor, Lo Shu — classical numerology online',
    email: process.env.BRAND_EMAIL ?? 'consult@vaidiktheory.com',
    phone: process.env.BRAND_PHONE ?? '+91 00000 00000',
  },
  isProduction: process.env.NODE_ENV === 'production',
};
