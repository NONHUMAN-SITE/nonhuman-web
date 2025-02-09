import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { LanguageProvider } from './context/LanguageContext'
import GameOfLife from './components/GameOfLife'
import { ThemeProvider } from './context/ThemeContext'
import ThemeApplier from './components/ThemeApplier'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NONHUMAN',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link rel="icon" href="/NONHUMAN-LOGO.ico" sizes="any" />
        <link rel="icon" href="/NONHUMAN-LOGO.ico" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/NONHUMAN-LOGO.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <ThemeApplier>
              <div className="layout-container">
                <GameOfLife updateSpeed={500} cellSize={30} showCells={false} />
                <Header />
                <main className="main-content">
                  {children}
                </main>
                <Footer />
              </div>
            </ThemeApplier>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
