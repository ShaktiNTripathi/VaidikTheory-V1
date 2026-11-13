import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/errors.js';

export interface PortalTokenPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      portalUser?: PortalTokenPayload;
    }
  }
}

export function requirePortalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies[env.portalCookieName] as string | undefined;
  if (!token) {
    next(new AppError(401, 'Please sign in to continue'));
    return;
  }
  try {
    req.portalUser = jwt.verify(token, env.jwtSecret) as PortalTokenPayload;
    next();
  } catch {
    next(new AppError(401, 'Session expired — please sign in again'));
  }
}
