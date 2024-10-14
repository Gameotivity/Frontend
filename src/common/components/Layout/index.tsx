import { type ReactNode } from 'react'

import Header, { type HeaderProps } from '@/common/components/Header'
import Footer from '../Footer'

interface Props {
  children: ReactNode
  headerProps: HeaderProps
}

const Layout = ({ children, headerProps }: Props) => (
  <>
    <div className="flex min-h-screen w-full flex-col">
      <Header
        baseUrl={headerProps.baseUrl}
        links={headerProps.links}
        endSlot={headerProps.endSlot}
        topContent={headerProps.topContent}
      />
      <main className="container relative mb-auto flex h-full w-full grow py-8">{children}</main>
      <Footer />
    </div>
  </>
)

export default Layout
