import Link from 'next/link'

interface Survey {
  id: string
  title: string
  description: string
  isActive: boolean
  createdAt: Date | string
  questions?: Array<{ id: string }>
  _count?: { responses: number }
  category?: string
  timeEstimate?: string
  country?: string
}

interface SurveyCardProps {
  survey: Survey
}

const categoryColors: Record<string, string> = {
  Laboral: 'badge-blue',
  Salud: 'badge-green',
  Educación: 'badge-yellow',
  Migración: 'badge-red',
  Económica: 'badge-blue',
  Social: 'badge-green',
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  const questionCount = survey.questions?.length ?? 0
  const responseCount = survey._count?.responses ?? 0
  const category = survey.category ?? 'General'

  return (
    <div className="card-hover flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className={`badge ${categoryColors[category] ?? 'badge-blue'}`}>
            {category}
          </span>
          {survey.isActive ? (
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              ● Activa
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
              Cerrada
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {survey.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {survey.description}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
          {survey.country && (
            <span className="flex items-center gap-1">
              <span>🌎</span> {survey.country}
            </span>
          )}
          {questionCount > 0 && (
            <span className="flex items-center gap-1">
              <span>❓</span> {questionCount} preguntas
            </span>
          )}
          {survey.timeEstimate && (
            <span className="flex items-center gap-1">
              <span>⏱️</span> {survey.timeEstimate}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>👥</span> {responseCount.toLocaleString()} respuestas
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#003DA5] h-1.5 rounded-full"
              style={{ width: `${Math.min((responseCount / 5000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-5">
        {survey.isActive ? (
          <Link
            href={`/encuestas/${survey.id}`}
            className="btn-primary w-full text-sm py-2.5 text-center"
          >
            Responder encuesta
          </Link>
        ) : (
          <button disabled className="btn-primary w-full text-sm py-2.5 opacity-50 cursor-not-allowed">
            Encuesta cerrada
          </button>
        )}
      </div>
    </div>
  )
}
