import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestLoginOtp, verifyLoginOtp } from '@/features/portal/api/portal-api';
import { AlertBanner } from '@/shared/components/ui/AlertBanner';
import { isStandaloneDemo } from '@/shared/config/env';

export function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await requestLoginOtp(email);
      setDevOtp(res.devOtp ?? null);
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyLoginOtp(email, otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      <section className="bg-[#2a1848] text-white">
        <div className="site-container py-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Member access</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Sign in with email</h1>
        </div>
      </section>

      <section className="site-container flex justify-center py-12 md:py-16">
        <div className="report-card w-full max-w-md p-6 md:p-8">
          {error ? <div className="mb-4"><AlertBanner message={error} onDismiss={() => setError(null)} /></div> : null}

          {step === 'email' ? (
            <form onSubmit={(e) => void sendCode(e)} className="space-y-4">
              <label className="block">
                <span className="field-label">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-pro"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </label>
              <button type="submit" disabled={loading || !email} className="btn-primary w-full py-3">
                {loading ? 'Sending…' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => void verifyCode(e)} className="space-y-4">
              <p className="text-[13px] text-muted">
                Code sent to <span className="font-semibold text-ink">{email}</span>
              </p>
              {devOtp && (import.meta.env.DEV || isStandaloneDemo()) ? (
                <p className="text-[13px] font-semibold text-gold">Your code: {devOtp}</p>
              ) : null}
              <label className="block">
                <span className="field-label">6-digit code</span>
                <input
                  inputMode="numeric"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-pro tracking-[0.3em]"
                  placeholder="000000"
                  autoComplete="one-time-code"
                />
              </label>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full py-3">
                {loading ? 'Checking…' : 'Sign in'}
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-[13px] font-medium text-gold">
                Use a different email
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
