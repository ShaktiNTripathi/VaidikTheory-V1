import { Link } from 'react-router-dom';
import { VaidikTheoryLogo } from '@/shared/brand/VaidikTheoryLogo';

const steps = [
  { n: '01', t: 'Enter your details', d: 'Name, date of birth, and gender. Pick the calculator you need — birth chart, name, lucky colour, or a time reading.' },
  { n: '02', t: 'See the chart', d: 'Driver, Conductor, Kua, and the Lo Shu grid open on a separate result page, ready to print.' },
  { n: '03', t: 'Keep the PDF', d: 'Verify your email with OTP and the full report is saved to your dashboard.' },
];

const offerings = [
  { t: 'Mulyank (Driver)', d: 'The day of birth reduced to a single digit. It describes how you start, decide, and show up each day.' },
  { t: 'Bhagyank (Conductor)', d: 'The full date reduced to one digit. It describes the longer path — opportunities, timing, and life direction.' },
  { t: 'Kua number', d: 'Calculated from the birth year. Used in classical practice for personal directions and balance.' },
  { t: 'Lo Shu grid', d: 'A 3×3 chart of the digits in your date, plus core numbers. Empty cells stay blank; repeats show as 11, 222, or 8 8.' },
  { t: 'Name number', d: 'Chaldean values of your full name, reduced to a name number that sits beside the birth chart.' },
  { t: 'Email PDF', d: 'Verify with a one-time code and the full chart is sent to your email and saved on your dashboard.' },
];

export function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#2a1848] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,197,106,0.22),transparent_55%)]" />
        <div className="site-container relative grid items-center gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-light">Vaidik Theory</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
              Clear numerology reports, written the classical way
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-stone-300">
              Driver, Conductor, Kua, name number, and the Lo Shu grid — calculated from your date of birth and shown
              in a report you can read, print, and keep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/report" className="rounded-lg bg-[#e8c56a] px-6 py-3 text-[14px] font-semibold text-[#2a1848] hover:bg-[#f6e7b2]">
                Get your eReport
              </Link>
              <Link to="/about" className="rounded-lg border border-[#e8c56a]/50 px-6 py-3 text-[14px] font-semibold text-[#f6e7b2] hover:bg-white/5">
                How we calculate
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <VaidikTheoryLogo variant="hero" />
          </div>
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">How it works</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink md:text-3xl">Three steps to your chart</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="report-card p-6">
              <p className="text-[12px] font-semibold tracking-[0.16em] text-gold">{s.n}</p>
              <h3 className="mt-2 text-[16px] font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="site-container py-16 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Inside every report</p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold text-ink md:text-3xl">What the numbers actually mean</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <article key={item.t} className="rounded-2xl border-2 border-stone-200 bg-paper p-5">
                <h3 className="text-[15px] font-semibold text-[#2a1848]">{item.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container py-16 md:py-20">
        <div className="grid items-center gap-8 rounded-3xl bg-[#2a1848] px-6 py-10 text-white md:grid-cols-[1.4fr_auto] md:px-12">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Ready for your chart?</h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-stone-300">
              The preview is instant. The full PDF is sent after a short email OTP, and it stays in your member dashboard.
            </p>
          </div>
          <Link to="/report" className="inline-flex justify-center rounded-lg bg-[#e8c56a] px-8 py-3 text-[14px] font-semibold text-[#2a1848]">
            Open eReport
          </Link>
        </div>
      </section>
    </main>
  );
}
