import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { siteConfig } from '@/shared/config/site';
import type { NumerologyResult } from '@/shared/types';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const LEFT = 48;
const WIDTH = PAGE_W - 96;

const violet = rgb(42 / 255, 24 / 255, 72 / 255);
const cream = rgb(246 / 255, 231 / 255, 178 / 255);
const goldLight = rgb(232 / 255, 197 / 255, 106 / 255);
const gold = rgb(201 / 255, 162 / 255, 39 / 255);
const ink = rgb(36 / 255, 22 / 255, 61 / 255);
const muted = rgb(92 / 255, 84 / 255, 112 / 255);
const line = rgb(234 / 255, 223 / 255, 191 / 255);

function pdfSafe(value: string): string {
  return value.replace(/→/g, '->').replace(/−/g, '-').replace(/[^\u0000-\u00FF]/g, '');
}

const NOTES: Record<number, string> = {
  1: 'Leadership, independence, and new beginnings.',
  2: 'Cooperation, sensitivity, and partnership.',
  3: 'Expression, creativity, and communication.',
  4: 'Structure, discipline, and practical work.',
  5: 'Change, freedom, and adaptability.',
  6: 'Responsibility, harmony, and service.',
  7: 'Analysis, spirituality, and inner wisdom.',
  8: 'Ambition, material focus, and authority.',
  9: 'Compassion, completion, and a wide outlook.',
};

export async function buildReportPdfBlob(name: string, calculation: NumerologyResult): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const y = { value: PAGE_H - 120 };

  page.drawRectangle({ x: 0, y: PAGE_H - 88, width: PAGE_W, height: 88, color: violet });
  page.drawText(pdfSafe('VAIDIK THEORY'), { x: LEFT, y: PAGE_H - 46, size: 20, font: bold, color: cream });
  page.drawText(pdfSafe('Jyotish and numerology reports'), {
    x: LEFT,
    y: PAGE_H - 66,
    size: 10,
    font,
    color: goldLight,
  });

  text(page, 'Numerology report', LEFT, y, 18, bold, ink, 26);
  text(page, `Prepared for ${name}`, LEFT, y, 11, font, muted, 16);
  text(page, `Date of birth  ${formatDob(calculation.input.dateOfBirth)}`, LEFT, y, 11, font, muted, 22);

  heading(page, bold, y, 'CORE NUMBERS');
  const cores: Array<[string, string]> = [
    ['DRIVER (MULYANK)', String(calculation.driverNumber)],
    ['CONDUCTOR (BHAGYANK)', String(calculation.conductorNumber)],
    ['KUA', String(calculation.kuaNumber)],
  ];
  if (calculation.nameNumber !== undefined) cores.push(['NAME NUMBER', String(calculation.nameNumber)]);
  statRow(page, font, bold, y, cores);

  heading(page, bold, y, 'COMPLETE CHART');
  drawCompleteChart(page, bold, calculation, y);

  heading(page, bold, y, 'BALANCE');
  text(
    page,
    `Missing digits: ${calculation.missingNumbers.length ? calculation.missingNumbers.join(', ') : 'none'}`,
    LEFT,
    y,
    11,
    font,
    ink,
    16,
  );
  text(
    page,
    `Repeated digits: ${calculation.repeatedNumbers.length ? calculation.repeatedNumbers.join(', ') : 'none'}`,
    LEFT,
    y,
    11,
    font,
    ink,
    18,
  );
  text(page, `Mental plane (4-9-2): ${calculation.planeAnalysis.mental}`, LEFT, y, 11, font, ink, 16);
  text(page, `Emotional plane (3-5-7): ${calculation.planeAnalysis.emotional}`, LEFT, y, 11, font, ink, 16);
  text(page, `Practical plane (8-1-6): ${calculation.planeAnalysis.practical}`, LEFT, y, 11, font, ink, 22);

  heading(page, bold, y, 'READING');
  paragraph(
    page,
    font,
    y,
    `Driver ${calculation.driverNumber}. ${NOTES[calculation.driverNumber] ?? ''}`,
  );
  paragraph(
    page,
    font,
    y,
    `Conductor ${calculation.conductorNumber}. ${NOTES[calculation.conductorNumber] ?? ''}`,
  );
  paragraph(page, font, y, calculation.breakdown.driver.calculation);
  paragraph(page, font, y, calculation.breakdown.conductor.calculation);
  paragraph(page, font, y, calculation.breakdown.kua.calculation);

  const footer = pdfSafe(
    `${siteConfig.contactEmail}   ·   ${siteConfig.contactPhone}   ·   ${new Date().toLocaleDateString('en-IN')}`,
  );
  const footerWidth = font.widthOfTextAtSize(footer, 9);
  page.drawText(footer, {
    x: (PAGE_W - footerWidth) / 2,
    y: 32,
    size: 9,
    font,
    color: rgb(138 / 255, 130 / 255, 152 / 255),
  });

  const bytes = await doc.save();
  return new Blob([Uint8Array.from(bytes)], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function heading(page: PDFPage, bold: PDFFont, y: { value: number }, title: string) {
  page.drawText(pdfSafe(title), { x: LEFT, y: y.value, size: 12, font: bold, color: gold });
  y.value -= 8;
  page.drawLine({
    start: { x: LEFT, y: y.value },
    end: { x: LEFT + WIDTH, y: y.value },
    thickness: 1,
    color: line,
  });
  y.value -= 16;
}

function statRow(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  y: { value: number },
  items: Array<[string, string]>,
) {
  const col = WIDTH / items.length;
  const top = y.value;
  items.forEach(([label, value], index) => {
    const x = LEFT + index * col;
    page.drawRectangle({
      x,
      y: top - 48,
      width: col - 8,
      height: 48,
      borderColor: line,
      borderWidth: 1,
    });
    page.drawText(pdfSafe(label), { x: x + 8, y: top - 16, size: 7, font, color: muted });
    page.drawText(pdfSafe(value), { x: x + 8, y: top - 36, size: 16, font: bold, color: ink });
  });
  y.value = top - 62;
}

function drawCompleteChart(page: PDFPage, bold: PDFFont, calculation: NumerologyResult, y: { value: number }) {
  const grid = calculation.charts?.find((chart) => chart.id === 'complete')?.grid ?? calculation.loShuGrid;
  const cell = 52;
  const gap = 5;
  const pitch = cell + gap;
  const gridWidth = pitch * 3 - gap;
  const gutter = 28;
  const originX = LEFT + (WIDTH - (gridWidth + gutter * 2)) / 2;
  const gridX = originX + gutter;
  const top = y.value;
  const gridTop = top - 16;
  const cellFill = rgb(248 / 255, 241 / 255, 226 / 255);
  const cellLine = rgb(227 / 255, 211 / 255, 174 / 255);
  const violet = rgb(42 / 255, 24 / 255, 72 / 255);
  const labelSize = 9;
  const sWidth = bold.widthOfTextAtSize('S', labelSize);
  const swWidth = bold.widthOfTextAtSize('SW', labelSize);
  page.drawText('SE', { x: gridX, y: top, size: labelSize, font: bold, color: violet });
  page.drawText('S', { x: gridX + (gridWidth - sWidth) / 2, y: top, size: labelSize, font: bold, color: violet });
  page.drawText('SW', { x: gridX + gridWidth - swWidth, y: top, size: labelSize, font: bold, color: violet });

  const sideY = gridTop - pitch - cell / 2 - 3;
  const eWidth = bold.widthOfTextAtSize('E', labelSize);
  page.drawText('E', { x: originX + gutter - 8 - eWidth, y: sideY, size: labelSize, font: bold, color: violet });
  page.drawText('W', { x: gridX + gridWidth + 8, y: sideY, size: labelSize, font: bold, color: violet });

  grid.forEach((row, rowIndex) => {
    row.forEach((cellData, colIndex) => {
      const cx = gridX + colIndex * pitch;
      const cellTop = gridTop - rowIndex * pitch;
      page.drawRectangle({
        x: cx,
        y: cellTop - cell,
        width: cell,
        height: cell,
        color: cellFill,
        borderColor: cellLine,
        borderWidth: 0.8,
      });
      if (cellData.display) {
        const label = pdfSafe(cellData.display);
        const size = 12;
        const textWidth = bold.widthOfTextAtSize(label, size);
        page.drawText(label, {
          x: cx + (cell - textWidth) / 2,
          y: cellTop - cell / 2 - 4,
          size,
          font: bold,
          color: violet,
        });
      }
    });
  });

  const bottomY = gridTop - pitch * 3 - 4;
  const nWidth = bold.widthOfTextAtSize('N', labelSize);
  const nwWidth = bold.widthOfTextAtSize('NW', labelSize);
  page.drawText('NE', { x: gridX, y: bottomY, size: labelSize, font: bold, color: violet });
  page.drawText('N', { x: gridX + (gridWidth - nWidth) / 2, y: bottomY, size: labelSize, font: bold, color: violet });
  page.drawText('NW', { x: gridX + gridWidth - nwWidth, y: bottomY, size: labelSize, font: bold, color: violet });

  y.value = gridTop - pitch * 3 - 22;
}

function text(
  page: PDFPage,
  value: string,
  x: number,
  y: { value: number },
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
  gap: number,
) {
  page.drawText(pdfSafe(value), { x, y: y.value, size, font, color });
  y.value -= gap;
}

function paragraph(page: PDFPage, font: PDFFont, y: { value: number }, value: string) {
  const lines = wrap(pdfSafe(value), font, 11, WIDTH);
  for (const lineText of lines) {
    page.drawText(pdfSafe(lineText), { x: LEFT, y: y.value, size: 11, font, color: ink });
    y.value -= 14;
  }
  y.value -= 4;
}

function wrap(value: string, font: PDFFont, size: number, max: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of value.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function formatDob(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}-${month}-${year}`;
}
