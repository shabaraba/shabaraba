export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://shaba.dev/blog'

export default {
  defaultTitle: siteTitle,
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    site_name: siteTitle,
    url: siteUrl,
  },
  twitter: {
    handle: '@shaba_dev',
    site: '@shaba_dev',
    cardType: 'summary_large_image',
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
      href: 'https://shaba.dev/blog/rss/feed.xml',
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "Atom",
      href: 'https://shaba.dev/blog/rss/atom.xml',
    },

  ],
};
