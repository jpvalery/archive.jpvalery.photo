import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import IntroCard from '../components/IntroCard'
import Modal from '../components/Modal'
import cloudinary from '../utils/cloudinary'
import getBase64ImageUrl from '../utils/generateBlurPlaceholder'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      document
        .querySelector(`#photo-${lastViewedPhoto}`)
        .scrollIntoView({ block: 'center' })

      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  return (
    <>
      <Head>
        <title>Contact Sheets — Jp Valery</title>
        <meta
          property="og:image"
          content="https://archive.jpvalery.photo/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://archive.jpvalery.photo/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId)
            }}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <IntroCard />
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              id={`photo-${id}`}
              shallow
              className="after:content group relative cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 h-80"
            >
              <Image
                alt="Archive Photo from Jp Valery"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 object-cover"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                fill={true}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                unoptimized
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        © 1992-2022 Jp Valery. All rights reserved.
      </footer>
    </>
  )
}

export default Home

export async function getStaticProps() {

  let next_cursor = null;
  let results = [];

  for (let i = 0; i < 3; i++) {

    const res = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by('public_id', 'desc')
    .max_results(500)
    .next_cursor(next_cursor)
    .execute()

    if (res.next_cursor) {
        console.log("More photos to fetch")
        results = results.concat(res.resources)
        next_cursor = res.next_cursor
        }
    else if (res.next_cursor == undefined) {
        console.log("Last batch of photos to fetch")
        results = results.concat(res.resources)
        next_cursor = res.next_cursor
        }
    else {
        console.log("Done");
        } 
  }

  let reducedResults: ImageProps[] = []

  let i = 0
  for (let result of results) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    })
    i++
  }

  const blurImagePromises = results.map((image: ImageProps) => {
    return getBase64ImageUrl(image)
  })
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return {
    props: {
      images: reducedResults,
    },
  }
}
