import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <main>
      <section className="bg-[#2a1848] text-white">
        <div className="site-container py-14 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">About</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold md:text-4xl">Vaidik Theory</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone-300">
            A consultation-style numerology practice brought online: the same Driver, Conductor, Kua, and Lo Shu
            method used on a written chart, presented so you can read it clearly.
          </p>
        </div>
      </section>

      <section className="site-container grid gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
          <h2 className="text-xl font-semibold text-ink">What we do</h2>
          <p>
            Every report starts from the date of birth. The birth day becomes Mulyank (Driver). The full date becomes
            Bhagyank (Conductor). The birth year becomes the Kua number. Non-zero digits, together with those core
            numbers, fill the Lo Shu grid.
          </p>
          <p>
            If you add a name, we apply the Chaldean letter chart and show the name number beside the birth chart.
          </p>
          <p>
            The preview on screen is the working chart. The emailed PDF is the copy you can keep, print, or open again
            from your dashboard after OTP verification.
          </p>
        </div>
        <div className="report-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-ink">How a reading is built</h2>
          <ol className="mt-4 space-y-4 text-[14px] leading-relaxed text-ink-soft">
            <li>
              <span className="font-semibold text-ink">1. Birth digits.</span> Only the numbers in the date are counted.
              Zeros are not placed in the grid.
            </li>
            <li>
              <span className="font-semibold text-ink">2. Core numbers.</span> Driver, Conductor, and Kua are reduced
              and then marked on the same grid.
            </li>
            <li>
              <span className="font-semibold text-ink">3. Planes.</span> Mental, emotional, and practical rows show where
              digits are strong or missing.
            </li>
            <li>
              <span className="font-semibold text-ink">4. Language.</span> Strength and balance notes are written
              in plain language — not a wall of jargon.
            </li>
          </ol>
          <Link to="/report" className="btn-primary mt-6 inline-flex">
            Calculate a chart
          </Link>
        </div>
      </section>
    </main>
  );
}
