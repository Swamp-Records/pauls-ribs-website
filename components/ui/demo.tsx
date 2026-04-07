export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
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
        className="max-w-md"
      />
    </div>
  )
}
