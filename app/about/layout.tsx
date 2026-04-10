import type { ReactNode } from 'react'

import PageWithFooterLayout from '@/components/page-with-footer-layout'

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <PageWithFooterLayout>{children}</PageWithFooterLayout>
}
