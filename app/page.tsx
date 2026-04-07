import Image from 'next/image'

import SiteFooter from '@/components/footer'
import PageHero from '@/components/page-hero'

export default function Home() {
  return (
    <main className="home-page">
      <PageHero className="home-hero-panel" ariaLabel="Home page navigation">
        <div className="home-hero-spotify">
          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/artist/2cJQgEbtk4ACdnSp7ao7Kg?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Paul's Ribs Spotify embed"
          />
        </div>
      </PageHero>

      <section className="home-story-grid">
        <div className="home-story-copy">
          <h1 className="home-band-heading">Paul&apos;s Ribs</h1>
          <p>
            Paul&apos;s Ribs is an indie fusion band with elements of jazz and rock
            with a background in folk music. Made up of three friends - Ana
            Poacelli, Manny Mondrono, and Dylan Lore, this band made an
            immediate effect on the local scene booking shows around town.
          </p>
          <p>
            They blend jazz, rock, and folk influences into a unique sound that
            feels like being lost in a dream thinking of all your desires, wants,
            and wishes. A glimpse into what could&apos;ve been. They know how to
            captivate a room and bring in a crowd.
          </p>
        </div>

        <div className="home-story-image" aria-hidden="true">
          <Image
            src="/assets/SubHomePic.jpg"
            alt=""
            className="home-story-image-photo"
            width={1200}
            height={1600}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
