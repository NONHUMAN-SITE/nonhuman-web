import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
