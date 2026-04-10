import type { Metadata } from 'next'
import { Caveat, Inter } from 'next/font/google'

import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
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
    <html lang="en">
      <body className={`${caveat.variable} ${inter.variable}`}>{children}</body>
    </html>
  )
}
