'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const statsCards = [
  { label: 'Total usuarios registrados', value: '1,247', icon: '👥', color: 'bg-blue-50 border-[#003DA5]', textColor: 'text-[#003DA5]', change: '+34 esta semana' },
  { label: 'Encuestas activas', value: '8', icon: '📋', color: 'bg-yellow-50 border-[#FFD200]', textColor: 'text-yellow-700', change: '2 nuevas este mes' },
  { label: 'Firmas de campañas', value: '3,891', icon: '✊', color: 'bg-red-50 border-[#CF142B]', textColor: 'text-[#CF142B]', change: '+156 esta semana' },
  { label: 'Registros de retorno', value: '234', icon: '🏠', color: 'bg-green-50 border-green-500', textColor: 'text-green-700', change: '+12 este mes' },
]

const recentUsers = [
  { nombre: 'Gabriela Soto', pais: '🇨🇴 Colombia', profesion: 'Médica', fecha: '2025-03-24' },
  { nombre: 'Andrés Martínez', pais: '🇪🇸 España', profesion: 'Ingeniero de Software', fecha: '2025-03-23' },
  { nombre: 'Valentina Díaz', pais: '🇺🇸 EE.UU.', profesion: 'Abogada', fecha: '2025-03-23' },
  { nombre: 'Carlos Herrera', pais: '🇨🇱 Chile', profesion: 'Contador', fecha: '2025-03-22' },
  { nombre: 'María Fernández', pais: '🇵🇪 Perú', profesion: 'Docente', fecha: '2025-03-22' },
  { nombre: 'Luis Ramírez', pais: '🇦🇷 Argentina', profesion: 'Arquitecto', fecha: '2025-03-21' },
  { nombre: 'Patricia González', pais: '🇪🇸 España', profesion: 'Enfermera', fecha: '2025-03-20' },
  { nombre: 'Ricardo Blanco', pais: '🇲🇽 México', profesion: 'Chef', fecha: '2025-03-19' },
]

const surveyStats = [
  { name: 'Condiciones laborales 2024', responses: 2847, max: 5000 },
  { name: 'Acceso a servicios de salud', responses: 1923, max: 5000 },
  { name: 'Situación educativa', responses: 3102, max: 5000 },
  { name: 'Remesas a Venezuela', responses: 4521, max: 5000 },
]

const campaignsByCountry = [
  { country: '🇨🇴 Colombia', signatures: 1240, max: 1500 },
  { country: '🇪🇸 España', signatures: 987, max: 1500 },
  { country: '🇺🇸 EE.UU.', signatures: 756, max: 1500 },
  { country: '🇨🇱 Chile', signatures: 432, max: 1500 },
  { country: '🇵🇪 Perú', signatures: 289, max: 1500 },
  { country: '🇦🇷 Argentina', signatures: 187, max: 1500 },
]

const returnRecords = [
  { nombre: 'José Morales', destino: 'Caracas, Miranda', fecha: '2025-04-10', estado: 'Activo' },
  { nombre: 'Ana Villalobos', destino: 'Valencia, Carabobo', fecha: '2025-05-15', estado: 'Pendiente' },
  { nombre: 'Miguel Ángel Reyes', destino: 'Maracaibo, Zulia', fecha: '2025-03-01', estado: 'Completado' },
  { nombre: 'Sofía Castillo', destino: 'Barquisimeto, Lara', fecha: '2025-06-20', estado: 'Pendiente' },
  { nombre: 'Fernando Ruiz', destino: 'Mérida, Mérida', fecha: '2025-02-14', estado: 'Completado' },
  { nombre: 'Elena Gutiérrez', destino: 'Puerto Ordaz, Bolívar', fecha: '2025-04-30', estado: 'Activo' },
]

const recentPosts = [
  { categoria: 'Remesas', titulo: 'Guía para enviar dinero desde EE.UU.', autor: 'Luis F.', fecha: '2025-03-24' },
  { categoria: 'Legal', titulo: 'Documentos para residencia en España', autor: 'Ana M.', fecha: '2025-03-23' },
  { categoria: 'Empleo', titulo: 'Oportunidades en sector tecnológico Chile', autor: 'Pedro G.', fecha: '2025-03-22' },
  { categoria: 'Salud', titulo: 'Seguro médico para migrantes en Colombia', autor: 'Dra. Vargas', fecha: '2025-03-21' },
  { categoria: 'Cultura', titulo: 'Comunidad venezolana en Buenos Aires', autor: 'María C.', fecha: '2025-03-20' },
]

const statusColors: Record<string, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Activo: 'bg-blue-100 text-blue-800',
  Completado: 'bg-green-100 text-green-800',
}

const adminSidebar = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { href: '/admin/encuestas', label: 'Encuestas', icon: '📋' },
  { href: '/admin/campanas', label: 'Campañas', icon: '✊' },
]

function AdminContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)

  useEffect(() => {
    if (key === 'admin2024') {
      setAccessGranted(true)
    }
  }, [key])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'admin2024') {
      setAccessGranted(true)
      setError('')
    } else {
      setError('Clave incorrecta. Intenta de nuevo.')
    }
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
          <p className="text-gray-500 text-sm mb-6">Esta sección es solo para administradores de la plataforma.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="label-field">Clave de acceso</label>
              <input
                type="password"
                className="input-field"
                placeholder="Ingresa la clave de administrador"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full">
              Acceder al panel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-[#003DA5] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">Panel Admin</span>
              </div>
              <nav className="space-y-1">
                {adminSidebar.map(item => (
                  <Link
                    key={item.href}
                    href={`${item.href}?key=admin2024`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8">
              <div className="venezuela-stripe w-24 h-1 mb-4" />
              <h1 className="text-3xl font-black text-gray-900 mb-1">Dashboard Administrativo</h1>
              <p className="text-gray-500">Panel de control — Mi Voto Cuenta</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map((stat, i) => (
                <div key={i} className={`card border-l-4 p-5 ${stat.color}`}>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="text-xs text-gray-400 text-right">{stat.change}</span>
                  </div>
                  <div className={`text-3xl font-black mb-1 ${stat.textColor}`}>{stat.value}</div>
                  <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Two column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Survey bar chart */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Respuestas por encuesta</h2>
                <div className="space-y-4">
                  {surveyStats.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium text-xs truncate max-w-[200px]">{s.name}</span>
                        <span className="text-gray-500 text-xs font-semibold ml-2 flex-shrink-0">{s.responses.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-5 rounded-full bg-[#003DA5] flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${(s.responses / s.max) * 100}%` }}
                        >
                          <span className="text-white text-xs font-bold">{Math.round((s.responses / s.max) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns by country */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Firmas por país</h2>
                <div className="space-y-3">
                  {campaignsByCountry.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium text-sm">{c.country}</span>
                        <span className="text-gray-500 text-xs font-semibold">{c.signatures.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-4 rounded-full bg-[#CF142B] flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${(c.signatures / c.max) * 100}%` }}
                        >
                          {c.signatures > 300 && (
                            <span className="text-white text-xs font-bold">{Math.round((c.signatures / c.max) * 100)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent users table */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Últimos usuarios registrados</h2>
                <Link href="/admin/usuarios?key=admin2024" className="text-sm text-[#003DA5] font-semibold hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">País</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Profesión</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentUsers.map((user, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-medium text-gray-900">{user.nombre}</td>
                        <td className="py-3 px-3 text-gray-600">{user.pais}</td>
                        <td className="py-3 px-3 text-gray-600">{user.profesion}</td>
                        <td className="py-3 px-3 text-gray-400 text-xs">
                          {new Date(user.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Return records & recent posts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Return records */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Registros de retorno</h2>
                  <span className="badge badge-blue">{returnRecords.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                        <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Destino</th>
                        <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {returnRecords.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-2.5 font-medium text-gray-900 text-xs">{r.nombre}</td>
                          <td className="py-2.5 text-gray-500 text-xs">{r.destino}</td>
                          <td className="py-2.5">
                            <span className={`badge text-xs ${statusColors[r.estado]}`}>
                              {r.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent posts */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Posts de conexión recientes</h2>
                  <span className="badge badge-blue">{recentPosts.length}</span>
                </div>
                <div className="space-y-3">
                  {recentPosts.map((post, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                      <span className="badge badge-blue mt-0.5 flex-shrink-0 text-xs">{post.categoria}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.titulo}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {post.autor} · {new Date(post.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <AdminContent />
    </Suspense>
  )
}
