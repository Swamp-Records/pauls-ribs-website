import type { ReactNode } from 'react'

import PageWithFooterLayout from '@/components/page-with-footer-layout'

export default function EpkLayout({ children }: { children: ReactNode }) {
  return <PageWithFooterLayout>{children}</PageWithFooterLayout>
}
