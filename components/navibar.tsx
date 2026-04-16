import Link from 'next/link'

import ButtonSocialIconDemo from '@/components/ui/social-icon'
import { cn } from '@/lib/utils'

type NavibarProps = {
  className?: string
  linksClassName?: string
  socialsClassName?: string
  socialItemClassName?: string
  showSocials?: boolean
  iconSize?: number
  ariaLabel?: string
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/shows', label: 'Shows' },
  { href: '/epk', label: 'EPK' },
  { href: '/contact', label: 'Contact' },
]

export default function Navibar({
  className,
  linksClassName,
  socialsClassName,
  socialItemClassName,
  showSocials = true,
  iconSize = 28,
  ariaLabel = 'Site navigation',
}: NavibarProps) {
  return (
    <div className={cn('navibar', className)}>
      <nav className={cn('navibar-links', linksClassName)} aria-label={ariaLabel}>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      {showSocials ? (
        <ButtonSocialIconDemo
          className={cn('navibar-socials', socialsClassName)}
          itemClassName={cn('navibar-social-item', socialItemClassName)}
          showLabels={false}
          iconSize={iconSize}
        />
      ) : null}
    </div>
  )
}
