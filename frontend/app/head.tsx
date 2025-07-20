// app/head.tsx
export default function HeadComponent() {
  return (
    <head>
      <title>Fund and Invest in Ghana's Top Startups and Impact Projects</title>
      <meta
        name="description"
        content="BantuHive: Africa's all-in-one fundraising platform connecting investors with promising startups and impact projects. Crowdfunding, donations, and investment opportunities."
      />
      <meta
        name="keywords"
        content="African startups, impact investing, crowdfunding Africa, diaspora funding, African fintech, social impact projects, venture capital Africa"
      />
      <link rel="canonical" href="https://bantuhive.com" />

      {/* Favicon and App Icons */}
      <link rel="icon" href="/bantuhive.ico" />
      <link rel="icon" href="/bantuhive.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Open Graph / Social Meta Tags */}
      <meta
        property="og:title"
        content="BantuHive | Fund & Invest in Africa's Top Startups"
      />
      <meta
        property="og:description"
        content="Africa's all-in-one fundraising platform connecting investors with promising startups and impact projects."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://bantuhive.com" />
      <meta property="og:image" content="/bantuhive.svg" />
      <meta property="og:site_name" content="BantuHive" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="BantuHive | Fund & Invest in Africa's Top Startups"
      />
      <meta
        name="twitter:description"
        content="Africa's premier fundraising platform for startups and impact projects."
      />
      <meta name="twitter:image" content="/bantuhive.svg" />
    </head>
  );
}
