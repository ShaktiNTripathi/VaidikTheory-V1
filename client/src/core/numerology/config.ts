/** Lo Shu magic square layout (standard 3×3). */
export const LO_SHU_GRID_LAYOUT: readonly (readonly number[])[] = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] as const;

export const numerologyConfig = {
  /** When true, 11, 22, 33 are kept as master numbers where applicable. */
  preserveMasterNumbers: false,
  /**
   * Lo Shu grid digits = non-zero DOB digits + Mulyank + Bhagyank + Kua + Name number
   * (standard Batra-style chart population).
   */
  loShuIncludesDobDigits: true,
  loShuIncludesCoreNumbers: true,
  /** Chaldean letter-to-number mapping for name calculations. */
  chaldeanLetterMap: {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8,
  } as Record<string, number>,
  reportSections: {
    driverConductor: true,
    loShuGrid: true,
    nameNumber: true,
    kuaNumber: true,
    summary: true,
  },
};

export type NumerologyConfig = typeof numerologyConfig;
