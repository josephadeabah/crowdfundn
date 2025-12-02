import { NextResponse } from 'next/server';

// Don't pre-render this route during build
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function fetchAllCampaigns() {
  let allCampaigns = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    while (currentPage <= totalPages) {
      const response = await fetch(
        `https://api.bantuhive.com/api/v1/fundraisers/campaigns?page=${currentPage}`,
        {
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
          // Don't cache during build
          cache: 'no-store',
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `Failed to fetch campaigns page ${currentPage}:`,
          response.status,
        );
        // Return empty array instead of breaking
        return [];
      }

      const data = await response.json();

      // Filter only active, public campaigns that should appear in search results
      const filteredCampaigns =
        data.campaigns?.filter(
          (campaign) =>
            campaign?.status === 'active' &&
            campaign?.is_public === true &&
            campaign?.appear_in_search_results === true &&
            campaign?.slug,
        ) || [];

      allCampaigns = [...allCampaigns, ...filteredCampaigns];
      totalPages = data.total_pages || 1;
      currentPage++;

      // Add a small delay between requests to avoid rate limiting
      if (currentPage <= totalPages) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`Fetched ${allCampaigns.length} campaigns for sitemap`);
    return allCampaigns;
  } catch (error) {
    console.error(
      'Error fetching campaigns:',
      error.name === 'AbortError' ? 'Request timed out' : error.message,
    );
    return [];
  }
}

export async function GET() {
  try {
    // Check if we're in build mode
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

    if (isBuild) {
      // Return empty sitemap during build to prevent failures
      console.log('Build mode detected - returning empty sitemap');
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

      return new NextResponse(emptyXml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, s-maxage=3600',
        },
      });
    }

    const baseUrl = 'https://www.bantuhive.com';
    const campaigns = await fetchAllCampaigns();

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${campaigns
    .map((campaign) => {
      const slug = campaign.slug;
      const lastmod = campaign.updated_at
        ? new Date(campaign.updated_at).toISOString().split('T')[0]
        : new Date(campaign.created_at).toISOString().split('T')[0];

      let priority = 0.8;
      const daysOld =
        (Date.now() - new Date(campaign.created_at).getTime()) /
        (1000 * 3600 * 24);
      if (daysOld < 30) priority = 0.9;

      return `
  <url>
    <loc>${baseUrl}/campaign/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating campaigns sitemap:', error);

    // Return empty sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(errorXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
