export type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

export const SITE_NAV: NavItem[] = [
  { to: '/', end: true, label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/report', label: 'eReport' },
  { to: '/contact', label: 'Contact' },
];

export const PORTAL_NAV: NavItem = { to: '/dashboard', label: 'Dashboard' };
