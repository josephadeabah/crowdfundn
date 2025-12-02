/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://bantuhive.com',
  generateRobotsTxt: true,

  // Don't transform during build if API might fail
  transform: async (config, path) => {
    // Skip individual campaign pages as they're in a separate sitemap
    if (path.startsWith('/campaign/')) {
      return null;
    }

    return {
      loc: path,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/account',
    '/account/*',
    '/thank-you',
    '/campaign/*',
    '/api/sitemap/*', // Exclude sitemap API from main sitemap
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account', '/api'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/account', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://bantuhive.com/api/sitemap/campaigns',
      'https://bantuhive.com/sitemap-0.xml',
    ],
  },
};

export default config;
