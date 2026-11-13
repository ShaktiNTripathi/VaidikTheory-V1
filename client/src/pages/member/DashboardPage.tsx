import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { downloadRecordPdf, fetchPortalMe, fetchPortalRecords, logoutPortal } from '@/features/portal/api/portal-api';
import type { PortalUser, UserRecord } from '@/shared/types';
import { AlertBanner } from '@/shared/components/ui/AlertBanner';

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [me, rec] = await Promise.all([fetchPortalMe(), fetchPortalRecords()]);
        setUser(me.user);
        setRecords(rec.records);
        setSelectedId(rec.records[0]?.id ?? null);
      } catch {
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((row) =>
      [row.fullName, row.email, row.dateOfBirth]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [records, query]);

  const selected = filtered.find((row) => row.id === selectedId) ?? filtered[0] ?? null;

  async function handleLogout() {
    await logoutPortal();
    navigate('/login');
  }

  async function handleDownload(row: UserRecord) {
    setDownloadingId(row.id);
    setError(null);
    try {
      await downloadRecordPdf(row.id, row.pdfFileName ?? `${row.fullName}-report.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) {
    return <p className="site-container py-16 text-center text-[14px] text-muted">Loading your dashboard…</p>;
  }

  const latest = records[0];

  return (
    <main className="flex-1">
      <section className="bg-[#2a1848] text-white">
        <div className="site-container flex flex-col gap-4 py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">{user?.fullName || 'Your account'}</h1>
            <p className="mt-2 text-[14px] text-stone-300">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/report" className="rounded-lg bg-[#e8c56a] px-4 py-2 text-[13px] font-semibold text-[#2a1848]">
              New eReport
            </Link>
            <button type="button" onClick={() => void handleLogout()} className="rounded-lg border border-white/25 px-4 py-2 text-[13px] font-semibold text-white">
              Log out
            </button>
          </div>
        </div>
      </section>

      <section className="site-container py-8 md:py-12">
        {error ? <div className="mb-4"><AlertBanner message={error} onDismiss={() => setError(null)} /></div> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Saved reports" value={String(records.length)} />
          <Stat label="Latest driver" value={latest ? String(latest.calculationJson.driverNumber) : '—'} />
          <Stat label="Latest conductor" value={latest ? String(latest.calculationJson.conductorNumber) : '—'} />
          <Stat label="Latest Kua" value={latest ? String(latest.calculationJson.kuaNumber) : '—'} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <section className="report-card p-5 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-ink">Reports</h2>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
                className="input-pro sm:max-w-xs"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="mt-6 rounded-xl border-2 border-dashed border-stone-200 px-4 py-10 text-center">
                <p className="text-[14px] text-muted">No reports yet.</p>
                <Link to="/report" className="mt-3 inline-block text-[13px] font-semibold text-gold">
                  Create your first eReport
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-stone-200">
                {filtered.map((row) => {
                  const active = selected?.id === row.id;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(row.id)}
                        className={`flex w-full items-center justify-between gap-3 px-2 py-3 text-left ${active ? 'bg-[#faf6ee]' : 'hover:bg-paper'}`}
                      >
                        <span>
                          <span className="block text-[14px] font-semibold text-ink">{row.fullName}</span>
                          <span className="mt-0.5 block text-[12px] text-muted">
                            {row.dateOfBirth.slice(0, 10)}
                          </span>
                        </span>
                        <span className="text-[12px] font-semibold text-gold">Driver {row.calculationJson.driverNumber}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="report-card p-5 md:p-6">
            {selected ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Selected report</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{selected.fullName}</h2>
                <p className="mt-1 text-[13px] text-muted">{selected.dateOfBirth.slice(0, 10)}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Mini label="Driver" value={selected.calculationJson.driverNumber} />
                  <Mini label="Conductor" value={selected.calculationJson.conductorNumber} />
                  <Mini label="Kua" value={selected.calculationJson.kuaNumber} />
                  <Mini label="Name" value={selected.calculationJson.nameNumber ?? '—'} />
                </div>

                <dl className="mt-5 space-y-2 text-[13px] text-ink-soft">
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt>Date of birth</dt>
                    <dd className="font-medium text-ink">{selected.dateOfBirth.slice(0, 10)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-stone-100 pb-2">
                    <dt>Saved</dt>
                    <dd className="font-medium text-ink">{new Date(selected.createdAt).toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Planes</dt>
                    <dd className="font-medium text-ink">
                      M {selected.calculationJson.planeAnalysis.mental} · E {selected.calculationJson.planeAnalysis.emotional} · P {selected.calculationJson.planeAnalysis.practical}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  disabled={!selected.pdfFileName || downloadingId === selected.id}
                  onClick={() => void handleDownload(selected)}
                  className="btn-primary mt-6 w-full py-3"
                >
                  {downloadingId === selected.id ? 'Preparing PDF…' : 'Download PDF'}
                </button>
              </>
            ) : (
              <p className="text-[14px] text-muted">Select a report to see the numbers and download the PDF.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="report-card px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#2a1848]">{value}</p>
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-stone-200 bg-paper px-3 py-3 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}
