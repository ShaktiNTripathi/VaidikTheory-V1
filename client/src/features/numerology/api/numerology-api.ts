import { standaloneCalculate, standaloneDownloadPdf } from '@/shared/api/standalone-demo';
import { isStandaloneDemo } from '@/shared/config/env';
import { apiRequest, apiUrl } from '@/shared/api/http-client';
import type { CalculationInput, NumerologyResult, RaashiProfile } from '@/shared/types';

export function calculateNumerology(payload: CalculationInput) {
  if (isStandaloneDemo()) {
    return Promise.resolve(standaloneCalculate(payload));
  }
  return apiRequest<{ success: true; result: NumerologyResult; raashi: RaashiProfile }>(
    '/api/numerology/calculate',
    { method: 'POST', body: JSON.stringify(payload) },
  );
}

export async function downloadPreviewPdf(payload: CalculationInput): Promise<void> {
  if (isStandaloneDemo()) {
    await standaloneDownloadPdf(payload);
    return;
  }
  const response = await fetch(apiUrl('/api/numerology/export-pdf'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('PDF download failed');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'numerology-report.pdf';
  anchor.click();
  URL.revokeObjectURL(url);
}
