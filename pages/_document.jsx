import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Get basePath from environment or use default
  const basePath = process.env.NODE_ENV === 'production' ? '/tri-huynh-portfolio' : '';

  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Tri Huynh - AI & Backend Engineer. I build intelligent systems that turn messy data into useful products." />
        <meta name="keywords" content="Full-Stack Developer, AI Engineer, Machine Learning, Backend Developer, Tri Huynh, Northeastern" />
        <meta name="author" content="Tri Huynh" />
        <meta name="theme-color" content="#0e0f15" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('theme')!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()",
          }}
        />
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
