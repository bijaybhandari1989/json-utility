export const SITE = {
  name: 'JSON Utilities',
  tagline:
    'Format JSON and encode or decode JWTs in your browser — nothing leaves your device',
  description:
    'Free client-side JSON Utilities: pretty-print, minify, and sort JSON; explore data with a collapsible tree; encode and decode JWT tokens (HS256 and RS256); verify signatures. Your data never leaves the browser.',
  url: 'https://jsonutility.bijaybhandari.com',
  github: 'https://github.com/bijaybhandari1989/json-utility',
  author: 'Bijay Bhandari',
  keywords: [
    'JSON formatter',
    'JSON beautifier',
    'JSON minify',
    'JSON viewer',
    'JWT decode',
    'JWT encode',
    'JWT verifier',
    'HS256',
    'RS256',
    'online JSON tool',
    'JWT debugger',
    'json utility',
  ].join(', '),
  ogImage: '/apple-touch-icon.png',
} as const

export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  browserRequirements: 'Requires JavaScript',
  featureList: [
    'Format and minify JSON',
    'Collapsible JSON tree viewer',
    'Decode JWT tokens',
    'Encode and sign JWT tokens',
    'Verify JWT signatures (HS256, RS256)',
  ],
  author: {
    '@type': 'Person',
    name: SITE.author,
  },
  codeRepository: SITE.github,
  isAccessibleForFree: true,
}
