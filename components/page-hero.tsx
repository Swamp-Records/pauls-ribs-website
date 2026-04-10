import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

import Navibar from '@/components/navibar'

type PageHeroProps = {
  ariaLabel: string
  className: string
  children?: ReactNode
}

export default function PageHero({
  ariaLabel,
  className,
  children,
}: PageHeroProps) {
  return (
    <section className={className}>
      <Navibar
        className="home-site-nav"
        linksClassName="home-site-nav-links"
        socialsClassName="home-site-nav-socials"
        socialItemClassName="home-site-nav-social-item"
        iconSize={40}
        ariaLabel={ariaLabel}
      />

      <Link href="/" className="home-hero-logo-wrap" aria-label="Paul's Ribs home">
        <Image
          src="/assets/PaulsRibsLogo.svg"
          alt="Paul's Ribs logo"
          className="home-hero-logo"
          width={420}
          height={420}
          priority
        />
      </Link>

      {children}
    </section>
  )
}
