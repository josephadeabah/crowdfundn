import Head from 'next/head';

export default function HeadContent() {
  return (
    <Head>
      <title>Fundraising Made Easy for Africa & Diaspora</title>
      <meta
        name="description"
        content="BantuHive operates as a premier crowdfunding platform focused on facilitating fundraising efforts across Africa and the Diaspora."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="keywords"
        content="fundraising, Africa, diaspora, charity, donations, nonprofit, crowdfunding africawerise africarising startup crowdfundingstartup fintech"
      />
      <meta
        property="og:title"
        content="Fundraising Made Easy for Africa & Diaspora"
      />
      <meta
        property="og:description"
        content="BantuHive operates as a premier crowdfunding platform focused on facilitating fundraising efforts across Africa and the Diaspora."
      />
      <meta property="og:image" content="/marketing7.png" />
      <meta property="og:url" content="https://bantuhive.com" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Bantu Hive" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bantuhive" />
      <meta
        name="twitter:description"
        content="BantuHive operates as a premier crowdfunding platform focused on facilitating fundraising efforts across Africa and the Diaspora."
      />
      <meta name="twitter:image" content="/marketing6.png" />
      <meta
        name="twitter:title"
        content="Fundraising Made Easy for Africa & Diaspora"
      />
      <link rel="icon" href="/bantuhive.ico" type="image/x-icon" />
      {/* <link rel="icon" href="/bantu-hive.svg" type="image/svg+xml" /> */}
      {/* <link rel="canonical" href="https://bantuhive.com" /> */}

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
              'BantuHive operates as a premier crowdfunding platform focused on facilitating fundraising efforts across Africa and the Diaspora.',
            foundingDate: '2024',
            foundingLocation: {
              '@type': 'Place',
              name: 'Africa',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+233200415683',
              contactType: 'customer service',
              email: 'help@bantuhive.com',
              areaServed: 'Africa, Diaspora',
            },
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'IVY Street, Kingstel Hotel Avenue',
              addressLocality: 'Takoradi',
              addressRegion: 'Western Region',
              postalCode: '982',
              addressCountry: 'Ghana',
            },
            sameAs: [
              'https://web.facebook.com/profile.php?id=61568192851056',
              'https://www.instagram.com/bantuhive_fund/',
              'https://www.linkedin.com/company/bantu-hive/about/',
            ],
          }),
        }}
      />
    </Head>
  );
}
