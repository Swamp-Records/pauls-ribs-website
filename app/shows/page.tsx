import PageHero from '@/components/page-hero'

const shows = [
  {
    id: 'shows-1',
    date: 'APRIL 3, 2026',
    venue: "Loosey's Downtown",
    city: 'Gainesville, FL',
    ticketHref: '#',
  },
  {
    id: 'shows-2',
    date: 'APRIL 3, 2026',
    venue: "Loosey's Downtown",
    city: 'Gainesville, FL',
    ticketHref: '#',
  },
  {
    id: 'shows-3',
    date: 'APRIL 3, 2026',
    venue: "Loosey's Downtown",
    city: 'Gainesville, FL',
    ticketHref: '#',
  },
]

export default function ShowsPage() {
  return (
    <main className="shows-page">
      <PageHero className="shows-hero-panel" ariaLabel="Shows page navigation" />

      <section className="shows-list-section">
        <div className="container">
          <div className="shows-copy">
            <h1 className="shows-page-heading">Shows</h1>
          </div>

          <div className="shows-cards-wrap">
            <div className="shows-cards">
              {shows.map((show) => (
                <article key={show.id} className="show-card">
                  <div className="show-card-date">
                    <p className="show-card-date-line">{show.date}</p>
                    <p className="show-card-venue-line">{show.venue}</p>
                  </div>

                  <div className="show-card-city">{show.city}</div>

                  <a href={show.ticketHref} className="show-card-ticket">
                    Tickets
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
