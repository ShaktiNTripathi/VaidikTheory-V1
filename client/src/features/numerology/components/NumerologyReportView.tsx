import { useState } from 'react';
import { downloadPreviewPdf } from '@/features/numerology/api/numerology-api';
import { LoShuGridDisplay } from '@/features/numerology/components/LoShuGridDisplay';
import { FullReportOfferSection } from '@/features/numerology/components/FullReportOfferSection';
import { FullReportRequest } from '@/features/numerology/components/FullReportRequest';
import {
  type CalculatorType,
  getCalculatorLabel,
  luckyColors,
  luckyNumbers,
} from '@/features/numerology/lib/calculator-types';
import { coreNumberNotes, planeNotes } from '@/features/numerology/lib/core-number-notes';
import { getPredictionText, getStrengthText, getWeaknessText } from '@/features/numerology/lib/report-insights';
import type { CalculationInput, NumerologyResult } from '@/shared/types';

export function NumerologyReportView({
  result,
  input,
  displayName,
  calculatorType,
  onTryDifferent,
  onEditDetails,
  variant = 'inline',
}: {
  result: NumerologyResult;
  input: CalculationInput;
  displayName: string;
  calculatorType: CalculatorType;
  onTryDifferent: () => void;
  onEditDetails?: () => void;
  variant?: 'inline' | 'result';
}) {
  const [downloading, setDownloading] = useState(false);
  const [fullReportOpen, setFullReportOpen] = useState(false);
  const dobDisplay = result.input.dateOfBirth.split('-').reverse().join('-');
  const driver = result.driverNumber;
  const conductor = result.conductorNumber;

  const showPrediction = calculatorType === 'TODAY' || calculatorType === 'MONTH' || calculatorType === 'YEAR';
  const predictionKind = calculatorType === 'TODAY' ? 'TODAY' : calculatorType === 'MONTH' ? 'MONTH' : 'YEAR';

  const completeGrid = result.charts?.find((chart) => chart.id === 'complete')?.grid ?? result.loShuGrid;

  const showSide =
    (calculatorType === 'NAME_NUMBER' && Boolean(result.breakdown.name)) ||
    calculatorType === 'LUCKY_COLOR' ||
    calculatorType === 'LUCKY_NUMBER';

  const isResultPage = variant === 'result';

  return (
    <div id="numerology-report" className="space-y-0">
      <article className="report-sheet overflow-hidden">
        {isResultPage ? (
          <div className="report-sheet-nav no-print">
            <button type="button" onClick={onTryDifferent} className="report-nav-link">
              ← New calculation
            </button>
            {onEditDetails ? (
              <button type="button" onClick={onEditDetails} className="report-nav-btn">
                Edit details
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="report-sheet-accent" aria-hidden />

        <header className="report-sheet-head">
          <div className="report-sheet-head-text">
            {isResultPage ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Report</p>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">Download, print, or request the full PDF</h2>
              </>
            ) : (
              <>
                <p className="text-[13px] text-muted">
                  Hey <span className="font-semibold text-ink">{displayName}</span>,
                </p>
                <h2 className="text-2xl font-semibold text-ink">
                  {getCalculatorLabel(calculatorType)}
                </h2>
              </>
            )}
          </div>
          <div className="report-sheet-actions no-print">
            <button
              type="button"
              disabled={downloading}
              onClick={() => {
                setDownloading(true);
                void downloadPreviewPdf(input).finally(() => setDownloading(false));
              }}
              className="report-sheet-action"
            >
              {downloading ? 'Preparing…' : 'Download PDF'}
            </button>
            <button type="button" onClick={() => window.print()} className="report-sheet-action">
              Print
            </button>
            <button
              type="button"
              onClick={() => setFullReportOpen(true)}
              className="report-sheet-action report-sheet-action--primary report-sheet-action--wide"
            >
              Get your full reports
            </button>
          </div>
        </header>

        <div className="report-sheet-body">
          <section className="report-section">
            <SectionLabel title="Core numbers" subtitle="Mulyank, Bhagyank, Kua, and your name number at a glance" />
            <div className="report-core-grid">
              <CoreStat label="Date of birth" value={dobDisplay} hint="Birth date" />
              <CoreStat label="Driver" value={String(driver)} hint="Mulyank · day" accent />
              <CoreStat label="Conductor" value={String(conductor)} hint="Bhagyank · path" accent />
              <CoreStat label="Kua" value={String(result.kuaNumber)} hint="Year balance" accent />
              {result.nameNumber !== undefined ? (
                <CoreStat label="Name number" value={String(result.nameNumber)} hint="Chaldean name" accent />
              ) : null}
            </div>
          </section>

          <section className="report-section report-chart-panel">
            <SectionLabel title="Complete chart" subtitle="Lo Shu grid with Vastu directions" />
            <div className="report-chart-stage">
              <LoShuGridDisplay grid={completeGrid} />
            </div>
          </section>

          <div className={showSide ? 'report-columns' : ''}>
            {showSide ? (
            <div className="space-y-6">

              {calculatorType === 'NAME_NUMBER' && result.breakdown.name ? (
                <section className="report-panel report-panel--elevated">
                  <PanelHead title="Name breakdown" subtitle={`Chaldean total · ${result.nameNumber}`} />
                  <p className="mt-3 rounded-lg bg-paper px-3 py-2.5 text-[13px] leading-relaxed text-ink-soft">
                    {result.breakdown.name.calculation}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.breakdown.name.letters.map((l, i) => (
                      <span key={i} className="report-letter-chip">
                        <span className="text-ink">{l.letter}</span>
                        <span className="text-gold">{l.value}</span>
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {calculatorType === 'LUCKY_COLOR' ? (
                <section className="report-panel report-panel--elevated grid gap-4 sm:grid-cols-2">
                  <InsightMini title="Lucky colours" tone="positive" body={luckyColors[driver]?.lucky ?? '—'} />
                  <InsightMini title="Colours to avoid" tone="caution" body={luckyColors[driver]?.unlucky ?? '—'} />
                </section>
              ) : null}

              {calculatorType === 'LUCKY_NUMBER' ? (
                <section className="report-panel report-panel--elevated grid gap-4 sm:grid-cols-2">
                  <InsightMini
                    title="Lucky numbers"
                    tone="positive"
                    body={luckyNumbers[driver]?.lucky.join(', ') ?? '—'}
                  />
                  <InsightMini
                    title="Unlucky numbers"
                    tone="caution"
                    body={luckyNumbers[driver]?.unlucky.join(', ') ?? '—'}
                  />
                </section>
              ) : null}

            </div>
            ) : null}

            <div className={showSide ? 'report-insights-col' : 'grid gap-4 md:grid-cols-3'}>
              <SectionLabel title="Insights" subtitle="Strengths and areas to balance from your Driver" compact />
              {showPrediction ? (
                <InsightBlock
                  tag={getCalculatorLabel(calculatorType)}
                  tagTone="gold"
                  title="Prediction"
                  body={getPredictionText(predictionKind, driver, conductor, displayName)}
                />
              ) : null}

              <InsightBlock tag="Strength" tagTone="green" title="Your strengths" body={getStrengthText(driver)} />
              <InsightBlock tag="Balance" tagTone="rose" title="Areas to balance" body={getWeaknessText(driver)} />
            </div>
          </div>

          <section className="report-section report-panel report-panel--elevated">
            <PanelHead title="Full chart reading" subtitle={`${displayName} · ${dobDisplay}`} />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <ReadCell
                title={`Driver · ${driver}`}
                body={`${result.breakdown.driver.calculation}. ${coreNumberNotes[driver] ?? ''}`}
              />
              <ReadCell
                title={`Conductor · ${conductor}`}
                body={`${result.breakdown.conductor.calculation}. ${coreNumberNotes[conductor] ?? ''}`}
              />
              <ReadCell title={`Kua · ${result.kuaNumber}`} body={result.breakdown.kua.calculation} />
              <ReadCell
                title="Grid balance"
                body={`Missing digits: ${result.missingNumbers.length ? result.missingNumbers.join(', ') : 'none'}. Repeated: ${result.repeatedNumbers.length ? result.repeatedNumbers.join(', ') : 'none'}.`}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ReadCell title={`Mental plane · ${result.planeAnalysis.mental}`} body={planeNotes.mental} />
              <ReadCell title={`Emotional plane · ${result.planeAnalysis.emotional}`} body={planeNotes.emotional} />
              <ReadCell title={`Practical plane · ${result.planeAnalysis.practical}`} body={planeNotes.practical} />
            </div>
          </section>

          <div className="no-print mt-12 border-t border-stone-200 pt-10">
            <FullReportOfferSection input={input} calculation={result} fullName={displayName} />
          </div>

          <div className="no-print mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button type="button" onClick={onTryDifferent} className="btn-primary min-w-[200px]">
              New calculation
            </button>
            <button type="button" onClick={() => window.print()} className="btn-secondary min-w-[140px]">
              Print report
            </button>
          </div>
        </div>
      </article>
      <FullReportRequest
        open={fullReportOpen}
        onClose={() => setFullReportOpen(false)}
        input={input}
        displayName={displayName}
        calculatorType={calculatorType}
      />
    </div>
  );
}

function SectionLabel({
  title,
  subtitle,
  compact,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'mb-3' : 'report-section-head'}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{title}</p>
      {subtitle ? <p className="mt-1 text-[13px] text-muted">{subtitle}</p> : null}
    </div>
  );
}

function CoreStat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <article className="report-stat-card">
      <p className="report-stat-label">{label}</p>
      <p className={`report-stat-value ${accent ? 'report-stat-value--gold' : ''}`}>{value}</p>
      <p className="report-stat-hint">{hint}</p>
    </article>
  );
}

function ReadCell({ title, body }: { title: string; body: string }) {
  return (
    <div className="report-reading-card">
      <p className="text-[12px] font-semibold text-charcoal">{title}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function PanelHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="report-panel-head">
      <h3 className="report-panel-title">{title}</h3>
      {subtitle ? <p className="mt-1 text-[12px] text-muted">{subtitle}</p> : null}
    </div>
  );
}

function InsightBlock({
  tag,
  tagTone,
  title,
  body,
}: {
  tag: string;
  tagTone: 'green' | 'rose' | 'gold';
  title: string;
  body: string;
}) {
  const toneClass =
    tagTone === 'green' ? 'report-insight--green' : tagTone === 'rose' ? 'report-insight--rose' : 'report-insight--gold';

  const tagClass =
    tagTone === 'green'
      ? 'bg-emerald-600 text-white'
      : tagTone === 'rose'
        ? 'bg-[#e8a598] text-charcoal'
        : 'bg-gold text-white';

  return (
    <section className={`report-insight ${toneClass}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tagClass}`}>
          {tag}
        </span>
        <h3 className="text-[14px] font-semibold text-ink">{title}</h3>
      </div>
      <p className="mt-3 text-[13px] leading-[1.7] text-ink-soft">{body}</p>
    </section>
  );
}

function InsightMini({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: 'positive' | 'caution';
}) {
  return (
    <div className={tone === 'positive' ? 'report-insight report-insight--soft-green' : 'report-insight report-insight--soft-rose'}>
      <p className="text-[13px] font-semibold text-ink">{title}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
