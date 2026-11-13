import { AppError } from './errors.js';

export function requireRouteParam(value: string | string[] | undefined, name: string): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  throw new AppError(400, `Missing route parameter: ${name}`);
}
