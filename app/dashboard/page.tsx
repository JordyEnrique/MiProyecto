import Link from 'next/link'

const modules = [
  {
    title: 'Encuestas',
    description: 'Responde encuestas activas sobre la diáspora',
    href: '/encuestas',
    icon: '📋',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    count: '12 activas',
  },
  {
    title: 'Aulas Virtuales',
    description: 'Participa en sesiones de aprendizaje colectivo',
    href: '/aulas',
    icon: '🎓',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    count: '5 próximas',
  },
  {
    title: 'Campañas de Incidencia',
    description: 'Firma cartas a ministerios de relaciones exteriores',
    href: '/incidencia',
    icon: '✊',
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    count: '8 campañas',
  },
  {
    title: 'Conexión con Venezuela',
    description: 'Comparte conocimiento y conéctate con la comunidad',
    href: '/conexion',
    icon: '🤝',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    count: '234 posts',
  },
  {
    title: 'Retorno a Venezuela',
    description: 'Regístrate si planeas regresar a Venezuela',
    href: '/retorno',
    icon: '🏠',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    count: '1,200 registros',
  },
]

const recentActivity = [
  { action: 'Nueva encuesta disponible', detail: 'Condiciones laborales de la diáspora 2024', time: 'hace 2h', icon: '📋' },
  { action: 'Campaña actualizada', detail: 'Carta a Cancillería española sobre residencia', time: 'hace 5h', icon: '✊' },
  { action: 'Nuevo post en Conexión', detail: 'Guía completa para enviar remesas desde EE.UU.', time: 'hace 1d', icon: '🤝' },
  { action: 'Aula Virtual programada', detail: 'Derechos laborales de venezolanos en Colombia', time: 'hace 2d', icon: '🎓' },
]

export default function DashboardPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-10">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="text-4xl font-black text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-lg">Bienvenido a Mi Voto Cuenta — tu plataforma de la diáspora venezolana</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Encuestas respondidas', value: '0', icon: '📋', change: 'Empieza a participar' },
          { label: 'Campañas firmadas', value: '0', icon: '✊', change: 'Tu voz importa' },
          { label: 'Posts compartidos', value: '0', icon: '🤝', change: 'Comparte tu experiencia' },
          { label: 'Días en Mi Voto Cuenta', value: '1', icon: '⭐', change: 'Bienvenido' },
        ].map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs font-semibold text-gray-700 mb-1">{stat.label}</div>
            <div className="text-xs text-gray-400">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos de la plataforma</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <Link key={i} href={mod.href} className="card-hover p-5 group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${mod.lightColor} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {mod.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{mod.title}</h3>
                      <span className={`badge ${mod.lightColor} ${mod.textColor} text-xs`}>
                        {mod.count}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{mod.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad reciente</h2>
          <div className="card">
            <div className="divide-y divide-gray-50">
              {recentActivity.map((item, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700">{item.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{item.detail}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile completion */}
          <div className="card mt-4 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Completa tu perfil</h3>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-[#003DA5] h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Email verificado
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Datos básicos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-300">○</span> Cédula venezolana
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-300">○</span> Primera encuesta
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-300">○</span> Primera campaña firmada
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
