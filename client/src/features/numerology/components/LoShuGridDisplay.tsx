import type { LoShuCell } from '@/shared/types';

/** Complete Lo Shu chart — directions at the corners and mid-edges (reference layout). */
export function LoShuGridDisplay({ grid }: { grid: LoShuCell[][] }) {
  return (
    <div className="loshu-compass" aria-label="Complete chart">
      <span className="loshu-dir loshu-dir--se">SE</span>
      <span className="loshu-dir loshu-dir--s">S</span>
      <span className="loshu-dir loshu-dir--sw">SW</span>
      <span className="loshu-dir loshu-dir--e">E</span>
      <span className="loshu-dir loshu-dir--w">W</span>
      <span className="loshu-dir loshu-dir--ne">NE</span>
      <span className="loshu-dir loshu-dir--n">N</span>
      <span className="loshu-dir loshu-dir--nw">NW</span>
      {grid.flat().map((cell, index) => (
        <div
          key={cell.digit}
          className={`loshu-table-cell ${cell.display ? 'loshu-table-cell--active' : 'loshu-table-cell--empty'}`}
          data-digit={cell.digit}
          style={{ gridColumn: (index % 3) + 2, gridRow: Math.floor(index / 3) + 2 }}
        >
          {cell.display ? <span className="loshu-cell-value">{cell.display}</span> : null}
        </div>
      ))}
    </div>
  );
}
