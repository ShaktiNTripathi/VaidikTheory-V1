export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

/** Empty in local dev (Vite proxies /api). Set VITE_API_URL on Vercel to the hosted API origin. */
export function apiUrl(path: string): string {
  const base = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
  return `${base}${path}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const body = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!response.ok) {
    throw new ApiRequestError(response.status, body.message ?? 'Request failed');
  }

  return body;
}
