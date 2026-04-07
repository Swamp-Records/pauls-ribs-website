import PageHero from '@/components/page-hero'

export default function EpkPage() {
  return (
    <main className="epk-page">
      <PageHero className="epk-hero-panel" ariaLabel="EPK page navigation" />

      <section className="about-story-section">
        <div className="container">
          <div className="about-copy">
            <h1 className="about-page-heading">Electronic Press Kit</h1>
            <p className="about-page-body">
              This page will contain Paul&apos;s Ribs&apos; official press materials.
            </p>
            <p className="about-page-body">
              Media, photos, music, and booking information will be available here.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
