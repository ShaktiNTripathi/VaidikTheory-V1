import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { PORTAL_NAV, SITE_NAV } from '@/app/config/navigation';
import { fetchPortalMe } from '@/features/portal/api/portal-api';
import { VaidikTheoryLogo } from '@/shared/brand/VaidikTheoryLogo';
import { siteConfig } from '@/shared/config/site';

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    fetchPortalMe()
      .then(() => {
        if (active) setSignedIn(true);
      })
      .catch(() => {
        if (active) setSignedIn(false);
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  const links = signedIn ? [...SITE_NAV, PORTAL_NAV] : [...SITE_NAV];

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-lg">
        <div className="site-container flex items-center justify-between gap-3 py-3">
          <NavLink to="/" className="min-w-0 shrink" onClick={() => setOpen(false)}>
            <VaidikTheoryLogo />
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-[13px] font-medium ${isActive ? 'bg-gold-muted text-gold' : 'text-ink-soft hover:bg-paper hover:text-ink'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `ml-2 rounded-lg px-3.5 py-2 text-[12px] font-semibold ${
                  isActive ? 'bg-[#e8c56a] text-[#2a1848]' : 'bg-charcoal text-white hover:bg-charcoal-soft'
                } ${signedIn ? 'hidden' : ''}`
              }
            >
              Login
            </NavLink>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line text-ink lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-line bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-[90rem] flex-col gap-1">
              {links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-[15px] font-medium ${isActive ? 'bg-gold-muted text-gold' : 'text-ink hover:bg-paper'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${signedIn ? 'hidden' : 'mt-2'} rounded-xl px-4 py-3 text-center text-[15px] font-semibold ${
                    isActive ? 'bg-[#e8c56a] text-[#2a1848]' : 'bg-charcoal text-white'
                  }`
                }
              >
                Login
              </NavLink>
            </div>
          </nav>
        ) : null}
      </header>

      <Outlet />

      <footer className="mt-auto border-t border-charcoal/20 bg-charcoal text-stone-400">
        <div className="site-container grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:py-14">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <VaidikTheoryLogo onDark />
            <p className="max-w-sm text-center text-[13px] leading-relaxed text-stone-500 md:text-left">
              Mulyank, Bhagyank, Lo Shu grid, nine-graha wisdom, and professional numerology reports — Vaidik Theory.
            </p>
          </div>
          <div className="text-center text-[13px] md:text-left">
            <p className="font-semibold text-stone-300">Quick links</p>
            <div className="mt-3 flex flex-col gap-2">
              <NavLink to="/report" className="hover:text-gold-light">
                Get eReport
              </NavLink>
              <NavLink to="/about" className="hover:text-gold-light">
                About
              </NavLink>
              <NavLink to="/contact" className="hover:text-gold-light">
                Contact
              </NavLink>
              {signedIn ? (
                <NavLink to="/dashboard" className="hover:text-gold-light">
                  Dashboard
                </NavLink>
              ) : null}
            </div>
          </div>
          <div className="text-center text-[13px] md:text-right">
            <p className="font-semibold text-stone-300">Contact</p>
            <p className="mt-3">{siteConfig.contactEmail}</p>
            <p>{siteConfig.contactPhone}</p>
            <div className="mt-5 flex items-center justify-center gap-4 md:justify-end">
              <SocialLink label="Instagram" href={siteConfig.social.instagram}>
                <InstagramIcon />
              </SocialLink>
              <SocialLink label="Facebook" href={siteConfig.social.facebook}>
                <FacebookIcon />
              </SocialLink>
              <SocialLink label="YouTube" href={siteConfig.social.youtube}>
                <YouTubeIcon />
              </SocialLink>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 py-5 text-center text-[11px] text-stone-600">
          © {new Date().getFullYear()} Vaidik Theory. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e8c56a]/45 p-3 text-[#e8c56a] transition hover:bg-[#e8c56a] hover:text-[#2a1848]"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.6" cy="7.4" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M14.2 9V7.6c0-.6.4-1 1-1H16.4V4.6h-1.7C12.6 4.6 11.4 5.8 11.4 7.5V9H9.8v2.2h1.6V19h2.8v-7.8h1.8l.3-2.2h-2.1z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden>
      <path d="M20.6 12.2s0-2.6-.3-3.8c-.2-.7-.7-1.3-1.4-1.5C17.4 6.6 12 6.6 12 6.6s-5.4 0-6.9.3c-.7.2-1.2.8-1.4 1.5-.3 1.2-.3 3.8-.3 3.8s0 2.6.3 3.8c.2.7.7 1.3 1.4 1.5 1.5.3 6.9.3 6.9.3s5.4 0 6.9-.3c.7-.2 1.2-.8 1.4-1.5.3-1.2.3-3.8.3-3.8zM10.4 15.1V9.3l4.4 2.9-4.4 2.9z" />
    </svg>
  );
}
