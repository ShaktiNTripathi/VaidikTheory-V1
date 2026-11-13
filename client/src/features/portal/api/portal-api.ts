import {
  standaloneLogout,
  standaloneMe,
  standaloneRecordPdf,
  standaloneRecords,
  standaloneRequestLoginOtp,
  standaloneRequestReportOtp,
  standaloneVerifyLoginOtp,
  standaloneVerifyReportOtp,
} from '@/shared/api/standalone-demo';
import { isStandaloneDemo } from '@/shared/config/env';
import { apiRequest, apiUrl } from '@/shared/api/http-client';
import type { CalculationInput, NumerologyResult, PortalUser, RaashiProfile, UserRecord } from '@/shared/types';

function runStandalone<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn());
    } catch (error) {
      reject(error);
    }
  });
}

export function requestLoginOtp(email: string) {
  if (isStandaloneDemo()) return runStandalone(() => standaloneRequestLoginOtp(email));
  return apiRequest<{ success: true; message: string; devOtp?: string }>('/api/portal/auth/otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function verifyLoginOtp(email: string, otp: string) {
  if (isStandaloneDemo()) return runStandalone(() => standaloneVerifyLoginOtp(email, otp));
  return apiRequest<{ success: true; user: PortalUser }>('/api/portal/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export async function downloadRecordPdf(recordId: string, fileName: string) {
  if (isStandaloneDemo()) {
    await standaloneRecordPdf(recordId, fileName);
    return;
  }
  const response = await fetch(apiUrl(`/api/portal/records/${recordId}/pdf`), { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Could not download the PDF');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export function logoutPortal() {
  if (isStandaloneDemo()) return runStandalone(() => standaloneLogout());
  return apiRequest<{ success: true }>('/api/portal/auth/logout', { method: 'POST' });
}

export function fetchPortalMe() {
  if (isStandaloneDemo()) return runStandalone(() => standaloneMe());
  return apiRequest<{ success: true; user: PortalUser }>('/api/portal/auth/me');
}

export function fetchPortalRecords() {
  if (isStandaloneDemo()) return runStandalone(() => standaloneRecords());
  return apiRequest<{ success: true; records: UserRecord[] }>('/api/portal/records');
}

export function requestReportOtp(payload: CalculationInput & {
  email: string;
  phone?: string;
  fullName: string;
  calculation: NumerologyResult;
}) {
  if (isStandaloneDemo()) return runStandalone(() => standaloneRequestReportOtp(payload));
  return apiRequest<{ success: true; message: string; devOtp?: string }>(
    '/api/portal/report-request/otp',
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

export function verifyReportOtp(payload: {
  email: string;
  otp: string;
}) {
  if (isStandaloneDemo()) return runStandalone(() => standaloneVerifyReportOtp(payload.email, payload.otp));
  return apiRequest<{
    success: true;
    recordId: string;
    raashi: RaashiProfile;
    message: string;
  }>('/api/portal/report-request/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
