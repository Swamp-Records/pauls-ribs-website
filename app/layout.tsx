import type { Metadata } from 'next'

import './globals.css'

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
      <body>
        {children}
      </body>
    </html>
  )
}
