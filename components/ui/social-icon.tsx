import { SocialIcon } from 'react-social-icons'

import { cn } from '@/lib/utils'

type SocialItem = {
  url: string
  label: string
  external?: boolean
}

const items: SocialItem[] = [
  { url: 'https://open.spotify.com/artist/2cJQgEbtk4ACdnSp7ao7Kg', label: 'Spotify', external: true },
  { url: 'mailto:hello@paulsribs.com', label: 'Email' },
  { url: 'https://www.instagram.com/paulsribsband/', label: 'Instagram', external: true },
]

type ButtonSocialIconDemoProps = {
  className?: string
  itemClassName?: string
  labelClassName?: string
  showLabels?: boolean
  iconSize?: number
}

const ButtonSocialIconDemo = ({
  className,
  itemClassName,
  labelClassName,
  showLabels = true,
  iconSize = 72,
}: ButtonSocialIconDemoProps) => {
  return (
    <div className={cn('social-icon-group', className)}>
      {items.map(({ url, label, external }) => (
        <div
          key={label}
          className={cn('social-icon-item', itemClassName)}
        >
          <SocialIcon
            url={url}
            label={label}
            className="social-icon-link"
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ height: iconSize, width: iconSize }}
          />
          {showLabels ? (
            <span className={cn('social-icon-label', labelClassName)}>{label.toLowerCase()}</span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default ButtonSocialIconDemo
