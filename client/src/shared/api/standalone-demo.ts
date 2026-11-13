import { calculateFullNumerologyProfile } from '@/core/numerology/calculator';
import { getRaashiFromBirthDate } from '@/core/raashi/calculator';
import { buildReportPdfBlob, downloadBlob } from '@/features/numerology/api/browser-pdf';
import { loadReportSession } from '@/features/numerology/lib/report-session';
import type { CalculationInput, NumerologyResult, PortalUser, RaashiProfile, UserRecord } from '@/shared/types';
import { ApiRequestError } from '@/shared/api/http-client';

const SESSION_KEY = 'vaidik.portal.session';
const RECORDS_KEY = 'vaidik.portal.records';
const OTP_KEY = 'vaidik.portal.otp';

type StoredOtp = {
  email: string;
  code: string;
  purpose: 'LOGIN' | 'FULL_REPORT';
  expiresAt: number;
  payload?: {
    fullName: string;
    phone?: string;
    dateOfBirth: string;
    gender: string;
    calculation: NumerologyResult;
    raashi: RaashiProfile;
  };
};

function parseUtcDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentUser(): PortalUser | null {
  return readJson<PortalUser | null>(SESSION_KEY, null);
}

function requireUser(): PortalUser {
  const user = currentUser();
  if (!user) throw new ApiRequestError(401, 'Not signed in');
  return user;
}

function readRecords(): UserRecord[] {
  return readJson<UserRecord[]>(RECORDS_KEY, []);
}

function saveRecord(record: UserRecord) {
  const records = readRecords().filter((row) => row.id !== record.id);
  writeJson(RECORDS_KEY, [record, ...records]);
}

function profileFor(input: CalculationInput) {
  const dateOfBirth = parseUtcDate(input.dateOfBirth);
  const result = calculateFullNumerologyProfile(
    { dateOfBirth, fullName: input.fullName },
    { gender: input.gender ?? 'male' },
  ) as NumerologyResult;
  const raashi = getRaashiFromBirthDate(dateOfBirth);
  return { result, raashi };
}

function issueOtp(email: string, purpose: StoredOtp['purpose'], payload?: StoredOtp['payload']) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const entry: StoredOtp = {
    email: email.trim().toLowerCase(),
    code,
    purpose,
    expiresAt: Date.now() + 10 * 60 * 1000,
    payload,
  };
  writeJson(OTP_KEY, entry);
  return code;
}

function takeOtp(email: string, code: string, purpose: StoredOtp['purpose']): StoredOtp {
  const entry = readJson<StoredOtp | null>(OTP_KEY, null);
  const normalized = email.trim().toLowerCase();
  if (!entry || entry.email !== normalized || entry.purpose !== purpose || entry.expiresAt < Date.now()) {
    throw new ApiRequestError(400, 'OTP expired — please request a new code');
  }
  if (entry.code !== code.trim()) {
    throw new ApiRequestError(400, 'Invalid OTP');
  }
  localStorage.removeItem(OTP_KEY);
  return entry;
}

function ensureUser(email: string, fullName?: string | null): PortalUser {
  const existing = currentUser();
  const normalized = email.trim().toLowerCase();
  if (existing && existing.email === normalized) {
    if (fullName && !existing.fullName) {
      const next = { ...existing, fullName };
      writeJson(SESSION_KEY, next);
      return next;
    }
    return existing;
  }
  const user: PortalUser = {
    id: crypto.randomUUID(),
    email: normalized,
    fullName: fullName ?? null,
    phone: null,
    dateOfBirth: null,
    createdAt: new Date().toISOString(),
  };
  writeJson(SESSION_KEY, user);
  return user;
}

function recordFromCalculation(input: {
  email: string;
  fullName: string;
  phone?: string | null;
  dateOfBirth: string;
  gender: string;
  calculation: NumerologyResult;
  raashi: RaashiProfile;
  recordKind: UserRecord['recordKind'];
}): UserRecord {
  return {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    email: input.email.trim().toLowerCase(),
    phone: input.phone ?? null,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    calculationJson: input.calculation,
    raashiJson: input.raashi,
    pdfFileName: `${input.fullName.replace(/\s+/g, '-')}-report.pdf`,
    recordKind: input.recordKind,
    createdAt: new Date().toISOString(),
  };
}

export function standaloneCalculate(input: CalculationInput) {
  const { result, raashi } = profileFor(input);
  const user = currentUser();
  if (user) {
    saveRecord(
      recordFromCalculation({
        email: user.email,
        fullName: input.fullName?.trim() || user.fullName || 'Guest',
        phone: user.phone,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        calculation: result,
        raashi,
        recordKind: 'PREVIEW',
      }),
    );
  }
  return { success: true as const, result, raashi };
}

export async function standaloneDownloadPdf(input: CalculationInput) {
  const { result } = profileFor(input);
  const blob = await buildReportPdfBlob(input.fullName?.trim() || 'Guest', result);
  downloadBlob(blob, 'numerology-report.pdf');
}

export function standaloneContact() {
  return { success: true as const };
}

export function standaloneRequestLoginOtp(email: string) {
  const code = issueOtp(email, 'LOGIN');
  return {
    success: true as const,
    message: 'OTP sent to your email address',
    devOtp: code,
  };
}

export function standaloneVerifyLoginOtp(email: string, otp: string) {
  takeOtp(email, otp, 'LOGIN');
  const session = loadReportSession();
  const user = ensureUser(email, session?.displayName && session.displayName !== 'Guest' ? session.displayName : null);
  if (session) {
    saveRecord(
      recordFromCalculation({
        email: user.email,
        fullName: session.displayName || session.input.fullName || 'Guest',
        dateOfBirth: session.input.dateOfBirth,
        gender: session.input.gender,
        calculation: session.result,
        raashi: session.raashi,
        recordKind: 'PREVIEW',
      }),
    );
  }
  return { success: true as const, user };
}

export function standaloneLogout() {
  localStorage.removeItem(SESSION_KEY);
  return { success: true as const };
}

export function standaloneMe() {
  return { success: true as const, user: requireUser() };
}

export function standaloneRecords() {
  const user = requireUser();
  const records = readRecords().filter((row) => row.email === user.email);
  return { success: true as const, records };
}

export async function standaloneRecordPdf(recordId: string, fileName: string) {
  const user = requireUser();
  const record = readRecords().find((row) => row.id === recordId && row.email === user.email);
  if (!record) throw new ApiRequestError(404, 'Could not download the PDF');
  const blob = await buildReportPdfBlob(record.fullName, record.calculationJson);
  downloadBlob(blob, fileName);
}

export function standaloneRequestReportOtp(payload: CalculationInput & {
  email: string;
  phone?: string;
  fullName: string;
  calculation: NumerologyResult;
}) {
  const { raashi } = profileFor(payload);
  const code = issueOtp(payload.email, 'FULL_REPORT', {
    fullName: payload.fullName,
    phone: payload.phone,
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    calculation: payload.calculation,
    raashi,
  });
  return { success: true as const, message: 'OTP sent to your email address', devOtp: code };
}

export function standaloneVerifyReportOtp(email: string, otp: string) {
  const entry = takeOtp(email, otp, 'FULL_REPORT');
  if (!entry.payload) throw new ApiRequestError(400, 'Invalid OTP');
  const record = recordFromCalculation({
    email,
    fullName: entry.payload.fullName,
    phone: entry.payload.phone,
    dateOfBirth: entry.payload.dateOfBirth,
    gender: entry.payload.gender,
    calculation: entry.payload.calculation,
    raashi: entry.payload.raashi,
    recordKind: 'FULL_REPORT',
  });
  saveRecord(record);
  if (!currentUser()) {
    ensureUser(email, entry.payload.fullName);
  }
  return {
    success: true as const,
    recordId: record.id,
    raashi: entry.payload.raashi,
    message: 'Report saved',
  };
}
