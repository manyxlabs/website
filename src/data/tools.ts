// A live tool must have somewhere to send people; one still being built must not.
export type Tool = { name: string; summary: string; note?: string } & (
  | { status: 'building' }
  | { status: 'live'; href: string }
);

export const tools: Tool[] = [
  {
    name: 'Form Photo & Signature Resizer',
    summary:
      'Get your photo and signature to the exact KB, pixel size and format that exam, passport and bank forms ask for.',
    note: 'Runs in your browser. Nothing is uploaded.',
    status: 'building',
  },
  {
    name: 'Mutual Fund Screener',
    summary:
      'Compare Indian mutual funds on rolling returns, risk and how each one really did against its peers, with every number explained.',
    note: 'A research tool, not investment advice.',
    status: 'building',
  },
];
