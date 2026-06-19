/**
 * Site configuration.
 *
 * Mirrors what a Hello Elementor site stores in WordPress:
 *  - Site identity (title / tagline / logo) from Customizer
 *  - register_nav_menus(): "menu-1" => Header, "menu-2" => Footer (functions.php)
 */

export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  title: 'WPrebuild',
  tagline: 'A WordPress site, rebuilt in Astro',
  /** Set to a path under /public (e.g. "/images/logo.svg") to show a logo instead of the title. */
  logo: '' as string,
};

/** Header menu — WordPress location "menu-1". */
export const headerMenu: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

/** Footer menu — WordPress location "menu-2". */
export const footerMenu: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Privacy Policy', href: '/privacy/' },
];
