export interface RaashiProfile {
  english: string;
  hindi: string;
  symbol: string;
  dateRange: string;
}

const rashis: readonly {
  english: string;
  hindi: string;
  symbol: string;
  start: [month: number, day: number];
  end: [month: number, day: number];
}[] = [
  { english: 'Capricorn', hindi: 'मकर', symbol: '♑', start: [12, 22], end: [1, 19] },
  { english: 'Aquarius', hindi: 'कुम्भ', symbol: '♒', start: [1, 20], end: [2, 18] },
  { english: 'Pisces', hindi: 'मीन', symbol: '♓', start: [2, 19], end: [3, 20] },
  { english: 'Aries', hindi: 'मेष', symbol: '♈', start: [3, 21], end: [4, 19] },
  { english: 'Taurus', hindi: 'वृषभ', symbol: '♉', start: [4, 20], end: [5, 20] },
  { english: 'Gemini', hindi: 'मिथुन', symbol: '♊', start: [5, 21], end: [6, 20] },
  { english: 'Cancer', hindi: 'कर्क', symbol: '♋', start: [6, 21], end: [7, 22] },
  { english: 'Leo', hindi: 'सिंह', symbol: '♌', start: [7, 23], end: [8, 22] },
  { english: 'Virgo', hindi: 'कन्या', symbol: '♍', start: [8, 23], end: [9, 22] },
  { english: 'Libra', hindi: 'तुला', symbol: '♎', start: [9, 23], end: [10, 22] },
  { english: 'Scorpio', hindi: 'वृश्चिक', symbol: '♏', start: [10, 23], end: [11, 21] },
  { english: 'Sagittarius', hindi: 'धनु', symbol: '♐', start: [11, 22], end: [12, 21] },
] as const;

function isInRange(month: number, day: number, start: [number, number], end: [number, number]): boolean {
  const [sm, sd] = start;
  const [em, ed] = end;
  if (sm > em) {
    return (month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em;
  }
  if (month === sm && month === em) return day >= sd && day <= ed;
  if (month === sm) return day >= sd;
  if (month === em) return day <= ed;
  return month > sm && month < em;
}

/** Sun sign (Surya Rashi) by tropical date — Hindi & English labels. */
export function getRaashiFromBirthDate(dateOfBirth: Date): RaashiProfile {
  const month = dateOfBirth.getUTCMonth() + 1;
  const day = dateOfBirth.getUTCDate();

  const match = rashis.find((r) => isInRange(month, day, r.start, r.end)) ?? rashis[0];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmt = (m: number, d: number) => `${monthNames[m - 1]} ${d}`;

  return {
    english: match.english,
    hindi: match.hindi,
    symbol: match.symbol,
    dateRange: `${fmt(match.start[0], match.start[1])} – ${fmt(match.end[0], match.end[1])}`,
  };
}
