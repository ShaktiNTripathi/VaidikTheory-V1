import { standaloneContact } from '@/shared/api/standalone-demo';
import { isStandaloneDemo } from '@/shared/config/env';
import { apiRequest } from '@/shared/api/http-client';

export function submitContactMessage(payload: {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}) {
  if (isStandaloneDemo()) {
    return Promise.resolve(standaloneContact());
  }
  return apiRequest<{ success: true }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      serviceType: 'PERSONAL_CONSULTATION',
      message: payload.message,
    }),
  });
}
