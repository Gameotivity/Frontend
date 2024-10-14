import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { Logo, StickyHeader } from '@/common/components'

export interface HeaderProps {
  baseUrl: string
  endSlot?: React.ReactNode
  links: { to: string; label: string }[]
  topContent?: React.ReactNode
}

const Header = ({ baseUrl, links = [], endSlot, topContent }: HeaderProps) => {
  const { pathname } = useLocation()

  const items = useMemo(
    () =>
      links.map((item) => ({
        ...item,
        isActive: !!matchPath({ path: item.to, end: true }, pathname),
      })),
    [pathname, links],
  )

  return (
    <StickyHeader
      logo={<Logo to={baseUrl} />}
      drawer={<StickyHeader.Drawer headerSlot={<Logo to={baseUrl} />} items={items} />}
      middleSlot={<StickyHeader.Nav items={items} />}
      endSlot={endSlot}
      topContent={topContent}
    />
  )
}

export default Header
