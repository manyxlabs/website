import { tools } from './data/tools';
import { EMAIL, FOUNDER, GITHUB } from './site';

const SITE = 'https://www.manyxlabs.com';

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'Manyx Labs',
  alternateName: 'ManyxLabs',
  url: `${SITE}/`,
  logo: `${SITE}/apple-touch-icon.png`,
  description: 'A Bengaluru software studio building applied AI tools, SaaS products and free everyday utilities.',
  email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressCountry: 'IN' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: EMAIL },
  founder: {
    '@type': 'Person',
    name: 'Manish R',
    url: FOUNDER,
    sameAs: ['https://github.com/manishonai', 'https://www.linkedin.com/in/manishonai', 'https://x.com/manishonai'],
  },
  sameAs: [GITHUB],
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  name: 'Manyx Labs',
  alternateName: 'ManyxLabs',
  url: `${SITE}/`,
  inLanguage: 'en',
  publisher: { '@id': organization['@id'] },
};

// Only live products: one still being built has no page for a result to lead to.
export const products = {
  '@type': 'ItemList',
  name: 'Manyx Labs products',
  itemListElement: tools
    .flatMap((tool) => (tool.status === 'live' ? [tool] : []))
    .map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.summary,
        url: new URL(tool.href, SITE).href,
        applicationCategory: tool.applicationCategory,
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@id': organization['@id'] },
      },
    })),
};

export const breadcrumbs = (trail: [name: string, path: string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
});
