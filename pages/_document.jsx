import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Get basePath from environment or use default
  const basePath = process.env.NODE_ENV === 'production' ? '/tri-huynh-portfolio' : '';
  // Google Analytics (the GA4 property GitTimeline uses), production only. Resume links carry
  // utm_source=resume&utm_campaign=<version or employer>, which GA reports as source and campaign.
  const gaId = process.env.NODE_ENV === 'production' ? 'G-P95G05P1BJ' : '';

  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="author" content="Tri Huynh" />
        <meta name="theme-color" content="#0e0f15" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('theme')!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()",
          }}
        />
        {gaId && <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />}
        {gaId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
            }}
          />
        )}
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
