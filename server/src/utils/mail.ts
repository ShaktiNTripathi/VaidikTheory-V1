import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  attachments?: { filename: string; path: string }[];
}): Promise<void> {
  if (!env.smtp.host) {
    logger.dev(`[mail] queued for ${options.to}: ${options.subject}`);
    return;
  }

  const transport = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });

  await transport.sendMail({
    from: env.smtp.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    attachments: options.attachments,
  });
}
