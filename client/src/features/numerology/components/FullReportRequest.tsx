import { useState, type FormEvent } from 'react';
import { getCalculatorLabel, type CalculatorType } from '@/features/numerology/lib/calculator-types';
import type { CalculationInput } from '@/shared/types';

export function FullReportRequest({
  open,
  onClose,
  input,
  displayName,
  calculatorType,
}: {
  open: boolean;
  onClose: () => void;
  input: CalculationInput;
  displayName: string;
  calculatorType: CalculatorType;
}) {
  const [accepted, setAccepted] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  if (!open) return null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!accepted) return;
    setDone(true);
  }

  function close() {
    setDone(false);
    setAccepted(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2a1848]/50 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line bg-[#2a1848] px-5 py-4 text-white">
          <h3 className="text-[16px] font-semibold">Get your full report</h3>
          <button type="button" onClick={close} className="text-[13px] text-[#e8c56a]">
            Close
          </button>
        </div>

        {done ? (
          <div className="space-y-4 px-5 py-8 text-center">
            <p className="text-lg font-semibold text-[#2a1848]">Done</p>
            <p className="text-[14px] leading-relaxed text-ink-soft">
              Your full report will be sent to you on WhatsApp and by email.
            </p>
            <button type="button" onClick={close} className="btn-primary px-6 py-2.5">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="field-label">Full name</span>
              <input className="input-pro bg-paper" value={displayName} readOnly />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Date of birth</span>
                <input className="input-pro bg-paper" type="date" value={input.dateOfBirth} readOnly />
              </label>
              <label className="block">
                <span className="field-label">Gender</span>
                <input className="input-pro bg-paper capitalize" value={input.gender} readOnly />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Calculator</span>
              <input className="input-pro bg-paper" value={getCalculatorLabel(calculatorType)} readOnly />
            </label>
            <label className="block">
              <span className="field-label">Email</span>
              <input
                className="input-pro"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </label>
            <label className="block">
              <span className="field-label">WhatsApp number</span>
              <input
                className="input-pro"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>
            <label className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                className="mt-1"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
              />
              <span>I have read the Terms &amp; Conditions and I want to continue.</span>
            </label>
            <button type="submit" disabled={!accepted} className="btn-primary w-full py-3 disabled:opacity-50">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
