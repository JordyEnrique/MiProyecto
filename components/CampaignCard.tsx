import Link from 'next/link'

interface Campaign {
  id: string
  title: string
  description: string
  country: string
  ministry: string
  isActive: boolean
  createdAt: Date | string
  _count?: { signatures: number }
  category?: string
  urgency?: string
  goal?: number
  tags?: string[]
}

interface CampaignCardProps {
  campaign: Campaign
  goal?: number
}

const urgencyColors: Record<string, string> = {
  Crítica: 'bg-red-100 text-red-800',
  Alta: 'bg-orange-100 text-orange-800',
  Media: 'bg-yellow-100 text-yellow-800',
  Baja: 'bg-green-100 text-green-800',
}

const categoryColors: Record<string, string> = {
  Migración: 'badge-blue',
  Educación: 'badge-yellow',
  Humanitaria: 'badge-red',
  Salud: 'badge-green',
  Laboral: 'badge-blue',
}

export default function CampaignCard({ campaign, goal = 10000 }: CampaignCardProps) {
  const signatures = campaign._count?.signatures ?? 0
  const effectiveGoal = campaign.goal ?? goal
  const pct = Math.min((signatures / effectiveGoal) * 100, 100)
  const category = campaign.category ?? 'General'
  const urgency = campaign.urgency ?? 'Media'

  return (
    <div className="card-hover flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <span className={`badge ${categoryColors[category] ?? 'badge-blue'}`}>
              {category}
            </span>
            {urgency && (
              <span className={`badge ${urgencyColors[urgency] ?? 'bg-gray-100 text-gray-700'}`}>
                {urgency}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            🌎 {campaign.country}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
          {campaign.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">
          {campaign.description}
        </p>
        <p className="text-xs text-gray-400 mb-4 italic">
          Dirigida a: {campaign.ministry}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-semibold text-[#CF142B]">
              {signatures.toLocaleString()} firmas
            </span>
            <span>Meta: {effectiveGoal.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-[#CF142B] h-2.5 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">{Math.round(pct)}% de la meta</div>
        </div>

        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {campaign.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-5">
        {campaign.isActive ? (
          <Link
            href={`/incidencia/${campaign.id}`}
            className="btn-danger w-full text-sm py-2.5 text-center"
          >
            Ver campaña y firmar →
          </Link>
        ) : (
          <button disabled className="btn-danger w-full text-sm py-2.5 opacity-50 cursor-not-allowed">
            Campaña cerrada
          </button>
        )}
      </div>
    </div>
  )
}
