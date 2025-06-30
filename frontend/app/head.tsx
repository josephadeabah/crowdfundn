export default function Head() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>
        BantuHive | Fund & Invest in Africa's Top Startups & Impact Projects
      </title>
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
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
      <meta property="og:image" content="https://bantuhive.com/og-image.jpg" />
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
      <meta
        name="twitter:image"
        content="https://bantuhive.com/twitter-card.jpg"
      />

      {/* Google Tag Manager */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-YWLECWF7W7"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YWLECWF7W7');
          `,
        }}
      />
    </>
  );
}
