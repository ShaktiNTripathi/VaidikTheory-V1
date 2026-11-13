import PDFDocument from 'pdfkit';
import type { NumerologyResult } from '../numerology/numerologyCalculator.js';
import type { RaashiProfile } from '../raashi/raashiCalculator.js';
import { env } from '../../config/env.js';

const VIOLET = '#2a1848';
const GOLD = '#c9a227';
const INK = '#24163d';
const MUTED = '#5c5470';

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

export function buildNumerologyPdf(
  clientName: string,
  calculation: NumerologyResult,
  raashi?: RaashiProfile,
): InstanceType<typeof PDFDocument> {
  const doc = new PDFDocument({ margin: 48, size: 'A4' });
  const left = 48;
  const width = doc.page.width - 96;

  doc.rect(0, 0, doc.page.width, 88).fill(VIOLET);
  doc.fillColor('#f6e7b2').fontSize(20).text('VAIDIK THEORY', left, 28, { width, lineBreak: false });
  doc.fillColor('#e8c56a').fontSize(10).text(env.brand.tagline, left, 54, { width, lineBreak: false });

  let y = 112;
  doc.fillColor(INK).fontSize(18).text('Numerology report', left, y, { width });
  y = doc.y + 6;
  doc.fillColor(MUTED).fontSize(11);
  doc.text(`Prepared for ${clientName}`, left, y, { width });
  y = doc.y + 2;
  doc.text(`Date of birth  ${formatDob(calculation.input.dateOfBirth)}`, left, y, { width });
  y = doc.y + 14;

  y = heading(doc, 'Core numbers', left, width, y);
  const cores: Array<[string, string]> = [
    ['Driver (Mulyank)', String(calculation.driverNumber)],
    ['Conductor (Bhagyank)', String(calculation.conductorNumber)],
    ['Kua', String(calculation.kuaNumber)],
  ];
  if (calculation.nameNumber !== undefined) {
    cores.push(['Name number', String(calculation.nameNumber)]);
  }
  y = statRow(doc, cores, left, width, y);

  if (raashi) {
    y = heading(doc, 'Raashi', left, width, y);
    doc.fillColor(INK).fontSize(12).text(`${raashi.english}  ${raashi.symbol}`, left, y, { width });
    y = doc.y + 2;
    doc.fillColor(MUTED).fontSize(11).text(`${raashi.hindi}   ·   ${raashi.dateRange}`, left, y, { width });
    y = doc.y + 14;
  }

  y = heading(doc, 'Complete chart', left, width, y);
  y = drawCompleteChart(doc, calculation, left, width, y);

  y = heading(doc, 'Balance', left, width, y);
  doc.fillColor(INK).fontSize(11);
  doc.text(
    `Missing digits: ${calculation.missingNumbers.length ? calculation.missingNumbers.join(', ') : 'none'}`,
    left,
    y,
    { width },
  );
  y = doc.y + 3;
  doc.text(
    `Repeated digits: ${calculation.repeatedNumbers.length ? calculation.repeatedNumbers.join(', ') : 'none'}`,
    left,
    y,
    { width },
  );
  y = doc.y + 8;
  doc.text(`Mental plane (4-9-2): ${calculation.planeAnalysis.mental}`, left, y, { width });
  y = doc.y + 3;
  doc.text(`Emotional plane (3-5-7): ${calculation.planeAnalysis.emotional}`, left, y, { width });
  y = doc.y + 3;
  doc.text(`Practical plane (8-1-6): ${calculation.planeAnalysis.practical}`, left, y, { width });
  y = doc.y + 14;

  y = heading(doc, 'Reading', left, width, y);
  doc.fillColor(INK).fontSize(11).text(
    `Driver ${calculation.driverNumber}. ${NOTES[calculation.driverNumber] ?? ''}`,
    left,
    y,
    { width, align: 'left' },
  );
  y = doc.y + 6;
  doc.text(
    `Conductor ${calculation.conductorNumber}. ${NOTES[calculation.conductorNumber] ?? ''}`,
    left,
    y,
    { width },
  );
  y = doc.y + 6;
  doc.fillColor(MUTED).fontSize(10).text(calculation.breakdown.driver.calculation, left, y, { width });
  y = doc.y + 3;
  doc.text(calculation.breakdown.conductor.calculation, left, y, { width });
  y = doc.y + 3;
  doc.text(calculation.breakdown.kua.calculation, left, y, { width });

  doc.fillColor('#8a8298').fontSize(9).text(
    `${env.brand.email}   ·   ${env.brand.phone}   ·   ${new Date().toLocaleDateString('en-IN')}`,
    left,
    doc.page.height - 48,
    { width, align: 'center', lineBreak: false },
  );

  return doc;
}

function heading(
  doc: InstanceType<typeof PDFDocument>,
  title: string,
  left: number,
  width: number,
  y: number,
): number {
  doc.fillColor(GOLD).fontSize(12).text(title.toUpperCase(), left, y, { width, characterSpacing: 0.6 });
  const lineY = doc.y + 2;
  doc.moveTo(left, lineY).lineTo(left + width, lineY).strokeColor('#eadfbf').lineWidth(1).stroke();
  return lineY + 10;
}

function statRow(
  doc: InstanceType<typeof PDFDocument>,
  items: Array<[string, string]>,
  left: number,
  width: number,
  y: number,
): number {
  const col = width / items.length;
  items.forEach(([label, value], index) => {
    const x = left + index * col;
    doc.roundedRect(x, y, col - 8, 48, 4).strokeColor('#e4dcc8').lineWidth(1).stroke();
    doc.fillColor(MUTED).fontSize(8).text(label.toUpperCase(), x + 8, y + 8, { width: col - 20, lineBreak: false });
    doc.fillColor(INK).fontSize(16).text(value, x + 8, y + 22, { width: col - 20, lineBreak: false });
  });
  return y + 62;
}

function drawCompleteChart(
  doc: InstanceType<typeof PDFDocument>,
  calculation: NumerologyResult,
  left: number,
  width: number,
  y: number,
): number {
  const grid = calculation.charts?.find((chart) => chart.id === 'complete')?.grid ?? calculation.loShuGrid;
  const cell = 52;
  const gap = 5;
  const pitch = cell + gap;
  const gridWidth = pitch * 3 - gap;
  const gutter = 28;
  const originX = left + (width - (gridWidth + gutter * 2)) / 2;
  const gridX = originX + gutter;
  const gridY = y + 16;
  doc.fillColor(VIOLET).fontSize(9);
  doc.text('SE', gridX, y, { width: cell, align: 'left', lineBreak: false });
  doc.text('S', gridX, y, { width: gridWidth, align: 'center', lineBreak: false });
  doc.text('SW', gridX + gridWidth - cell, y, { width: cell, align: 'right', lineBreak: false });

  doc.text('E', originX, gridY + pitch + cell / 2 - 4, {
    width: gutter - 4,
    align: 'right',
    lineBreak: false,
  });
  doc.text('W', gridX + gridWidth + 4, gridY + pitch + cell / 2 - 4, {
    width: gutter - 4,
    align: 'left',
    lineBreak: false,
  });

  grid.forEach((row, rowIndex) => {
    row.forEach((cellData, colIndex) => {
      const cx = gridX + colIndex * pitch;
      const cy = gridY + rowIndex * pitch;
      doc.rect(cx, cy, cell, cell).lineWidth(0.8).fillAndStroke('#f8f1e2', '#e3d3ae');
      if (cellData.display) {
        doc.fillColor(VIOLET).fontSize(13).text(cellData.display, cx, cy + cell / 2 - 5, {
          width: cell,
          align: 'center',
          lineBreak: false,
        });
      }
    });
  });

  const bottomY = gridY + pitch * 3 + 2;
  doc.text('NE', gridX, bottomY, { width: cell, align: 'left', lineBreak: false });
  doc.text('N', gridX, bottomY, { width: gridWidth, align: 'center', lineBreak: false });
  doc.text('NW', gridX + gridWidth - cell, bottomY, { width: cell, align: 'right', lineBreak: false });

  return gridY + pitch * 3 + 22;
}

function formatDob(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}-${month}-${year}`;
}
