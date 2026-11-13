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

export interface RaashiProfile {
  english: string;
  hindi: string;
  symbol: string;
  dateRange: string;
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
  planeAnalysis: { mental: number; emotional: number; practical: number };
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
}

export interface CalculationInput {
  dateOfBirth: string;
  fullName?: string;
  gender: 'male' | 'female';
}
