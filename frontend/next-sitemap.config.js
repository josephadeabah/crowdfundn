/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://bantuhive.com',
  generateRobotsTxt: true,

  // Don't transform during build if API might fail
  transform: async (config, path) => {

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
    '/campaign/*'
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/account'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/account'],
      },
    ],
    additionalSitemaps: [
      'https://bantuhive.com/sitemap-0.xml',
      'https://bantuhive.com/sitemap-campaigns.xml',
    ],
  },
};

export default config;
