import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        <ul className="nav-list">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/research">Research</Link></li>
          <li><Link href="/newspaper">Newspaper</Link></li>
          <li><Link href="/community">Community</Link></li>
        </ul>
      </nav>
    </header>
  )
}
