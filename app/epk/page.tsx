// import PageHero from '@/components/page-hero'

// export default function EpkPage() {
//   return (
//     <main className="epk-page">
//       <PageHero className="epk-hero-panel" ariaLabel="EPK page navigation" />

//       <section className="about-story-section">
//         <div className="container">
//           <div className="about-copy">
//             <h1 className="about-page-heading">Electronic Press Kit</h1>
//             <p className="about-page-body">
//               This page will contain Paul&apos;s Ribs&apos; official press materials.
//             </p>
//             <p className="about-page-body">
//               Media, photos, music, and booking information will be available here.
//             </p>
//             {/* 1. Outer Container: Centers everything and limits width */}
// <div style={{ 
//   maxWidth: '800px', // Limits width so it's not too huge on desktop
//   margin: '3rem auto', // "auto" on left/right does the centering
//   padding: '0 1rem'   // Adds breathing room on mobile
// }}>

//   {/* 2. Aspect Ratio Wrapper: Keeps it looking like a piece of paper */}
//   <div style={{
//     position: 'relative',
//     paddingTop: '141.4%', // A4 Paper Aspect Ratio
//     width: '100%',
//     boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
//     borderRadius: '8px',
//     overflow: 'hidden',
//     backgroundColor: '#333'
//   }}>
//     <iframe
//       src="/assets/EPK.pdf#toolbar=0&navpanes=0&scrollbar=0"
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         border: 'none',
//       }}
//       title="Paul's Ribs EPK"
//     />
//   </div>
  
//   {/* 3. Optional: Centered Download Link below the viewer */}
//   <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
//     <a href="/assets/EPK.pdf" download style={{ color: '#666', textDecoration: 'underline' }}>
//       Download Press Kit PDF
//     </a>
//   </div>
// </div>



//           </div>
//         </div>
//       </section>
//     </main>
//   )
// }
'use client'

import dynamic from 'next/dynamic' // 1. Add this import
import PageHero from '@/components/page-hero'
import Image from 'next/image'

// 2. Load InstagramEmbed dynamically and disable Server Side Rendering (ssr: false)
const InstagramEmbed = dynamic(
  () => import('react-social-media-embed').then((mod) => mod.InstagramEmbed),
  { ssr: false }
)

export default function EpkPage() {
  return (
    <main className="epk-page">
      <PageHero className="epk-hero-panel" ariaLabel="EPK page navigation" />

      {/* --- Section 1: Bio --- */}
      <section className="about-story-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="about-copy" style={{ margin: '0 auto' }}>
            {/* This will use Caveat because of your CSS h1 rule */}
            <h1 className="about-page-heading" style={{ fontStyle: 'italic', marginBottom: '32px' }}>
              Electronic Press Kit
            </h1>
            <p className="about-page-body">
              Paul&apos;s Ribs is an indie fusion band with elements of jazz and rock with a background in folk music. 
              Made up of three friends - Ana Ponceti, Manny Mondrono, and Dylan Lore, this band made an immediate 
              effect on the local scene booking shows around town.
            </p>
            <p className="about-page-body">
              They blend jazz, rock, and folk influences into a unique sound that feels like being lost in a dream 
              thinking of all your desires, wants, and wishes. A glimpse into what could&apos;ve been. 
              They know how to captivate a room and bring in a crowd.
            </p>
          </div>
        </div>
      </section>

      {/* --- Section 2: Image Gallery --- */}
      <section style={{ background: '#f5eadc', paddingBottom: '60px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0px' }}>
            <div style={{ aspectRatio: '4/5', position: 'relative' }}>
              <Image src="/assets/epk1.jpg" alt="Band" fill className="object-cover" />
            </div>
            <div style={{ aspectRatio: '4/5', position: 'relative' }}>
              <Image src="/assets/epk2.jpg" alt="Band" fill className="object-cover" />
            </div>
            <div style={{ aspectRatio: '4/5', position: 'relative' }}>
              <Image src="/assets/epk3.jpg" alt="Band" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Latest Single --- */}
      <section style={{ padding: '80px 0', background: '#f5eadc', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontStyle: 'italic', marginBottom: '40px' }}>
            Our Latest Single
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
            <div style={{ width: '280px', height: '280px', position: 'relative', boxShadow: 'var(--shadow)' }}>
              <Image src="/assets/epk1.jpg" alt="Album Art" fill />
            </div>
            <a 
    href="https://open.spotify.com/track/3D5iOTKWdFj0JK9fkBnZzd?si=12e833598b9147aa" 
    target="_blank" 
    rel="noopener noreferrer"
  >
            
            <button style={{
              background: 'var(--green)',
              color: 'white',
              padding: '16px 40px',
              fontSize: '1.1rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer'
            }}>
              Listen to &quot;Open It Up&quot;
            </button>
            </a>
          </div>
        </div>
      </section>

      {/* --- Section 4: Instagram Spotlight --- */}
      <section style={{ padding: '80px 0', background: '#ede6dc', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', 
            fontStyle: 'italic', 
            marginBottom: '40px' 
          }}>
            Instagram Spotlight
          </h2>

          {/* This wrapper centers the post */}
          <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(328px, 1fr))', 
  gap: '20px' 
}}>
  <InstagramEmbed url="https://www.instagram.com/p/DXC85uwCRUV/?img_index=1" width="100%" />
  <InstagramEmbed url="https://www.instagram.com/p/DTv7yKujtW6/?img_index=3" width="100%" />
  <InstagramEmbed url="https://www.instagram.com/p/DVOroBWjaPj/?img_index=1" width="100%" />
</div>

        </div>
      </section>
    </main>
  )
}
