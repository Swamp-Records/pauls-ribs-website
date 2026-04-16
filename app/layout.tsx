import type { Metadata } from 'next'
import { Fondamento, Gayathri } from 'next/font/google'

import './globals.css'

const displayFont = Fondamento({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const bodyFont = Gayathri({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: "Paul's Ribs",
  description: "Paul's Ribs official website",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
