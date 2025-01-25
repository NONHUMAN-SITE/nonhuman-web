import Header from './components/Header'
import Footer from './components/Footer'
import GameOfLife from './components/GameOfLife'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="layout-container">
      <GameOfLife updateSpeed={500} cellSize={30} />
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}
