export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://blog.from-garage.com'

export default {
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: process.env.SITE_URL || siteUrl,
    site_name: siteTitle,
  },
  twitter: {
    handle: '@shaba_raba',
    site: '@shaba_raba',
    cardType: 'summary',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon3.ico',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: "RSS2.0",
      href: 'https://blog.from-garage.com/rss/feed.xml',
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "Atom",
      href: 'https://blog.from-garage.com/rss/atom.xml',
    },

  ],
  description: siteDescription,
};
