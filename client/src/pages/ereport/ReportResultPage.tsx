import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NumerologyReportView } from '@/features/numerology/components/NumerologyReportView';
import { getCalculatorLabel } from '@/features/numerology/lib/calculator-types';
import { loadReportSession, type ReportSessionPayload } from '@/features/numerology/lib/report-session';

export function ReportResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromState = location.state as ReportSessionPayload | null;
  const payload = fromState ?? loadReportSession();

  if (!payload?.result || !payload.input) {
    return <Navigate to="/report" replace />;
  }

  const { result, input, displayName, calculatorType } = payload;
  const calcLabel = getCalculatorLabel(calculatorType);

  const dobDisplay = result.input.dateOfBirth.split('-').reverse().join('-');

  return (
    <main className="flex-1">
      <section className="report-result-hero text-white">
        <div className="site-container py-12 md:py-16">
          <span className="report-hero-pill">Your eReport</span>
          <h1 className="mt-5 text-3xl font-semibold md:text-[2.65rem] md:leading-tight">{displayName}</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-300">{calcLabel}</p>
          <dl className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">Date of birth</dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-white">{dobDisplay}</dd>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">Driver</dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-[#e8c56a]">{result.driverNumber}</dd>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">Conductor</dt>
              <dd className="mt-0.5 text-[14px] font-semibold text-[#e8c56a]">{result.conductorNumber}</dd>
            </div>
            {result.nameNumber !== undefined ? (
              <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light">Name number</dt>
                <dd className="mt-0.5 text-[14px] font-semibold text-[#e8c56a]">{result.nameNumber}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className="report-result-body">
        <div className="site-container report-result-inner animate-rise">
          <NumerologyReportView
            result={result}
            input={input}
            displayName={displayName}
            calculatorType={calculatorType}
            onTryDifferent={() => navigate('/report')}
            onEditDetails={() => navigate('/report')}
            variant="result"
          />
        </div>
      </section>
    </main>
  );
}
