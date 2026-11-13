import type { CalculatorType } from '@/features/numerology/lib/calculator-types';
import type { CalculationInput, NumerologyResult, RaashiProfile } from '@/shared/types';

export type ReportSessionPayload = {
  result: NumerologyResult;
  raashi: RaashiProfile;
  input: CalculationInput;
  displayName: string;
  calculatorType: CalculatorType;
};

const STORAGE_KEY = 'vaidik.report.session';

export function saveReportSession(payload: ReportSessionPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function loadReportSession(): ReportSessionPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReportSessionPayload;
  } catch {
    return null;
  }
}

export function clearReportSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
