import PageHero from '@/components/page-hero'

export default function AboutPage() {
  return (
    <main className="about-page">
      <PageHero className="about-hero-panel" ariaLabel="About page navigation" />

      <section className="about-story-section">
        <div className="container">
          <div className="about-copy">
            <h1 className="about-page-heading">About</h1>
            <p className="about-page-body">
              Paul&apos;s Ribs is an indie fusion band with elements of jazz and rock
              with a background in folk music. Made up of three friends - Ana
              Poacelli, Manny Mondrono, and Dylan Lore, this band made an
              immediate effect on the local scene booking shows around town.
            </p>
            <p className="about-page-body">
              They blend jazz, rock, and folk influences into a unique sound that
              feels like being lost in a dream thinking of all your desires, wants,
              and wishes. A glimpse into what could&apos;ve been. They know how to
              captivate a room and bring in a crowd.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
