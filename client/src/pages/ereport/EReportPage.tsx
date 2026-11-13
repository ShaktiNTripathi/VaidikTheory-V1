import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateNumerology } from '@/features/numerology/api/numerology-api';
import { CALCULATOR_OPTIONS, type CalculatorType } from '@/features/numerology/lib/calculator-types';
import { saveReportSession, type ReportSessionPayload } from '@/features/numerology/lib/report-session';
import type { CalculationInput } from '@/shared/types';
import { AlertBanner } from '@/shared/components/ui/AlertBanner';

export function EReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const calcType: CalculatorType = 'NAME_NUMBER';
    const fullName = String(form.get('fullName')).trim();

    if (!fullName) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    const input: CalculationInput = {
      dateOfBirth: String(form.get('dateOfBirth')),
      fullName: fullName || undefined,
      gender: (String(form.get('gender')) as 'male' | 'female') || 'male',
    };

    try {
      const response = await calculateNumerology(input);
      const payload: ReportSessionPayload = {
        result: response.result,
        raashi: response.raashi,
        input,
        displayName: fullName || 'Guest',
        calculatorType: calcType,
      };
      saveReportSession(payload);
      navigate('/report/result', { state: payload });
    } catch (calcError) {
      setError(calcError instanceof Error ? calcError.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      <section className="report-hero relative overflow-hidden py-14 md:py-16">
        <div className="site-container-form relative text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light/90">eReport</p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-[2.75rem] md:leading-tight">
            Find your Life Path
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-stone-300/90">
            Choose a calculator, enter your details, and receive an instant numerology chart with strength,
            weakness, and full PDF via email OTP.
          </p>
        </div>
      </section>

      <section className="relative bg-paper pb-16 pt-6 md:pb-20 md:pt-8">
        <div className="site-container-form">
          <div
            ref={formRef}
            className="report-card relative overflow-hidden border-0 shadow-[0_20px_50px_rgba(15,20,30,0.12)]"
          >
            <div className="h-1 bg-[#e8c56a]" />
            <div className="p-6 md:p-8">
              <h2 className="text-base font-semibold text-ink">Your details</h2>
              <p className="mt-1 text-[12px] text-muted">Fields marked * are required</p>

              <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label-cosmic">Full Name *</span>
                    <input name="fullName" required className="input-cosmic" placeholder="Enter name" />
                  </label>
                  <label className="block">
                    <span className="field-label-cosmic">Date of Birth *</span>
                    <input name="dateOfBirth" type="date" required className="input-cosmic" />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="field-label-cosmic">Gender *</span>
                    <select name="gender" required className="input-cosmic" defaultValue="">
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="field-label-cosmic">Select Calculator *</span>
                    <select name="calculatorType" required className="input-cosmic" defaultValue="NAME_NUMBER">
                      {CALCULATOR_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} disabled={opt.value !== 'NAME_NUMBER'}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error ? <AlertBanner message={error} onDismiss={() => setError(null)} /> : null}

                <button type="submit" disabled={loading} className="btn-cosmic w-full sm:w-auto sm:min-w-[200px]">
                  {loading ? 'Calculating…' : 'Get Result'}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { t: 'Lo Shu grid', d: 'Birth digits and core numbers, with blank cells where a number is absent.' },
              { t: 'Strength & balance', d: 'A plain-language note on your Driver, plus the areas to steady.' },
              { t: 'Email PDF', d: 'Verify with OTP and the full chart is sent to you and saved on your dashboard.' },
            ].map((item) => (
              <article key={item.t} className="rounded-xl border-2 border-stone-200 bg-white px-4 py-4 text-left shadow-sm">
                <h3 className="text-[13px] font-semibold text-[#2a1848]">{item.t}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
