import type { ReactNode } from 'react'

import PageWithFooterLayout from '@/components/page-with-footer-layout'
import styles from '@/components/contact-form.module.css';

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <PageWithFooterLayout>{children}</PageWithFooterLayout>
}
