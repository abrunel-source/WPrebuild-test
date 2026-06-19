/**
 * Site configuration for Florida Clinicians for Climate Action (FCCA).
 *
 * Mirrors the WordPress Customizer / Elementor Kit identity:
 *  - blogname = "FCCA", blogdescription = "Climate Solutions Are Health Solutions"
 *  - site_logo = attachment 2331 (FCCA-logo.png)
 *  - Brand palette + fonts from the Elementor global kit.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const site = {
  title: 'Florida Clinicians for Climate Action',
  shortTitle: 'FCCA',
  tagline: 'Climate Solutions Are Health Solutions',
  logo: '/media/2023/07/FCCA-logo.png',
  email: 'info@floridaclinicians.org',
  /** Stripe donation link carried over from the original site. */
  donateUrl: 'https://buy.stripe.com/aEU6rHeyeffaeu4eUU',
};

/** Primary navigation — WordPress "main" menu, with its dropdowns preserved. */
export const headerMenu: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about/',
    children: [
      { label: 'About FCCA', href: '/about/' },
      { label: 'Our Team', href: '/team/' },
      { label: 'Our Funders', href: '/funders/' },
    ],
  },
  { label: 'Advocacy', href: '/advocacy/' },
  { label: 'Education', href: '/education/' },
  { label: 'Events', href: '/events/' },
  {
    label: 'News',
    href: '/news/',
    children: [
      { label: 'In the Press', href: '/news/' },
      { label: 'Newsletters', href: '/newsletters/' },
    ],
  },
  { label: 'Project C-HOT', href: '/project-c-hot/' },
  { label: 'Contact', href: '/contact/' },
];

/** Footer menu — secondary links + legal. */
export const footerMenu: NavItem[] = [
  { label: 'About', href: '/about/' },
  { label: 'Our Team', href: '/team/' },
  { label: 'Education', href: '/education/' },
  { label: 'Events', href: '/events/' },
  { label: 'News', href: '/news/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms & Conditions', href: '/terms/' },
];
