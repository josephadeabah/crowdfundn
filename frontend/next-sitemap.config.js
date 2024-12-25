const config = {
  siteUrl: 'https://bantuhive.com', // Replace with your domain
  generateRobotsTxt: true, // (Optional) Generate a robots.txt file
  transform: async (config, path) => {
    return {
      loc: path, // The URL
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7, // Prioritize the homepage
      lastmod: new Date().toISOString(), // Last modified date
    };
  },
  sitemapSize: 5000, // Split sitemap into multiple files if it exceeds 5000 URLs
  changefreq: 'daily', // Suggested update frequency for your pages
  priority: 0.7, // Default priority for pages
  exclude: ['/admin/*', '/account/*', '/thank-you'], // Exclude specific pages or routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    additionalSitemaps: ['https://bantuhive.com/sitemap.xml'],
  },
};

export default config;
