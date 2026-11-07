import type { Messages } from '../i18n/en';
import { localePath, type Locale } from '../i18n/locales';
import { GITHUB } from '../site';

// A live tool must have somewhere to send people; one still being built must not.
/**
 * `id` picks its copy in each catalogue; `name` stays the same in every language.
 * `icon` is a 24px stroked SVG path; `tint` the two ends of its tile's gradient.
 * `applicationCategory` is one of schema.org's, for the product's structured data.
 */
export type Tool = {
  id: keyof Messages['tools'];
  name: string;
  icon: string;
  tint: [string, string];
} & (
  | { status: 'building' }
  | { status: 'live'; href: string; source?: string; applicationCategory: string }
);

export const tools: Tool[] = [
  {
    id: 'tools',
    name: 'Form & Paperwork Tools',
    icon: 'M4 5h16v14H4zM4 15l4.5-4.5 4 4 2.5-2.5 5 5M15.5 9.5h.01',
    tint: ['#10b981', '#0ea5e9'],
    status: 'live',
    href: '/tools/',
    applicationCategory: 'UtilitiesApplication',
    source: `${GITHUB}/photo-resizer`,
  },
  {
    id: 'screener',
    name: 'Mutual Fund Screener',
    icon: 'M4 4v16h16M8 15l3.5-4 3 3L20 7',
    tint: ['#6366f1', '#a855f7'],
    status: 'live',
    href: 'https://screener.manyxlabs.com/',
    applicationCategory: 'FinanceApplication',
    source: `${GITHUB}/mf-screener`,
  },
  {
    id: 'gloss',
    name: 'Gloss Reader',
    icon: 'M4 4h8v16H4zM7 8h2M7 12h2M15 6h5v5h-5zM15 14h5v5h-5zM12 8.5h3M12 16.5h3',
    tint: ['#f59e0b', '#ec4899'],
    status: 'live',
    href: 'https://gloss.manyxlabs.com/',
    source: `${GITHUB}/gloss`,
    applicationCategory: 'EducationalApplication',
  },
];

/** The tools share this host and are translated too; the other products are their own hosts, in English. */
export const toolHref = (tool: Tool & { status: 'live' }, locale: Locale) =>
  tool.href.startsWith('/') ? localePath(locale, tool.href) : tool.href;
