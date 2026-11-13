import { RASHI_RING } from '@/shared/brand/graha-icons';

type LogoProps = {
  variant?: 'full' | 'hero';
  className?: string;
  onDark?: boolean;
};

const GOLD = '#e8c56a';
const VIOLET = '#2a1848';
const CX = 120;
const CY = 120;
const SIGN_R = 93;

export function VaidikTheoryLogo({ variant = 'full', className = '', onDark = false }: LogoProps) {
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center gap-5 text-center ${className}`}>
        <BrandEmblem className="h-52 w-52 sm:h-60 sm:w-60" />
        <p className="text-xl font-semibold tracking-[0.28em] text-[#f6e7b2] sm:text-2xl">VAIDIK THEORY</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandEmblem className="h-11 w-11 sm:h-12 sm:w-12" />
      <div className="min-w-0 leading-tight">
        <p className={`text-[15px] font-semibold tracking-[0.14em] sm:text-base ${onDark ? 'text-[#f6e7b2]' : 'text-[#2a1848]'}`}>
          VAIDIK THEORY
        </p>
        <p className={`text-[9px] uppercase tracking-[0.18em] ${onDark ? 'text-[#e8c56a]' : 'text-[#6b5a8a]'}`}>
          Jyotish · Numerology
        </p>
      </div>
    </div>
  );
}

export function BrandEmblem({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={`brand-emblem ${className}`} role="img" aria-label="Vaidik Theory">
      <circle cx={CX} cy={CY} r="116" fill={VIOLET} />
      <circle cx={CX} cy={CY} r="112" fill="none" stroke={GOLD} strokeWidth="1.6" />
      <circle cx={CX} cy={CY} r="74" fill="none" stroke={GOLD} strokeWidth="1.4" />
      <Swastika />
      <text x={CX} y={CY - 36} textAnchor="middle" fontSize="13" fontWeight="600" fill={GOLD} fontFamily="Inter, sans-serif">
        12
      </text>
      <text x={CX + 38} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill={GOLD} fontFamily="Inter, sans-serif">
        3
      </text>
      <text x={CX} y={CY + 44} textAnchor="middle" fontSize="13" fontWeight="600" fill={GOLD} fontFamily="Inter, sans-serif">
        6
      </text>
      <text x={CX - 38} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill={GOLD} fontFamily="Inter, sans-serif">
        9
      </text>

      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur="18s"
          repeatCount="indefinite"
        />
        {RASHI_RING.map((sym, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = CX + Math.cos(a) * SIGN_R;
          const y = CY + Math.sin(a) * SIGN_R;
          return (
            <text
              key={sym}
              className="sign-glyph"
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${x} ${y}`}
                to={`-360 ${x} ${y}`}
                dur="18s"
                repeatCount="indefinite"
              />
              {`${sym}\uFE0E`}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function Swastika() {
  const u = 16;
  return (
    <g stroke={GOLD} strokeWidth="3" fill="none" strokeLinecap="square">
      <path d={`M${CX} ${CY - u} V${CY + u} M${CX - u} ${CY} H${CX + u}`} />
      <path d={`M${CX} ${CY - u} H${CX + u * 0.7}`} />
      <path d={`M${CX + u} ${CY} V${CY + u * 0.7}`} />
      <path d={`M${CX} ${CY + u} H${CX - u * 0.7}`} />
      <path d={`M${CX - u} ${CY} V${CY - u * 0.7}`} />
    </g>
  );
}
