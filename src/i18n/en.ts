// The English copy, and the shape every other language's catalogue must match key for key.
// {name} is filled in by fmt(); each language must use the same names (the build checks).
// `language`, `header` and `footer` match the free tools' catalogues (manyxlabs/photo-resizer),
// since both sites share one header and visitors cross between them.

const en = {
  /** Shown in the language menu of every page. */
  language: 'Language',

  header: {
    home: 'Manyx Labs home',
    nav: 'Main',
    products: 'Products',
    work: 'Work with us',
    theme: 'Switch theme',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
  },

  footer: {
    place: 'Manyx Labs, Bengaluru',
    nav: 'Elsewhere',
    tools: 'Free tools',
    guides: 'Size guides',
    founder: 'Founder',
    email: 'Email',
  },

  home: {
    title: 'Manyx Labs - Applied AI, SaaS and everyday software',
    description:
      'Manyx Labs is a Bengaluru software studio making Gloss Reader for PDFs, a mutual fund screener and form photo tools. All free, private by default, no ads.',
    ogAlt: 'Manyx Labs: software that does the work for you, with its products',
    heading: 'Software that does the work for you.',
    lede: 'Manyx Labs builds applied AI tools, SaaS products and everyday utilities. Each one does its job properly: fast, private by default, and clear about what it does.',
    seeProducts: 'See our products',
    products: {
      eyebrow: 'Products',
      heading: 'Use them today, free.',
      aside: 'No signup, no ads. More on the way.',
      live: 'Live',
      building: 'In progress',
      source: 'Source code on GitHub',
      sourceOf: '{name} source code on GitHub',
      idea: 'Got a problem worth solving?',
      share: 'Share an idea',
      /** The products' structured data, for search results. */
      list: 'Manyx Labs products',
    },
    build: {
      heading: 'What we build',
      pillars: [
        ['Applied AI tools', 'Assistants and automations that take real work off your plate, tested with evals before they ship.'],
        ['SaaS products', 'Focused software for teams and businesses, reliable enough to run every day without babysitting.'],
        ['Everyday utilities', 'Free tools for the small chores, like getting a form photo to size or comparing mutual funds.'],
      ],
    },
    how: {
      heading: 'How we build',
      principles: [
        ['Useful first', 'Every product starts from a real problem people hit again and again.'],
        ['Private by default', 'If work can run on your device, it does. We never sell your data.'],
        ['Measured, not guessed', 'AI features are evaluated, so they behave the same in production as in the demo.'],
        ['No dark patterns', 'No pop-ups, no fake download buttons, no upsell traps.'],
      ],
    },
    teams: {
      heading: 'Engineering AI that holds up in production.',
      body: 'We also build for other teams: multi-agent workflows, retrieval and evals, designed and shipped so they behave the same in production as in the demo.',
      book: 'Book a call',
    },
  },

  /** Each product's card; the names stay as they are in every language. */
  tools: {
    tools: {
      category: 'Everyday utility',
      summary:
        'Photo, signature and passport photo resizing for exam, bank and PAN forms, PDF compression, Aadhaar masking, rent receipts and GST invoices.',
      note: 'Runs in your browser. Nothing is uploaded.',
      open: 'Open tools',
    },
    screener: {
      category: 'Finance research',
      summary:
        'Screen and compare every active Indian mutual fund on rolling returns, risk and how each one really did against its peers, with every number explained. Rebuilt daily from AMFI.',
      note: 'A research tool, not investment advice.',
      open: 'Open screener',
    },
    gloss: {
      category: 'Reading & research',
      summary:
        'Read PDFs, Word and PowerPoint files and web pages next to a canvas: pull passages out, arrange and connect them, write by hand, and jump back to the exact line any excerpt came from.',
      note: 'Runs in your browser. Shared projects are end-to-end encrypted.',
      open: 'Open reader',
    },
  },

  notFound: {
    title: 'Page not found - Manyx Labs',
    description: 'This page does not exist.',
    heading: "This page doesn't exist.",
    back: 'Back to Manyx Labs',
  },
};

export type Messages = typeof en;
export default en;
