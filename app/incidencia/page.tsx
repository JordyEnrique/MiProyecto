'use client'

import { useState } from 'react'
import Link from 'next/link'

const campaigns = [
  {
    id: '1',
    title: 'Regularización migratoria expedita para venezolanos en España',
    description: 'Solicitar al Ministerio de Asuntos Exteriores de España la implementación de un proceso de regularización acelerado para venezolanos con más de 2 años de residencia.',
    country: 'España',
    ministry: 'Ministerio de Asuntos Exteriores, Unión Europea y Cooperación',
    signatures: 15234,
    goal: 20000,
    isActive: true,
    category: 'Migración',
    urgency: 'Alta',
    deadline: '2024-12-31',
    tags: ['España', 'Regularización', 'Residencia'],
  },
  {
    id: '2',
    title: 'Reconocimiento de títulos universitarios venezolanos en Colombia',
    description: 'Petición al Ministerio de Educación de Colombia para agilizar el proceso de reconocimiento de títulos universitarios venezolanos y reducir los tiempos de espera.',
    country: 'Colombia',
    ministry: 'Ministerio de Educación Nacional',
    signatures: 8921,
    goal: 15000,
    isActive: true,
    category: 'Educación',
    urgency: 'Media',
    deadline: '2025-01-31',
    tags: ['Colombia', 'Educación', 'Títulos'],
  },
  {
    id: '3',
    title: 'Visado humanitario para venezolanos en Chile',
    description: 'Solicitar al gobierno de Chile el establecimiento de un visado humanitario especial para venezolanos en situación vulnerable.',
    country: 'Chile',
    ministry: 'Ministerio de Relaciones Exteriores',
    signatures: 12456,
    goal: 20000,
    isActive: true,
    category: 'Humanitaria',
    urgency: 'Alta',
    deadline: '2024-12-15',
    tags: ['Chile', 'Visa', 'Humanitaria'],
  },
  {
    id: '4',
    title: 'Acceso a seguridad social para migrantes venezolanos en Perú',
    description: 'Petición al Ministerio de Salud del Perú para garantizar el acceso universal a servicios de salud a todos los venezolanos residentes independientemente de su estatus migratorio.',
    country: 'Perú',
    ministry: 'Ministerio de Salud',
    signatures: 6789,
    goal: 10000,
    isActive: true,
    category: 'Salud',
    urgency: 'Alta',
    deadline: '2025-02-28',
    tags: ['Perú', 'Salud', 'Seguridad Social'],
  },
  {
    id: '5',
    title: 'TPS (Estatus de Protección Temporal) para venezolanos en EE.UU.',
    description: 'Apoyo a la renovación y ampliación del Estatus de Protección Temporal (TPS) para venezolanos en Estados Unidos ante el Departamento de Estado.',
    country: 'Estados Unidos',
    ministry: 'Department of State',
    signatures: 45678,
    goal: 60000,
    isActive: true,
    category: 'Migración',
    urgency: 'Crítica',
    deadline: '2024-11-30',
    tags: ['EE.UU.', 'TPS', 'Migración'],
  },
  {
    id: '6',
    title: 'Permiso de trabajo simplificado para venezolanos en Argentina',
    description: 'Solicitar al Ministerio de Trabajo de Argentina simplificar el proceso de obtención de permiso de trabajo para ciudadanos venezolanos.',
    country: 'Argentina',
    ministry: 'Ministerio de Trabajo, Empleo y Seguridad Social',
    signatures: 3456,
    goal: 8000,
    isActive: true,
    category: 'Laboral',
    urgency: 'Media',
    deadline: '2025-03-31',
    tags: ['Argentina', 'Trabajo', 'Empleo'],
  },
]

const countries = ['Todos', 'España', 'Colombia', 'Chile', 'Perú', 'Estados Unidos', 'Argentina']
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

export default function IncidenciaPage() {
  const [selectedCountry, setSelectedCountry] = useState('Todos')

  const filtered = selectedCountry === 'Todos'
    ? campaigns
    : campaigns.filter(c => c.country === selectedCountry)

  const totalSignatures = campaigns.reduce((acc, c) => acc + c.signatures, 0)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="section-title text-4xl">Campañas de Incidencia</h1>
        <p className="section-subtitle max-w-2xl">
          Cartas pre-redactadas dirigidas a los ministerios de relaciones exteriores.
          Tu firma suma a la presión para mejorar las condiciones de los venezolanos en el exterior.
        </p>

        <div className="flex flex-wrap gap-4">
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">✊</span>
            <div>
              <div className="font-bold text-2xl text-[#CF142B]">{campaigns.length}</div>
              <div className="text-xs text-gray-500">Campañas activas</div>
            </div>
          </div>
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">✍️</span>
            <div>
              <div className="font-bold text-2xl text-[#CF142B]">
                {(totalSignatures / 1000).toFixed(0)}K+
              </div>
              <div className="text-xs text-gray-500">Firmas totales</div>
            </div>
          </div>
          <div className="card px-5 py-3 flex items-center gap-3">
            <span className="text-2xl">🌎</span>
            <div>
              <div className="font-bold text-2xl text-[#CF142B]">6</div>
              <div className="text-xs text-gray-500">Países cubiertos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => setSelectedCountry(country)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
              selectedCountry === country
                ? 'bg-[#003DA5] text-white border-[#003DA5]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#003DA5] hover:text-[#003DA5]'
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((campaign) => {
          const pct = Math.min((campaign.signatures / campaign.goal) * 100, 100)
          return (
            <div key={campaign.id} className="card-hover flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`badge ${categoryColors[campaign.category] || 'badge-blue'}`}>
                      {campaign.category}
                    </span>
                    <span className={`badge ${urgencyColors[campaign.urgency]}`}>
                      {campaign.urgency}
                    </span>
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
                      {campaign.signatures.toLocaleString()} firmas
                    </span>
                    <span>Meta: {campaign.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-[#CF142B] h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">{Math.round(pct)}% de la meta</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {campaign.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 pb-5">
                <Link href={`/incidencia/${campaign.id}`} className="btn-danger w-full text-sm py-2.5">
                  Ver campaña y firmar →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No hay campañas para {selectedCountry} en este momento.</p>
          <p className="text-sm mt-2">Vuelve pronto o selecciona otro país.</p>
        </div>
      )}
    </div>
  )
}
