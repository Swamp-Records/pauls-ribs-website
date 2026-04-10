import ButtonSocialIconDemo from '@/components/ui/social-icon'

export default function SiteFooter() {
  return (
    <footer className="bottom-bar home-poster-footer">
      <div className="home-poster-copy">
        <p>&copy; 2026 Paul&apos;s Ribs. All rights reserved.</p>
        <p>Site by Swamp Records</p>
      </div>
      <div className="footer-inner">
        <ButtonSocialIconDemo
          className="home-poster-socials"
          itemClassName="home-poster-social-item"
          showLabels={false}
        />
      </div>
    </footer>
  )
}
