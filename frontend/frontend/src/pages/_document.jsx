import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="A Next.js and FastAPI powered Zoom Clone" />
      </Head>
      <body className="bg-zoom-dark text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}