import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="An unfiltered stream of Jp Valery's photos"
          />
          <meta property="og:site_name" content="archive.jpvalery.photo" />
          <meta
            property="og:description"
            content="An unfiltered stream of Jp Valery's photos"
          />
          <meta property="og:title" content="Contact Sheets — Jp Valery" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Contact Sheets — Jp Valery" />
          <meta
            name="twitter:description"
            content="An unfiltered stream of Jp Valery's photos"
          />
        </Head>
        <body className="bg-[#16161D] antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
