/** Nine Jyotish graha glyphs (simplified, reference-style). */
export type GrahaId =
  | 'ketu'
  | 'moon'
  | 'jupiter'
  | 'venus'
  | 'mars'
  | 'saturn'
  | 'sun'
  | 'rahu'
  | 'mercury';

export const GRAHA_GRID_ORDER: GrahaId[] = [
  'ketu',
  'moon',
  'jupiter',
  'venus',
  'mars',
  'saturn',
  'sun',
  'rahu',
  'mercury',
];

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function GrahaIcon({ id }: { id: GrahaId }) {
  switch (id) {
    case 'ketu':
      return (
        <g {...stroke}>
          <path d="M7 5c2-1 4-1 6 0 2 3 2 7 0 10-2 2-4 3-6 3-2 0-4-1-6-3-2-3-2-7 0-10" />
          <circle cx="8" cy="17" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="17" r="1.2" fill="currentColor" stroke="none" />
        </g>
      );
    case 'moon':
      return (
        <path
          {...stroke}
          d="M16 6a7 7 0 1 0 0 12 9 9 0 0 1 0-12z"
          fill="currentColor"
          stroke="none"
        />
      );
    case 'jupiter':
      return (
        <g {...stroke}>
          <path d="M12 4v16" />
          <path d="M8 8h8" />
          <path d="M8 14c2 3 4 4 6 4" />
        </g>
      );
    case 'venus':
      return (
        <g {...stroke}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M12 12.5v7" />
          <path d="M9 16.5h6" />
        </g>
      );
    case 'mars':
      return (
        <g {...stroke}>
          <circle cx="10" cy="14" r="4" />
          <path d="M13 11l5-5" />
          <path d="M15 6h3v3" />
        </g>
      );
    case 'saturn':
      return (
        <g {...stroke}>
          <path d="M10 5v14" />
          <path d="M7 8h6" />
          <path d="M10 19c4-1 7-4 8-8" />
        </g>
      );
    case 'sun':
      return (
        <g>
          <circle cx="12" cy="12" r="5.5" {...stroke} />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        </g>
      );
    case 'rahu':
      return (
        <g {...stroke}>
          <circle cx="8" cy="7" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="7" r="1.2" fill="currentColor" stroke="none" />
          <path d="M8 8c0 4 2 8 4 10 2-2 4-6 4-10" />
        </g>
      );
    case 'mercury':
      return (
        <g {...stroke}>
          <circle cx="12" cy="13" r="3.5" />
          <path d="M8 10a4 4 0 0 1 8 0" />
          <path d="M12 16.5v3" />
          <path d="M10 19.5h4" />
        </g>
      );
    default:
      return null;
  }
}

/** Twelve rashis — Unicode symbols on a ring (reference logo style). */
export const RASHI_RING = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'] as const;
