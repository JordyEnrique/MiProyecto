import Link from 'next/link'

// Mock data for demonstration
const surveys = [
  {
    id: '1',
    title: 'Condiciones laborales de la diáspora venezolana 2024',
    description: 'Esta encuesta busca entender las condiciones de empleo, salario y derechos laborales de los venezolanos en el exterior.',
    country: 'Todos los países',
    questions: 15,
    responses: 2847,
    isActive: true,
    category: 'Laboral',
    timeEstimate: '8 min',
    dueDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Acceso a servicios de salud en el país de acogida',
    description: 'Conocer el nivel de acceso y calidad de los servicios de salud disponibles para venezolanos migrantes.',
    country: 'Todos los países',
    questions: 12,
    responses: 1923,
    isActive: true,
    category: 'Salud',
    timeEstimate: '6 min',
    dueDate: '2024-11-30',
  },
  {
    id: '3',
    title: 'Situación educativa de niños venezolanos en el exterior',
    description: 'Evaluar el acceso a educación formal de los hijos de migrantes venezolanos y los principales desafíos.',
    country: 'América del Sur',
    questions: 18,
    responses: 3102,
    isActive: true,
    category: 'Educación',
    timeEstimate: '10 min',
    dueDate: '2025-01-31',
  },
  {
    id: '4',
    title: 'Proceso de regularización migratoria: experiencias',
    description: 'Recopilar experiencias sobre los procesos de obtención de documentos migratorios en diferentes países.',
    country: 'Europa',
    questions: 20,
    responses: 892,
    isActive: true,
    category: 'Migración',
    timeEstimate: '12 min',
    dueDate: '2024-12-15',
  },
  {
    id: '5',
    title: 'Remesas a Venezuela: frecuencia y métodos',
    description: 'Entender los patrones de envío de remesas, los métodos utilizados y los costos asociados.',
    country: 'Todos los países',
    questions: 10,
    responses: 4521,
    isActive: true,
    category: 'Económica',
    timeEstimate: '5 min',
    dueDate: '2025-02-28',
  },
  {
    id: '6',
    title: 'Integración cultural y social en el país de acogida',
    description: 'Medir el nivel de integración cultural, social y comunitaria de los venezolanos en sus países de residencia.',
    country: 'Todos los países',
    questions: 14,
    responses: 1567,
    isActive: false,
    category: 'Social',
    timeEstimate: '7 min',
    dueDate: '2024-10-31',
  },
]

const categoryColors: Record<string, string> = {
  Laboral: 'badge-blue',
  Salud: 'badge-green',
  Educación: 'badge-yellow',
  Migración: 'badge-red',
  Económica: 'badge-blue',
  Social: 'badge-green',
}

export default function EncuestasPage() {
  const activeSurveys = surveys.filter(s => s.isActive)
  const completedSurveys = surveys.filter(s => !s.isActive)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="section-title text-4xl">Encuestas & Participación</h1>
        <p className="section-subtitle">
          Tu opinión contribuye a construir políticas y soluciones para la diáspora venezolana.
          Todas las respuestas son confidenciales.
        </p>

        <div className="flex flex-wrap gap-4">
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <div className="font-bold text-2xl text-[#003DA5]">{activeSurveys.length}</div>
              <div className="text-xs text-gray-500">Encuestas activas</div>
            </div>
          </div>
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-bold text-2xl text-[#003DA5]">
                {(surveys.reduce((acc, s) => acc + s.responses, 0) / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500">Respuestas totales</div>
            </div>
          </div>
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">🌎</span>
            <div>
              <div className="font-bold text-2xl text-[#003DA5]">90+</div>
              <div className="text-xs text-gray-500">Países participantes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Surveys */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Encuestas activas
            <span className="ml-2 badge badge-green">{activeSurveys.length}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeSurveys.map((survey) => (
            <div key={survey.id} className="card-hover flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge ${categoryColors[survey.category] || 'badge-blue'}`}>
                    {survey.category}
                  </span>
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    ● Activa
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {survey.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {survey.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span>🌎</span> {survey.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>❓</span> {survey.questions} preguntas
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span> {survey.timeEstimate}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>👥</span> {survey.responses.toLocaleString()} respuestas
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Participación</span>
                    <span>{survey.responses.toLocaleString()} respuestas</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#003DA5] h-1.5 rounded-full"
                      style={{ width: `${Math.min((survey.responses / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-5">
                <Link
                  href={`/encuestas/${survey.id}`}
                  className="btn-primary w-full text-sm py-2.5"
                >
                  Responder encuesta
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closed Surveys */}
      {completedSurveys.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Encuestas cerradas</h2>
          <div className="space-y-3">
            {completedSurveys.map((survey) => (
              <div key={survey.id} className="card p-4 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`badge ${categoryColors[survey.category] || 'badge-blue'}`}>
                      {survey.category}
                    </span>
                    <span className="font-semibold text-gray-700 text-sm">{survey.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{survey.responses.toLocaleString()} respuestas</span>
                    <span className="text-gray-300 bg-gray-100 px-2 py-0.5 rounded-full">Cerrada</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
