'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const surveys = [
  {
    id: 1,
    title: 'Condiciones laborales de la diáspora 2024',
    responses: 2847,
    questions: [
      {
        question: '¿En qué país resides actualmente?',
        type: 'multiple',
        answers: [
          { option: 'Colombia', count: 812, pct: 28 },
          { option: 'España', count: 683, pct: 24 },
          { option: 'EE.UU.', count: 569, pct: 20 },
          { option: 'Chile', count: 398, pct: 14 },
          { option: 'Otros', count: 385, pct: 14 },
        ],
      },
      {
        question: '¿Trabajas actualmente en tu área de formación?',
        type: 'multiple',
        answers: [
          { option: 'Sí, completamente', count: 854, pct: 30 },
          { option: 'Parcialmente', count: 996, pct: 35 },
          { option: 'No, trabajo en otro sector', count: 712, pct: 25 },
          { option: 'Estoy desempleado/a', count: 285, pct: 10 },
        ],
      },
      {
        question: '¿Cuál es tu ingreso mensual aproximado en USD?',
        type: 'multiple',
        answers: [
          { option: 'Menos de $500', count: 341, pct: 12 },
          { option: '$500 - $1,000', count: 683, pct: 24 },
          { option: '$1,000 - $2,000', count: 854, pct: 30 },
          { option: '$2,000 - $4,000', count: 712, pct: 25 },
          { option: 'Más de $4,000', count: 257, pct: 9 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Planes de retorno a Venezuela',
    responses: 1923,
    questions: [
      {
        question: '¿Tienes planes de regresar a Venezuela?',
        type: 'multiple',
        answers: [
          { option: 'Sí, en los próximos 2 años', count: 346, pct: 18 },
          { option: 'Quizás en el futuro', count: 654, pct: 34 },
          { option: 'No tengo planes por ahora', count: 731, pct: 38 },
          { option: 'Nunca regresaré', count: 192, pct: 10 },
        ],
      },
      {
        question: '¿Qué condición sería necesaria para regresar?',
        type: 'multiple',
        answers: [
          { option: 'Cambio de gobierno', count: 1154, pct: 60 },
          { option: 'Mejora económica', count: 769, pct: 40 },
          { option: 'Seguridad garantizada', count: 846, pct: 44 },
          { option: 'Oportunidades laborales', count: 615, pct: 32 },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Acceso a servicios de salud en el exterior',
    responses: 3102,
    questions: [
      {
        question: '¿Tienes seguro médico en tu país de residencia?',
        type: 'multiple',
        answers: [
          { option: 'Sí, del empleador', count: 1116, pct: 36 },
          { option: 'Sí, privado', count: 620, pct: 20 },
          { option: 'Sí, público/estatal', count: 838, pct: 27 },
          { option: 'No tengo seguro', count: 528, pct: 17 },
        ],
      },
      {
        question: '¿Has tenido dificultades para acceder a atención médica?',
        type: 'multiple',
        answers: [
          { option: 'Nunca', count: 930, pct: 30 },
          { option: 'Algunas veces', count: 1240, pct: 40 },
          { option: 'Frecuentemente', count: 621, pct: 20 },
          { option: 'Siempre', count: 311, pct: 10 },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Remesas a Venezuela',
    responses: 4521,
    questions: [
      {
        question: '¿Con qué frecuencia envías dinero a Venezuela?',
        type: 'multiple',
        answers: [
          { option: 'Mensualmente', count: 1989, pct: 44 },
          { option: 'Cada 2-3 meses', count: 1085, pct: 24 },
          { option: 'Ocasionalmente', count: 904, pct: 20 },
          { option: 'No envío remesas', count: 543, pct: 12 },
        ],
      },
      {
        question: '¿Qué plataforma usas para enviar remesas?',
        type: 'multiple',
        answers: [
          { option: 'Zelle/transferencia bancaria', count: 1808, pct: 40 },
          { option: 'Criptomonedas', count: 1130, pct: 25 },
          { option: 'Western Union / MoneyGram', count: 904, pct: 20 },
          { option: 'Otras apps (Binance, etc.)', count: 679, pct: 15 },
        ],
      },
    ],
  },
]

const adminSidebar = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { href: '/admin/encuestas', label: 'Encuestas', icon: '📋' },
  { href: '/admin/campanas', label: 'Campañas', icon: '✊' },
]

const barColors = ['bg-[#003DA5]', 'bg-[#CF142B]', 'bg-[#FFD200]', 'bg-green-500', 'bg-purple-500']

function EncuestasContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(key === 'admin2024')
  const [selectedSurvey, setSelectedSurvey] = useState<number | null>(null)

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
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full">Acceder al panel</button>
          </form>
        </div>
      </div>
    )
  }

  const displaySurvey = selectedSurvey !== null ? surveys.find(s => s.id === selectedSurvey) : null

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
                      item.href === '/admin/encuestas'
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
              <h1 className="text-3xl font-black text-gray-900 mb-1">Respuestas por Encuesta</h1>
              <p className="text-gray-500">{surveys.length} encuestas activas · {surveys.reduce((a, s) => a + s.responses, 0).toLocaleString()} respuestas totales</p>
            </div>

            {/* Survey selector cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {surveys.map(survey => (
                <button
                  key={survey.id}
                  onClick={() => setSelectedSurvey(selectedSurvey === survey.id ? null : survey.id)}
                  className={`card p-5 text-left transition-all hover:shadow-md ${selectedSurvey === survey.id ? 'ring-2 ring-[#003DA5] bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{survey.title}</h3>
                    <span className="badge badge-blue flex-shrink-0">{survey.responses.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{survey.questions.length} preguntas</p>
                  <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-[#003DA5]"
                      style={{ width: `${Math.min((survey.responses / 5000) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{Math.round((survey.responses / 5000) * 100)}% de meta (5,000)</p>
                </button>
              ))}
            </div>

            {/* Survey detail */}
            {displaySurvey ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{displaySurvey.title}</h2>
                  <span className="text-sm text-gray-500">{displaySurvey.responses.toLocaleString()} respuestas</span>
                </div>
                <div className="space-y-8">
                  {displaySurvey.questions.map((q, qi) => (
                    <div key={qi}>
                      <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                        <span className="text-[#003DA5] mr-2">P{qi + 1}.</span>
                        {q.question}
                      </h3>
                      <div className="space-y-3">
                        {q.answers.map((answer, ai) => (
                          <div key={ai}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 font-medium text-xs">{answer.option}</span>
                              <span className="text-gray-500 text-xs">{answer.count.toLocaleString()} ({answer.pct}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                              <div
                                className={`h-6 rounded-full ${barColors[ai % barColors.length]} flex items-center justify-end pr-3 transition-all duration-500`}
                                style={{ width: `${answer.pct}%` }}
                              >
                                {answer.pct > 10 && (
                                  <span className="text-white text-xs font-bold">{answer.pct}%</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 card">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-medium">Selecciona una encuesta para ver el desglose de respuestas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminEncuestasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <EncuestasContent />
    </Suspense>
  )
}
