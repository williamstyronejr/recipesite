import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Besley:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          sizes="16x16"
          type="image/png"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          sizes="32x32"
          type="image/png"
          href="/favicon-32x32.png"
        />

        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/apple-touch-icon.png"
        />

        <link
          rel="android-chrome"
          sizes="192x192"
          type="image/png"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="android-chrome"
          sizes="192x192"
          type="image/png"
          href="/android-chrome-192x192.png"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.13.0/devicon.min.css"
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
