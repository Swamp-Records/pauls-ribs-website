import Link from 'next/link'

import Navibar from '@/components/navibar'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Paul&apos;s Ribs home">
          Paul&apos;s Ribs
        </Link>
        <Navibar
          className="site-navibar"
          linksClassName="site-navibar-links"
          socialsClassName="site-navibar-socials"
          socialItemClassName="site-navibar-social-item"
          iconSize={22}
          ariaLabel="Main navigation"
        />
      </div>
    </header>
  )
}
