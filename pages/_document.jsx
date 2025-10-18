import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Tri Huynh - AI & Full-Stack Developer. I build systems that make data more human." />
        <meta name="keywords" content="Full-Stack Developer, AI Engineer, Machine Learning, Web Development, Tri Huynh" />
        <meta name="author" content="Tri Huynh" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
