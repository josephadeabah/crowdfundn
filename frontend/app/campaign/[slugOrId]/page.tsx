// app/campaign/[slugOrId]/page.tsx - Updated version
import { Metadata } from 'next';
import SingleCampaignPage from '../SingleCampaignPage';

export async function generateMetadata({
  params,
}: {
  params: { slugOrId: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/fundraisers/campaigns/${params.slugOrId}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      return {
        title: 'Campaign | BantuHive',
        description: 'Explore this fundraising campaign on BantuHive',
      };
    }

    const campaign = await res.json();

    // Build structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CrowdfundingCampaign',
      name: campaign.title,
      description:
        campaign.seo_description ||
        campaign.description?.plain_text?.substring(0, 300) ||
        `Fundraising campaign for ${campaign.title}`,
      url:
        campaign.canonical_url ||
        `https://www.bantuhive.com/campaign/${campaign.slug}`,
      image: campaign.media_url,
      location: {
        '@type': 'Place',
        name: campaign.location || 'Online',
      },
      currency: campaign.currency_code || 'USD',
      funder: {
        '@type':
          campaign.fundraiser?.type === 'Organization'
            ? 'Organization'
            : 'Individual',
        name:
          campaign.fundraiser?.name ||
          campaign.fundraiser?.full_name ||
          'Anonymous',
        url: `https://www.bantuhive.com/user/${campaign.fundraiser_id}`,
      },
      funding: {
        '@type': 'MonetaryAmount',
        currency: campaign.currency_code || 'USD',
        value: campaign.goal_amount,
      },
      amountRaised: {
        '@type': 'MonetaryAmount',
        currency: campaign.currency_code || 'USD',
        value: campaign.transferred_amount || campaign.current_amount || 0,
      },
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      campaignStatus:
        campaign.status === 'active'
          ? 'Active'
          : campaign.status === 'completed'
            ? 'Successful'
            : campaign.status === 'canceled'
              ? 'Failed'
              : 'Unknown',
    };

    return {
      title: campaign.seo_title || campaign.title,
      description: campaign.seo_description,
      alternates: {
        canonical:
          campaign.canonical_url ||
          `https://www.bantuhive.com/campaign/${campaign.slug}`,
      },
      openGraph: {
        title: campaign.seo_title || campaign.title,
        description: campaign.seo_description,
        url:
          campaign.canonical_url ||
          `https://www.bantuhive.com/campaign/${campaign.slug}`,
        images: campaign.media_url
          ? [
              {
                url: campaign.media_url,
                width: 1200,
                height: 630,
                alt: campaign.title,
              },
            ]
          : [],
        type: 'article',
        publishedTime: campaign.created_at,
        modifiedTime: campaign.updated_at,
      },
      twitter: {
        card: 'summary_large_image',
        title: campaign.seo_title || campaign.title,
        description: campaign.seo_description,
        images: campaign.media_url ? [campaign.media_url] : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      // ADD THIS for better SEO
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Campaign | BantuHive',
      description: 'Explore this fundraising campaign on BantuHive',
    };
  }
}

export default function CampaignPage({
  params,
}: {
  params: { slugOrId: string };
}) {
  return <SingleCampaignPage />;
}
