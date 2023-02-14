export const siteTitle = 'Coffee Break Point'
export const siteDescription = 'コーヒー休憩にちょうどよい技術よみものを目指して'
export const siteUrl = 'https://blog.shaba.dev'

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
    handle: '@shaba_raba',
    site: '@shaba_raba',
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
      href: 'https://blog.shaba.dev/rss/feed.xml',
    },
    {
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "Atom",
      href: 'https://blog.shaba.dev/rss/atom.xml',
    },

  ],
};
