import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { PortalTokenPayload } from './portalAuthMiddleware.js';

export function optionalPortalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies[env.portalCookieName] as string | undefined;
  if (token) {
    try {
      req.portalUser = jwt.verify(token, env.jwtSecret) as PortalTokenPayload;
    } catch {
      /* ignore invalid cookie */
    }
  }
  next();
}
