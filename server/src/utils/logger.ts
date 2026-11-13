import { env } from '../config/env.js';

/** Server logging — never writes OTPs or secrets in production. */
export const logger = {
  info(message: string): void {
    if (env.nodeEnv !== 'test') {
      console.log(message);
    }
  },
  /** Dev / diagnostic detail (suppressed in production unless EXPOSE_OTP_IN_DEV). */
  dev(message: string): void {
    if (env.nodeEnv === 'development' || env.exposeOtpInDev) {
      console.log(message);
    }
  },
};
