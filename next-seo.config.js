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
  description: siteDescription,
};
