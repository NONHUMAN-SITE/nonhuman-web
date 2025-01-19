import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { LanguageProvider } from './context/LanguageContext'
import GameOfLife from './components/GameOfLife'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NONHUMAN - AI Research Group',
  description: 'Exploring the frontiers of artificial intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="layout-container">
            <GameOfLife updateSpeed={500} cellSize={30} />
            <Header />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
