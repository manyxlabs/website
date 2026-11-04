import { GITHUB } from '../site';

// A live tool must have somewhere to send people; one still being built must not.
/**
 * `icon` is a 24px stroked SVG path; `tint` the two ends of its tile's gradient.
 * `applicationCategory` is one of schema.org's, for the product's structured data.
 */
export type Tool = {
  name: string;
  category: string;
  summary: string;
  note?: string;
  icon: string;
  tint: [string, string];
} & (
  | { status: 'building' }
  | { status: 'live'; href: string; source?: string; applicationCategory: string }
);

export const tools: Tool[] = [
  {
    name: 'Form & Paperwork Tools',
    category: 'Everyday utility',
    icon: 'M4 5h16v14H4zM4 15l4.5-4.5 4 4 2.5-2.5 5 5M15.5 9.5h.01',
    tint: ['#10b981', '#0ea5e9'],
    summary:
      'Photo, signature and passport photo resizing for exam, bank and PAN forms, PDF compression, Aadhaar masking, rent receipts and GST invoices.',
    note: 'Runs in your browser. Nothing is uploaded.',
    status: 'live',
    href: '/tools/',
    applicationCategory: 'UtilitiesApplication',
    source: `${GITHUB}/photo-resizer`,
  },
  {
    name: 'Mutual Fund Screener',
    category: 'Finance research',
    icon: 'M4 4v16h16M8 15l3.5-4 3 3L20 7',
    tint: ['#6366f1', '#a855f7'],
    summary:
      'Screen and compare every active Indian mutual fund on rolling returns, risk and how each one really did against its peers, with every number explained. Rebuilt daily from AMFI.',
    note: 'A research tool, not investment advice.',
    status: 'live',
    href: 'https://screener.manyxlabs.com/',
    applicationCategory: 'FinanceApplication',
    source: `${GITHUB}/mf-screener`,
  },
  {
    name: 'Gloss Reader',
    category: 'Reading & research',
    icon: 'M4 4h8v16H4zM7 8h2M7 12h2M15 6h5v5h-5zM15 14h5v5h-5zM12 8.5h3M12 16.5h3',
    tint: ['#f59e0b', '#ec4899'],
    summary:
      'Read PDFs, Word and PowerPoint files and web pages next to a canvas: pull passages out, arrange and connect them, write by hand, and jump back to the exact line any excerpt came from.',
    note: 'Runs in your browser. Shared projects are end-to-end encrypted.',
    status: 'live',
    href: 'https://gloss.manyxlabs.com/',
    applicationCategory: 'EducationalApplication',
  },
];
