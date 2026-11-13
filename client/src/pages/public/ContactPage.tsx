import { useState, type FormEvent } from 'react';
import { submitContactMessage } from '@/features/contact/api/contact-api';
import { AlertBanner } from '@/shared/components/ui/AlertBanner';
import { siteConfig } from '@/shared/config/site';

export function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const form = new FormData(e.currentTarget);
    try {
      await submitContactMessage({
        fullName: String(form.get('fullName')),
        email: String(form.get('email')),
        phone: String(form.get('phone')),
        message: String(form.get('message')),
      });
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="bg-[#2a1848] text-white">
        <div className="site-container py-14 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Contact</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Talk to Vaidik Theory</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-stone-300">
            Questions about a chart, a booking, or your emailed report — send a note and we reply during consultation hours.
          </p>
        </div>
      </section>

      <section className="site-container grid gap-8 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-16">
        <div className="space-y-4">
          <article className="report-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">Email</p>
            <p className="mt-2 text-[15px] text-ink">{siteConfig.contactEmail}</p>
          </article>
          <article className="report-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">Phone / WhatsApp</p>
            <p className="mt-2 text-[15px] text-ink">{siteConfig.contactPhone}</p>
          </article>
          <article className="report-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-gold">Hours</p>
            <p className="mt-2 text-[15px] text-ink">{siteConfig.consultationHours}</p>
            <p className="mt-1 text-[13px] text-muted">{siteConfig.consultationNote}</p>
          </article>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="report-card space-y-3 p-5">
          <h2 className="text-sm font-semibold text-ink">Send a message</h2>
          {success ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
              Thank you — we will contact you shortly.
            </p>
          ) : null}
          {error ? <AlertBanner message={error} onDismiss={() => setError(null)} /> : null}
          <input name="fullName" required placeholder="Full name *" className="input-pro" />
          <input name="email" type="email" required placeholder="Email *" className="input-pro" />
          <input name="phone" required placeholder="WhatsApp number *" className="input-pro" />
          <textarea name="message" required rows={4} placeholder="Your message *" className="input-pro" />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending…' : 'Submit'}
          </button>
        </form>
      </section>
    </main>
  );
}
