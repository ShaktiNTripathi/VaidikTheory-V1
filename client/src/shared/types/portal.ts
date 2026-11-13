import type { NumerologyResult, RaashiProfile } from './numerology';

export interface PortalUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string;
  gender: string;
  calculationJson: NumerologyResult;
  raashiJson: RaashiProfile;
  pdfFileName: string | null;
  recordKind: 'PREVIEW' | 'FULL_REPORT';
  createdAt: string;
}
