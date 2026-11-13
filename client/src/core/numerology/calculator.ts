import {
  LO_SHU_GRID_LAYOUT,
  numerologyConfig,
  type NumerologyConfig,
} from './config';

const MASTER_NUMBERS = new Set([11, 22, 33]);

export interface BirthInput {
  dateOfBirth: Date;
  fullName?: string;
}

export interface LoShuCell {
  digit: number;
  count: number;
  display: string;
}

export interface NumerologyChart {
  id: 'birth' | 'name' | 'complete';
  title: string;
  rule: string;
  grid: LoShuCell[][];
}

export interface NumerologyResult {
  input: {
    dateOfBirth: string;
    fullName?: string;
    gender: 'male' | 'female';
  };
  driverNumber: number;
  conductorNumber: number;
  nameNumber?: number;
  kuaNumber: number;
  loShuGrid: LoShuCell[][];
  charts?: NumerologyChart[];
  missingNumbers: number[];
  repeatedNumbers: number[];
  planeAnalysis: {
    mental: number;
    emotional: number;
    practical: number;
  };
  breakdown: {
    dobDigits: string;
    gridDigitSources: number[];
    digitFrequency: Record<number, number>;
    driver: { birthDay: number; calculation: string };
    conductor: { digits: number[]; digitSum: number; calculation: string };
    kua: { birthYear: number; yearDigitSum: number; calculation: string };
    name?: {
      letters: { letter: string; value: number }[];
      letterSum: number;
      calculation: string;
    };
  };
  configSnapshot: Pick<NumerologyConfig, 'preserveMasterNumbers' | 'reportSections'>;
}

function reduceToSingleDigit(total: number, preserveMaster: boolean): number {
  if (preserveMaster && MASTER_NUMBERS.has(total)) {
    return total;
  }
  let value = total;
  while (value > 9) {
    value = String(value)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
    if (preserveMaster && MASTER_NUMBERS.has(value)) {
      return value;
    }
  }
  return value;
}

export function formatDobDigits(date: Date): string {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`;
}

function extractDateDigits(date: Date): number[] {
  return formatDobDigits(date)
    .split('')
    .map((char) => Number(char))
    .filter((n) => !Number.isNaN(n));
}

function describeReduction(start: number, preserveMaster: boolean): string {
  const steps: number[] = [start];
  let value = start;
  while (value > 9) {
    if (preserveMaster && MASTER_NUMBERS.has(value)) {
      break;
    }
    value = String(value)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
    steps.push(value);
    if (preserveMaster && MASTER_NUMBERS.has(value)) {
      break;
    }
  }
  if (steps.length === 1) {
    return `${start} (already single digit)`;
  }
  return steps.join(' → ');
}

/** Driver (Mulank / psychic number): day of birth reduced to 1–9. */
export function calculateDriverNumber(dateOfBirth: Date, config = numerologyConfig): number {
  const day = dateOfBirth.getUTCDate();
  return reduceToSingleDigit(day, config.preserveMasterNumbers);
}

/** Conductor (Bhagyank / destiny): full DOB digits reduced to 1–9. */
export function calculateConductorNumber(dateOfBirth: Date, config = numerologyConfig): number {
  const digits = extractDateDigits(dateOfBirth);
  const sum = digits.reduce((acc, digit) => acc + digit, 0);
  return reduceToSingleDigit(sum, config.preserveMasterNumbers);
}

export function calculateNameNumber(fullName: string, config = numerologyConfig): number {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  for (const letter of letters) {
    sum += config.chaldeanLetterMap[letter] ?? 0;
  }
  return reduceToSingleDigit(sum, config.preserveMasterNumbers);
}

/** Kua number (common Lo Shu / Feng Shui variant from birth year and gender). */
export function calculateKuaNumber(
  dateOfBirth: Date,
  gender: 'male' | 'female' = 'male',
  config = numerologyConfig,
): number {
  const year = dateOfBirth.getUTCFullYear();
  const yearSum = reduceToSingleDigit(
    String(year)
      .split('')
      .reduce((acc, d) => acc + Number(d), 0),
    false,
  );
  let kua = gender === 'male' ? 11 - yearSum : yearSum + 4;
  kua = reduceToSingleDigit(kua, config.preserveMasterNumbers);
  if (kua === 5) {
    return gender === 'male' ? 2 : 8;
  }
  return kua;
}

/** Reference chart style: empty cells blank; repeats like 222, 11, or 8 8. */
function formatLoShuCellDisplay(digit: number, count: number): string {
  if (count <= 0) return '';
  if (count === 1) return String(digit);
  if (count === 2) {
    return digit === 1 ? '11' : `${digit} ${digit}`;
  }
  return String(digit).repeat(count);
}

function gridFromFrequency(frequency: Map<number, number>): LoShuCell[][] {
  return LO_SHU_GRID_LAYOUT.map((row) =>
    row.map((digit) => {
      const count = frequency.get(digit) ?? 0;
      return {
        digit,
        count,
        display: formatLoShuCellDisplay(digit, count),
      };
    }),
  );
}

function frequencyFromDigits(values: number[]): Map<number, number> {
  const frequency = emptyDigitFrequency();
  addDigitsToFrequency(frequency, values);
  return frequency;
}

function emptyDigitFrequency(): Map<number, number> {
  const frequency = new Map<number, number>();
  for (let digit = 1; digit <= 9; digit += 1) {
    frequency.set(digit, 0);
  }
  return frequency;
}

function addDigitsToFrequency(frequency: Map<number, number>, values: number[]): number[] {
  const added: number[] = [];
  for (const value of values) {
    for (const char of String(value)) {
      const digit = Number(char);
      if (digit >= 1 && digit <= 9) {
        frequency.set(digit, (frequency.get(digit) ?? 0) + 1);
        added.push(digit);
      }
    }
  }
  return added;
}

/** Lo Shu: non-zero DOB digits + Mulyank, Bhagyank, Kua, Name number. */
function buildLoShuDigitFrequency(
  dateOfBirth: Date,
  core: { driver: number; conductor: number; kua: number; nameNumber?: number },
): { frequency: Map<number, number>; sources: number[] } {
  const frequency = emptyDigitFrequency();
  const sources: number[] = [];

  const dobDigits = extractDateDigits(dateOfBirth).filter((d) => d >= 1 && d <= 9);
  sources.push(...addDigitsToFrequency(frequency, dobDigits));

  const coreNumbers = [core.driver, core.conductor, core.kua];
  if (core.nameNumber !== undefined) {
    coreNumbers.push(core.nameNumber);
  }
  sources.push(...addDigitsToFrequency(frequency, coreNumbers));

  return { frequency, sources };
}

function analyzePlanes(frequency: Map<number, number>) {
  const mental = (frequency.get(4) ?? 0) + (frequency.get(9) ?? 0) + (frequency.get(2) ?? 0);
  const emotional = (frequency.get(3) ?? 0) + (frequency.get(5) ?? 0) + (frequency.get(7) ?? 0);
  const practical = (frequency.get(8) ?? 0) + (frequency.get(1) ?? 0) + (frequency.get(6) ?? 0);
  return { mental, emotional, practical };
}

export function calculateFullNumerologyProfile(
  input: BirthInput,
  options?: { gender?: 'male' | 'female'; config?: NumerologyConfig },
): NumerologyResult {
  const config = options?.config ?? numerologyConfig;
  const gender = options?.gender ?? 'male';
  const driverNumber = calculateDriverNumber(input.dateOfBirth, config);
  const conductorNumber = calculateConductorNumber(input.dateOfBirth, config);
  const kuaNumber = calculateKuaNumber(input.dateOfBirth, gender, config);

  let nameNumber: number | undefined;
  if (input.fullName?.trim() && config.reportSections.nameNumber) {
    nameNumber = calculateNameNumber(input.fullName, config);
  }

  const { frequency, sources: gridDigitSources } = buildLoShuDigitFrequency(input.dateOfBirth, {
    driver: driverNumber,
    conductor: conductorNumber,
    kua: kuaNumber,
    nameNumber,
  });

  const loShuGrid = gridFromFrequency(frequency);
  const birthDigits = extractDateDigits(input.dateOfBirth).filter((digit) => digit >= 1 && digit <= 9);
  const charts: NumerologyChart[] = [
    {
      id: 'birth',
      title: 'Birth chart',
      rule: 'Only the numbers in the date of birth are visible. Empty cells stay blank.',
      grid: gridFromFrequency(frequencyFromDigits(birthDigits)),
    },
  ];
  if (input.fullName?.trim()) {
    const nameDigits: number[] = [];
    for (const letter of input.fullName.toUpperCase().replace(/[^A-Z]/g, '')) {
      const value = config.chaldeanLetterMap[letter];
      if (value) nameDigits.push(value);
    }
    if (nameDigits.length > 0) {
      charts.push({
        id: 'name',
        title: 'Name chart',
        rule: 'Each letter is placed by the Chaldean chart. Only those numbers are visible.',
        grid: gridFromFrequency(frequencyFromDigits(nameDigits)),
      });
    }
  }
  charts.push({
    id: 'complete',
    title: 'Complete chart',
    rule: 'Birth numbers, plus Driver, Conductor, Kua, and the Name number.',
    grid: loShuGrid,
  });

  const missingNumbers: number[] = [];
  const repeatedNumbers: number[] = [];
  for (let digit = 1; digit <= 9; digit += 1) {
    const count = frequency.get(digit) ?? 0;
    if (count === 0) missingNumbers.push(digit);
    if (count > 1) repeatedNumbers.push(digit);
  }

  const birthDay = input.dateOfBirth.getUTCDate();
  const birthYear = input.dateOfBirth.getUTCFullYear();
  const dobDigits = formatDobDigits(input.dateOfBirth);
  const conductorDigits = extractDateDigits(input.dateOfBirth);
  const conductorDigitSum = conductorDigits.reduce((acc, digit) => acc + digit, 0);

  const yearDigitSum = String(birthYear)
    .split('')
    .reduce((acc, d) => acc + Number(d), 0);
  const yearReduced = reduceToSingleDigit(yearDigitSum, false);
  const rawKua = gender === 'male' ? 11 - yearReduced : yearReduced + 4;

  const digitFrequency: Record<number, number> = {};
  for (let digit = 1; digit <= 9; digit += 1) {
    digitFrequency[digit] = frequency.get(digit) ?? 0;
  }

  const result: NumerologyResult = {
    input: {
      dateOfBirth: input.dateOfBirth.toISOString().slice(0, 10),
      fullName: input.fullName?.trim() || undefined,
      gender,
    },
    driverNumber,
    conductorNumber,
    kuaNumber,
    nameNumber,
    loShuGrid,
    charts,
    missingNumbers,
    repeatedNumbers,
    planeAnalysis: analyzePlanes(frequency),
    breakdown: {
      dobDigits,
      gridDigitSources,
      digitFrequency,
      driver: {
        birthDay,
        calculation: describeReduction(birthDay, config.preserveMasterNumbers),
      },
      conductor: {
        digits: conductorDigits,
        digitSum: conductorDigitSum,
        calculation: describeReduction(conductorDigitSum, config.preserveMasterNumbers),
      },
      kua: {
        birthYear,
        yearDigitSum: yearReduced,
        calculation:
          gender === 'male'
            ? `11 − ${yearReduced} = ${rawKua} → ${calculateKuaNumber(input.dateOfBirth, gender, config)}`
            : `${yearReduced} + 4 = ${rawKua} → ${calculateKuaNumber(input.dateOfBirth, gender, config)}`,
      },
    },
    configSnapshot: {
      preserveMasterNumbers: config.preserveMasterNumbers,
      reportSections: config.reportSections,
    },
  };

  if (input.fullName?.trim() && config.reportSections.nameNumber && nameNumber !== undefined) {
    const letters = input.fullName.toUpperCase().replace(/[^A-Z]/g, '');
    const letterBreakdown: { letter: string; value: number }[] = [];
    let letterSum = 0;
    for (const letter of letters) {
      const value = config.chaldeanLetterMap[letter] ?? 0;
      letterBreakdown.push({ letter, value });
      letterSum += value;
    }
    result.breakdown.name = {
      letters: letterBreakdown,
      letterSum,
      calculation: describeReduction(letterSum, config.preserveMasterNumbers),
    };
  }

  return result;
}
