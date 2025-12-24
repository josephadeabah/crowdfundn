// app/components/seo/CampaignStructuredData.tsx
import Script from 'next/script';

interface CampaignStructuredDataProps {
  campaign: any;
}

export default function CampaignStructuredData({
  campaign,
}: CampaignStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FundingAgency',
    name: campaign.title,
    description: campaign.seo_description,
    url:
      campaign.canonical_url ||
      `https://www.bantuhive.com/campaign/${campaign.slug}`,
    image: campaign.media_url,
    funder: {
      '@type': 'Organization',
      name: campaign.fundraiser?.name || campaign.fundraiser?.full_name,
      url: `https://www.bantuhive.com/user/${campaign.fundraiser_id}`,
    },
    location: {
      '@type': 'Place',
      name: campaign.location,
    },
    currency: campaign.currency_code || 'USD',
    amount: {
      '@type': 'MonetaryAmount',
      currency: campaign.currency_code || 'USD',
      value: campaign.goal_amount,
    },
    collectedAmount: {
      '@type': 'MonetaryAmount',
      currency: campaign.currency_code || 'USD',
      value: campaign.transferred_amount || campaign.current_amount,
    },
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    remainingDays: campaign.remaining_days,
  };

  return (
    <Script
      id="campaign-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
