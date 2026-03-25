import Link from 'next/link'

const features = [
  {
    icon: '👤',
    title: 'Registro & Perfil',
    description: 'Crea tu perfil como venezolano en el exterior. Mantén tu información actualizada y conecta con la comunidad.',
    href: '/registro',
    color: 'bg-blue-50 border-[#003DA5]',
    iconBg: 'bg-[#003DA5]',
    cta: 'Crear Cuenta',
  },
  {
    icon: '📋',
    title: 'Encuestas & Aulas Virtuales',
    description: 'Participa en encuestas sobre temas que afectan a la diáspora. Accede a aulas virtuales para proponer soluciones.',
    href: '/encuestas',
    color: 'bg-yellow-50 border-[#FFD200]',
    iconBg: 'bg-[#FFD200]',
    cta: 'Participar',
  },
  {
    icon: '✊',
    title: 'Campañas de Incidencia',
    description: 'Firma cartas pre-redactadas dirigidas a los ministerios de relaciones exteriores de tu país de residencia.',
    href: '/incidencia',
    color: 'bg-red-50 border-[#CF142B]',
    iconBg: 'bg-[#CF142B]',
    cta: 'Ver Campañas',
  },
  {
    icon: '🤝',
    title: 'Conexión con Venezuela',
    description: 'Comparte conocimiento, información sobre remesas y construye redes de apoyo con la comunidad venezolana.',
    href: '/conexion',
    color: 'bg-blue-50 border-[#003DA5]',
    iconBg: 'bg-[#003DA5]',
    cta: 'Conectarse',
  },
  {
    icon: '🏠',
    title: 'Retorno a Venezuela',
    description: 'Si piensas regresar a Venezuela, regístrate aquí. Comparte tus habilidades y necesidades para el retorno.',
    href: '/retorno',
    color: 'bg-yellow-50 border-[#FFD200]',
    iconBg: 'bg-[#FFD200]',
    cta: 'Explorar Retorno',
  },
]

const stats = [
  { value: '8M+', label: 'Venezolanos en el exterior' },
  { value: '90+', label: 'Países con diáspora' },
  { value: '500K+', label: 'Registrados en la plataforma' },
  { value: '1,200+', label: 'Campañas activas' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-venezuela-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#FFD200] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#CF142B] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="text-[#FFD200] font-semibold text-sm">Nueva plataforma</span>
              <span className="text-white/70 text-sm">•</span>
              <span className="text-white/80 text-sm">Para venezolanos en el mundo</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Mi Voto Cuenta
              <span className="block text-[#FFD200]">Diáspora Venezolana</span>
            </h1>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              La plataforma digital que une a más de 8 millones de venezolanos alrededor
              del mundo. Participa, incide y mantén tu vínculo con Venezuela.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/registro" className="btn-yellow text-base px-8 py-4 shadow-lg">
                Crear mi cuenta gratis
              </Link>
              <Link href="/dashboard" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-[#003DA5] text-base px-8 py-4">
                Explorar plataforma
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {['🇻🇪', '🇪🇸', '🇺🇸', '🇨🇴', '🇵🇪'].map((flag, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-base">
                    {flag}
                  </div>
                ))}
              </div>
              <p className="text-blue-200 text-sm">
                Venezolanos en <strong className="text-white">España, EE.UU, Colombia, Perú</strong> y más de 90 países
              </p>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="venezuela-stripe" />
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-[#003DA5] mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title text-4xl">5 módulos, una comunidad</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Mi Voto Cuenta te ofrece herramientas concretas para participar, incidir
              y mantenerte conectado con Venezuela desde donde estés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`card-hover border-l-4 ${feature.color} p-6 flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                  {feature.description}
                </p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-[#003DA5] font-semibold text-sm hover:gap-2 transition-all group"
                >
                  {feature.cta}
                  <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title text-4xl">¿Cómo funciona?</h2>
            <p className="section-subtitle">Tres pasos para ser parte de la comunidad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Regístrate',
                desc: 'Crea tu perfil gratuito con tu información básica. Solo necesitas tu email y datos de contacto.',
                color: 'text-[#003DA5]',
              },
              {
                step: '02',
                title: 'Participa',
                desc: 'Responde encuestas, firma campañas de incidencia y comparte tu conocimiento con la comunidad.',
                color: 'text-[#CF142B]',
              },
              {
                step: '03',
                title: 'Incide',
                desc: 'Tu voz importa. Juntos podemos mejorar las condiciones de la diáspora venezolana en el mundo.',
                color: 'text-[#003DA5]',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`text-7xl font-black ${item.color} opacity-20 mb-4`}>{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#003DA5] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FFD200] blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Tu voz es importante.
            <span className="block text-[#FFD200]">Únete hoy.</span>
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Más de 500,000 venezolanos ya son parte de Mi Voto Cuenta.
            Juntos construimos un futuro mejor para Venezuela y su diáspora.
          </p>
          <Link href="/registro" className="btn-yellow text-lg px-10 py-4 shadow-xl">
            Crear mi cuenta gratis
          </Link>
        </div>
        <div className="venezuela-stripe mt-20" />
      </section>
    </div>
  )
}
