module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://shaba.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/blog/posts/*', // ブログ投稿は動的ページのため除外
  ],
  additionalPaths: async (config) => {
    const result = [];
    
    // ポートフォリオの主要ページを追加
    result.push({
      loc: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });
    
    result.push({
      loc: '/blog',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
    
    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
