import type { Metadata } from 'next'
import { Fondamento, Gayathri } from 'next/font/google'

import './globals.css'

const fondamento = Fondamento({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--site-font-display',
})

const gayathri = Gayathri({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  variable: '--site-font-body',
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
      <body
        className={`${fondamento.className} ${gayathri.className} ${fondamento.variable} ${gayathri.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
