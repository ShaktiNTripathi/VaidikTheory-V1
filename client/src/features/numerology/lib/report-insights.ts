import { coreNumberNotes } from '@/features/numerology/lib/core-number-notes';

const weaknessByDriver: Record<number, string> = {
  1: 'Impatience and a strong need to control outcomes can create friction in partnerships.',
  2: 'Over-sensitivity may lead to indecision or dependence on others for validation.',
  3: 'Scattered focus and speaking before thinking can dilute your natural creativity.',
  4: 'Rigid routines and resistance to change can block new opportunities.',
  5: 'Restlessness and impulsive choices may disturb stability you actually need.',
  6: 'Taking too much responsibility for others can cause emotional exhaustion.',
  7: 'Isolation and over-analysis can delay action on practical goals.',
  8: 'Work-heavy mindset may overlook emotional balance and family time.',
  9: 'Idealism without boundaries can lead to disappointment or burnout.',
};

export function getStrengthText(driver: number): string {
  return `You are influenced by Driver number ${driver}. ${coreNumberNotes[driver] ?? ''} This energy shapes how you express yourself daily and how others first experience your personality.`;
}

export function getWeaknessText(driver: number): string {
  return weaknessByDriver[driver] ?? 'Balance your core number with patience and mindful communication.';
}

export function getPredictionText(
  kind: 'TODAY' | 'MONTH' | 'YEAR',
  driver: number,
  conductor: number,
  name?: string,
): string {
  const base = name ? `${name}, ` : '';
  if (kind === 'TODAY') {
    return `${base}today aligns with Driver ${driver} and Conductor ${ conductor}. Focus on ${coreNumberNotes[driver]?.toLowerCase() ?? 'your priorities'}. Avoid rushing decisions linked to your missing grid digits; small consistent steps bring the best outcome today.`;
  }
  if (kind === 'MONTH') {
    return `${base}this month highlights Conductor ${conductor} themes alongside your Driver ${driver}. Plan important work in the first half of the month; relationships and finances respond well when you stay structured and speak clearly.`;
  }
  return `${base}this year is guided by Conductor ${conductor} with Driver ${driver} as your daily anchor. Long-term goals gain momentum when you honour your Lo Shu balance — strengthen weak planes and repeat favourable number habits through the year.`;
}
