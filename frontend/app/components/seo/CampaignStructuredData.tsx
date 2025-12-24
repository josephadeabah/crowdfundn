// app/components/seo/CampaignStructuredData.tsx
import Script from 'next/script';

interface CampaignStructuredDataProps {
  campaign: any;
}

export default function CampaignStructuredData({
  campaign,
}: CampaignStructuredDataProps) {
  // Only render on client
  if (typeof window === 'undefined') return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CrowdfundingCampaign', // Changed from FundingAgency
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

  return (
    <Script
      id="campaign-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
