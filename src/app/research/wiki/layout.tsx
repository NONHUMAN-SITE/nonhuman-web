import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import GameOfLife from '@/app/components/GameOfLife'

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <GameOfLife updateSpeed={500} cellSize={30} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
