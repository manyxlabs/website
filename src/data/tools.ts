import { exams } from './formSpecs';

// A live tool must have somewhere to send people; one still being built must not.
export type Tool = { name: string; summary: string; note?: string } & (
  | { status: 'building' }
  | { status: 'live'; href: string; links?: { label: string; href: string }[] }
);

export const tools: Tool[] = [
  {
    name: 'Form Photo & Signature Resizer',
    summary:
      'Get your photo and signature to the exact KB and pixel size that exam, bank and PAN forms ask for. Opens iPhone HEIC photos and scanner TIFFs too.',
    note: 'Runs in your browser. Nothing is uploaded.',
    status: 'live',
    href: '/tools/photo-resizer/',
    links: exams.map((e) => ({ label: e.name.replace('PAN card', 'PAN'), href: `/photo-size/${e.id}/` })),
  },
  {
    name: 'Mutual Fund Screener',
    summary:
      'Screen and compare every active Indian mutual fund on rolling returns, risk and how each one really did against its peers, with every number explained. Rebuilt daily from AMFI.',
    note: 'A research tool, not investment advice.',
    status: 'live',
    href: 'https://screener.manyxlabs.com/',
  },
];
