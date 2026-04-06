'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/predictor',  label: '🤖 Predictor' },
  { href: '/encuestas',  label: 'Encuestas' },
  { href: '/aulas',      label: 'Aulas Virtuales' },
  { href: '/talentos',   label: 'Talentos' },
  { href: '/incidencia', label: 'Incidencia' },
  { href: '/conexion',   label: 'Conexión' },
  { href: '/retorno',    label: 'Retorno' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="bg-[#003DA5] text-white shadow-lg sticky top-0 z-50">
      {/* Venezuelan stripe at top */}
      <div className="venezuela-stripe" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo-icon.svg" alt="Mi Voto Cuenta" className="w-9 h-9 group-hover:opacity-90 transition-opacity" />
            <div>
              <span className="font-bold text-lg leading-none block">Mi Voto Cuenta</span>
              <span className="text-blue-200 text-xs leading-none">Diáspora Venezolana</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-blue-100 hover:text-white text-sm font-medium transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="bg-[#FFD200] text-[#003DA5] px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#002d7a] border-t border-blue-700">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-blue-700 flex flex-col gap-2">
              <Link
                href="/login"
                className="block px-3 py-2 text-sm font-medium text-blue-100 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="block px-3 py-2 bg-[#FFD200] text-[#003DA5] rounded-lg text-sm font-bold text-center"
                onClick={() => setMobileOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
