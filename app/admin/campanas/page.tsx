'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const campaigns = [
  {
    id: 1,
    title: 'Regularización migratoria expedita para venezolanos en España',
    country: 'España',
    totalSignatures: 15234,
    goal: 20000,
    status: 'Activa',
    byCountry: [
      { country: '🇪🇸 España', count: 8432 },
      { country: '🇨🇴 Colombia', count: 2341 },
      { country: '🇺🇸 EE.UU.', count: 1876 },
      { country: '🇨🇱 Chile', count: 1243 },
      { country: '🇦🇷 Argentina', count: 876 },
      { country: 'Otros', count: 466 },
    ],
  },
  {
    id: 2,
    title: 'Reconocimiento de títulos universitarios venezolanos en Colombia',
    country: 'Colombia',
    totalSignatures: 8921,
    goal: 15000,
    status: 'Activa',
    byCountry: [
      { country: '🇨🇴 Colombia', count: 4231 },
      { country: '🇻🇪 Venezuela', count: 1823 },
      { country: '🇪🇸 España', count: 1240 },
      { country: '🇺🇸 EE.UU.', count: 876 },
      { country: '🇵🇪 Perú', count: 432 },
      { country: 'Otros', count: 319 },
    ],
  },
  {
    id: 3,
    title: 'Visado humanitario para venezolanos en Chile',
    country: 'Chile',
    totalSignatures: 12456,
    goal: 20000,
    status: 'Activa',
    byCountry: [
      { country: '🇨🇱 Chile', count: 6234 },
      { country: '🇦🇷 Argentina', count: 2187 },
      { country: '🇵🇪 Perú', count: 1876 },
      { country: '🇧🇴 Bolivia', count: 987 },
      { country: '🇪🇸 España', count: 743 },
      { country: 'Otros', count: 429 },
    ],
  },
  {
    id: 4,
    title: 'TPS para venezolanos en EE.UU.',
    country: 'EE.UU.',
    totalSignatures: 45678,
    goal: 60000,
    status: 'Activa',
    byCountry: [
      { country: '🇺🇸 EE.UU.', count: 32456 },
      { country: '🇻🇪 Venezuela', count: 5432 },
      { country: '🇲🇽 México', count: 3241 },
      { country: '🇨🇴 Colombia', count: 2876 },
      { country: '🇵🇦 Panamá', count: 987 },
      { country: 'Otros', count: 686 },
    ],
  },
]

const adminSidebar = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { href: '/admin/encuestas', label: 'Encuestas', icon: '📋' },
  { href: '/admin/campanas', label: 'Campañas', icon: '✊' },
]

function CampanasContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(key === 'admin2024')
  const [exportMsg, setExportMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'admin2024') {
      setAccessGranted(true)
      setError('')
    } else {
      setError('Clave incorrecta. Intenta de nuevo.')
    }
  }

  const handleExport = (title: string) => {
    setExportMsg(`Exportando datos de "${title}"...`)
    setTimeout(() => setExportMsg(null), 3000)
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
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full">Acceder al panel</button>
          </form>
        </div>
      </div>
    )
  }

  const totalSigs = campaigns.reduce((a, c) => a + c.totalSignatures, 0)

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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.href === '/admin/campanas'
                        ? 'bg-[#003DA5] text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
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
            <div className="mb-6">
              <div className="venezuela-stripe w-24 h-1 mb-4" />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Campañas de Incidencia</h1>
                  <p className="text-gray-500">{campaigns.length} campañas · {totalSigs.toLocaleString()} firmas totales</p>
                </div>
              </div>
            </div>

            {exportMsg && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-800 text-sm font-medium">
                ✓ {exportMsg}
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="card p-4 text-center border-l-4 border-[#CF142B]">
                <div className="text-2xl font-black text-[#CF142B]">{campaigns.length}</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Campañas activas</div>
              </div>
              <div className="card p-4 text-center border-l-4 border-[#003DA5]">
                <div className="text-2xl font-black text-[#003DA5]">{(totalSigs / 1000).toFixed(0)}K</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Firmas totales</div>
              </div>
              <div className="card p-4 text-center border-l-4 border-[#FFD200]">
                <div className="text-2xl font-black text-yellow-700">6</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Países distintos</div>
              </div>
              <div className="card p-4 text-center border-l-4 border-green-500">
                <div className="text-2xl font-black text-green-700">68%</div>
                <div className="text-xs text-gray-500 font-medium mt-1">Meta promedio</div>
              </div>
            </div>

            {/* Campaign cards */}
            <div className="space-y-6">
              {campaigns.map(campaign => {
                const pct = Math.round((campaign.totalSignatures / campaign.goal) * 100)
                const maxCountry = Math.max(...campaign.byCountry.map(c => c.count))
                return (
                  <div key={campaign.id} className="card p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge bg-green-100 text-green-800">Activa</span>
                          <span className="badge badge-blue">{campaign.country}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg leading-snug">{campaign.title}</h3>
                      </div>
                      <button
                        onClick={() => handleExport(campaign.title)}
                        className="btn-secondary text-sm py-2 px-4 flex-shrink-0"
                      >
                        Exportar CSV
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-[#CF142B]">{campaign.totalSignatures.toLocaleString()} firmas</span>
                        <span className="text-gray-500">Meta: {campaign.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-[#CF142B] transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">{pct}% completado</p>
                    </div>

                    {/* Country breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Firmas por país</h4>
                      <div className="space-y-2">
                        {campaign.byCountry.map((c, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-700 font-medium">{c.country}</span>
                              <span className="text-gray-500">{c.count.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-3 rounded-full bg-[#003DA5] transition-all"
                                style={{ width: `${(c.count / maxCountry) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminCampanasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <CampanasContent />
    </Suspense>
  )
}
