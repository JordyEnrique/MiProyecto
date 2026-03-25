import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Mi Voz Cuenta - Plataforma de la Diáspora Venezolana',
  description:
    'Mi Voz Cuenta es la plataforma digital que conecta a la diáspora venezolana alrededor del mundo. Participa en encuestas, campañas de incidencia, y mantén tu conexión con Venezuela.',
  keywords: 'venezolanos, diáspora, Venezuela, migración, incidencia, encuestas, voto',
  openGraph: {
    title: 'Mi Voz Cuenta - Diáspora Venezolana',
    description: 'La plataforma de la diáspora venezolana',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="font-sans min-h-screen bg-gray-50">
        <Navigation />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="bg-[#003DA5] text-white mt-16">
          <div className="venezuela-stripe" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/logo-icon.svg" alt="Mi Voz Cuenta" className="w-10 h-10" />
                  <div>
                    <span className="font-bold text-xl block">Mi Voz Cuenta</span>
                    <span className="text-blue-200 text-sm">Diáspora Venezolana</span>
                  </div>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed max-w-sm">
                  La plataforma digital que une a los venezolanos en el mundo.
                  Participa, incide y mantén tu vínculo con Venezuela.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-[#FFD200]">Módulos</h4>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li><a href="/encuestas" className="hover:text-white transition-colors">Encuestas y Aulas</a></li>
                  <li><a href="/incidencia" className="hover:text-white transition-colors">Campañas de Incidencia</a></li>
                  <li><a href="/conexion" className="hover:text-white transition-colors">Conexión con Venezuela</a></li>
                  <li><a href="/retorno" className="hover:text-white transition-colors">Retorno a Venezuela</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-[#FFD200]">Cuenta</h4>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li><a href="/registro" className="hover:text-white transition-colors">Registrarse</a></li>
                  <li><a href="/login" className="hover:text-white transition-colors">Iniciar Sesión</a></li>
                  <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-700 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-blue-300 text-sm">
                © 2024 Mi Voz Cuenta. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-sm">Hecho con</span>
                <span className="text-[#CF142B]">♥</span>
                <span className="text-blue-300 text-sm">por y para venezolanos</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
