import type { ReactNode } from 'react'

import SiteFooter from '@/components/footer'

type PageWithFooterLayoutProps = {
  children: ReactNode
}

export default function PageWithFooterLayout({
  children,
}: PageWithFooterLayoutProps) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  )
}
