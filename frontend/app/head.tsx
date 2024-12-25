export default function Head() {
  return (
    <>
      <title>Fundraising Made Easy for Africa & Diaspora</title>
      <meta
        name="description"
        content="Raise Money When You Need, Fund or Support Causes You Care About, Reach Donors and Make a Difference."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="keywords"
        content="fundraising, Africa, diaspora, charity, donations, nonprofit"
      />
      <meta
        property="og:title"
        content="Fundraising Made Easy for Africa & Diaspora"
      />
      <meta
        property="og:description"
        content="Raise Money When You Need, Fund or Support Causes You Care About, Reach Donors and Make a Difference."
      />
      <meta property="og:image" content="/marketing7.png" />
      <meta property="og:url" content="https://bantuhive.com" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bantu Hive" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bantuhive" />
      <meta
        name="twitter:description"
        content="Raise Money When You Need, Fund or Support Causes You Care About, Reach Donors and Make a Difference."
      />
      <meta name="twitter:image" content="/marketing6.png" />
      <meta
        name="twitter:title"
        content="Fundraising Made Easy for Africa & Diaspora"
      />
      <link rel="icon" href="/bantuhive.ico" />
      <link rel="canonical" href="https://bantuhive.com" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Bantu Hive',
            url: 'https://bantuhive.com',
            logo: 'https://bantuhive.com/bantuhive.ico',
            description:
              'Raise Money When You Need, Fund or Support Causes You Care About, Reach Donors and Make a Difference.',
            sameAs: [
              'https://web.facebook.com/profile.php?id=61568192851056',
              'https://www.instagram.com/bantuhive_fund/',
              'https://www.linkedin.com/company/bantu-hive/about/',
            ],
          }),
        }}
      />
    </>
  );
}
