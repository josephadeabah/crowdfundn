import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function fetchCampaigns() {
  const response = await fetch(
    'https://api.bantuhive.com/api/v1/fundraisers/campaigns?per_page=50&status=active&is_public=true',
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'bantuhive-sitemap',
      },
    }
  );

  if (!response.ok) return [];

  const data = await response.json();
  return (data.campaigns || []).filter(
    (c) => c.slug && c.appear_in_search_results !== false
  );
}

export async function GET() {
  const campaigns = await fetchCampaigns();
  const baseUrl = 'https://www.bantuhive.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${campaigns.map((c) => `
  <url>
    <loc>${baseUrl}/campaign/${c.slug}</loc>
    <lastmod>${new Date(c.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
