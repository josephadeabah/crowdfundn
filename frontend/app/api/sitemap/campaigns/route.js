import { NextResponse } from 'next/server';

// Increase timeout if possible
export const maxDuration = 30; // 30 seconds maximum (Pro plan: 60s, Hobby: 10s)

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function fetchCampaigns() {
  try {
    // Fetch only first page with reasonable limit
    // Your API should handle filtering server-side
    const response = await fetch(
      'https://api.bantuhive.com/api/v1/fundraisers/campaigns?per_page=50&status=active&is_public=true',
      {
        headers: { Accept: 'application/json' },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(8000), // 8 second timeout
      },
    );

    if (!response.ok) {
      console.error('API response error:', response.status);
      return [];
    }

    const data = await response.json();

    // Filter for campaigns that should appear
    return (data.campaigns || []).filter(
      (campaign) =>
        campaign.slug && campaign.appear_in_search_results !== false,
    );
  } catch (error) {
    console.error('Error fetching campaigns:', error.name, error.message);
    return [];
  }
}

export async function GET() {
  try {
    const campaigns = await fetchCampaigns();
    const baseUrl = 'https://www.bantuhive.com';

    // Generate XML - keep it simple
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
        : new Date().toISOString().split('T')[0];

      return `
  <url>
    <loc>${baseUrl}/campaign/${encodeURIComponent(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex, follow',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // Return minimal valid sitemap on error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new NextResponse(errorXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
