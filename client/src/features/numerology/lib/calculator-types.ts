export type CalculatorType =
  | 'FREE_DOB'
  | 'NAME_NUMBER'
  | 'LUCKY_COLOR'
  | 'LUCKY_NUMBER'
  | 'TODAY'
  | 'MONTH'
  | 'YEAR';

export const CALCULATOR_OPTIONS: { value: CalculatorType; label: string }[] = [
  { value: 'FREE_DOB', label: 'Free DOB Calculator' },
  { value: 'NAME_NUMBER', label: 'Name Number Calculator' },
  { value: 'LUCKY_COLOR', label: 'Lucky and Unlucky Color Calculator' },
  { value: 'LUCKY_NUMBER', label: 'Lucky and Unlucky Number Calculator' },
  { value: 'TODAY', label: "Today's Prediction" },
  { value: 'MONTH', label: "This Month's Prediction" },
  { value: 'YEAR', label: "This Year's Prediction" },
];

export function getCalculatorLabel(type: CalculatorType): string {
  return CALCULATOR_OPTIONS.find((o) => o.value === type)?.label ?? 'Free DOB Report';
}

export const luckyColors: Record<number, { lucky: string; unlucky: string }> = {
  1: { lucky: 'Gold, Orange', unlucky: 'Dark Grey' },
  2: { lucky: 'White, Cream', unlucky: 'Black' },
  3: { lucky: 'Yellow, Purple', unlucky: 'Brown' },
  4: { lucky: 'Blue, Grey', unlucky: 'Red' },
  5: { lucky: 'Green, Turquoise', unlucky: 'Dark Blue' },
  6: { lucky: 'Pink, Light Blue', unlucky: 'Maroon' },
  7: { lucky: 'Violet, Sea Green', unlucky: 'Orange' },
  8: { lucky: 'Dark Blue, Black', unlucky: 'Light Green' },
  9: { lucky: 'Red, Crimson', unlucky: 'White' },
};

export const luckyNumbers: Record<number, { lucky: number[]; unlucky: number[] }> = {
  1: { lucky: [1, 3, 5], unlucky: [8] },
  2: { lucky: [2, 4, 6], unlucky: [9] },
  3: { lucky: [3, 6, 9], unlucky: [4] },
  4: { lucky: [1, 4, 8], unlucky: [5] },
  5: { lucky: [5, 6, 8], unlucky: [2] },
  6: { lucky: [3, 6, 9], unlucky: [7] },
  7: { lucky: [2, 7, 9], unlucky: [8] },
  8: { lucky: [4, 6, 8], unlucky: [1] },
  9: { lucky: [1, 3, 9], unlucky: [6] },
};
