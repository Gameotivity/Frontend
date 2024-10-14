import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { fetchMetadata } from '@/common/utils/metadata'

interface SEOProps {
  title?: string
  subtitle?: string
  description?: string
  type?: string
  image?: string
  siteName?: string
  frame?: string
}

export default function SEO({
  title,
  subtitle,
  description,
  type = 'website',
  image,
  siteName,
  frame,
}: SEOProps) {
  const [frameMetadata, setFrameMetadata] = useState<JSX.Element | JSX.Element[]>()

  useEffect(() => {
    const getMetadata = async () => {
      if (frame === undefined) return
      const metadata = await fetchMetadata(frame)
      setFrameMetadata(metadata)
    }
    getMetadata()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Helmet>
      {/* Standard metadata tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {/* End standard metadata tags */}
      {/* OG tags */}
      <meta property="og:type" content={type} />
      {title && !frameMetadata && <meta property="og:title" content={subtitle} />}
      {description && <meta property="og:description" content={description} />}
      {image && !frameMetadata && <meta property="og:image" content={image} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {/* End OG tags */}
      {frameMetadata}
    </Helmet>
  )
}
