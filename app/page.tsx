import Footer from "@/components/footer";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1}}>      
        <h1>Paul's Ribs</h1>
        <p>Official website for Paul’s Ribs</p>
        <p>Home page content coming soon.</p>
      </main>
      <Footer />
    </div>
  )
}
