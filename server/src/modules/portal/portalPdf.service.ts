import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { NumerologyResult } from '../numerology/numerologyCalculator.js';
import type { RaashiProfile } from '../raashi/raashiCalculator.js';
import { buildNumerologyPdf } from '../numerology/pdf-report.builder.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const portalUploadsDir = path.resolve(__dirname, '../../../uploads/portal-reports');

export function ensurePortalUploadsDir(): void {
  if (!fs.existsSync(portalUploadsDir)) {
    fs.mkdirSync(portalUploadsDir, { recursive: true });
  }
}

export async function writeNumerologyPdfFile(
  fileName: string,
  fullName: string,
  calculation: NumerologyResult,
  raashi: RaashiProfile,
): Promise<string> {
  ensurePortalUploadsDir();
  const pdfPath = path.join(portalUploadsDir, fileName);
  await new Promise<void>((resolve, reject) => {
    const doc = buildNumerologyPdf(fullName, calculation, raashi);
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
  return pdfPath;
}

export function readNumerologyPdfStream(fileName: string) {
  const pdfPath = path.join(portalUploadsDir, fileName);
  if (!fs.existsSync(pdfPath)) {
    return null;
  }
  return fs.createReadStream(pdfPath);
}
