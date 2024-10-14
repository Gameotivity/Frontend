import { PropsWithChildren } from 'react'
import { HelmetProvider } from 'react-helmet-async'

const helmetContext = {}

const SEOProvider = ({ children }: PropsWithChildren) => (
  <HelmetProvider context={helmetContext}>{children}</HelmetProvider>
)

export default SEOProvider
