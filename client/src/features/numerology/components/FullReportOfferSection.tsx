import { useState } from 'react';
import { requestReportOtp, verifyReportOtp } from '@/features/portal/api/portal-api';
import type { CalculationInput, NumerologyResult } from '@/shared/types';
import { AlertBanner } from '@/shared/components/ui/AlertBanner';
import { isStandaloneDemo } from '@/shared/config/env';

type OtpStep = 'email' | 'verify' | 'done';

export function FullReportOfferSection({
  input,
  calculation,
  fullName,
}: {
  input: CalculationInput;
  calculation: NumerologyResult;
  fullName: string;
}) {
  const [step, setStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  async function sendOtp() {
    setLoading(true);
    setError(null);
    try {
      const res = await requestReportOtp({
        ...input,
        email,
        fullName,
        calculation,
      });
      setDevOtp(res.devOtp ?? null);
      setStep('verify');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setLoading(true);
    setError(null);
    try {
      await verifyReportOtp({ email, otp });
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border-2 border-[#d4af37]/40 bg-[#2a1848] p-5 shadow-md md:p-7">
      <span className="inline-block rounded-full bg-[#d4af37] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#2a1848]">
        Full PDF · OTP
      </span>
      <div className="mt-3">
        <div>
          <p className="text-[14px] font-medium leading-snug text-[#f3e6b8]">
            Get the full numerology PDF on your email — verify with OTP and save it to your dashboard.
          </p>

          {step === 'done' ? (
            <p className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-[13px] text-emerald-900">
              Full PDF sent to <strong>{email}</strong>. Check your inbox (and dashboard).
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {error ? <AlertBanner message={error} onDismiss={() => setError(null)} /> : null}
              {step === 'email' ? (
                <>
                  <label className="block text-[12px] font-medium text-[#f3e6b8]">Email for OTP *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-full border-0 bg-white/95 px-4 py-2.5 text-[13px] outline-none"
                  />
                  <button
                    type="button"
                    disabled={loading || !email}
                    onClick={() => void sendOtp()}
                    className="rounded-full bg-[#d4af37] px-5 py-2 text-[12px] font-semibold text-[#2a1848]"
                  >
                    {loading ? 'Sending…' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[12px] text-[#f3e6b8]/80">OTP sent to {email}</p>
                  {devOtp && (import.meta.env.DEV || isStandaloneDemo()) ? (
                    <p className="text-[13px] font-semibold text-[#f3e6b8]">Your code: {devOtp}</p>
                  ) : null}
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit OTP"
                    className="w-full rounded-full bg-white/95 px-4 py-2.5 text-[13px] tracking-widest"
                  />
                  <button
                    type="button"
                    disabled={loading || otp.length !== 6}
                    onClick={() => void verify()}
                    className="rounded-full bg-[#d4af37] px-5 py-2.5 text-[13px] font-semibold text-[#2a1848]"
                  >
                    {loading ? 'Verifying…' : 'Get Your Report'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
