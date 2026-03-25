'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const mockCampaign = {
  id: '1',
  title: 'Regularización migratoria expedita para venezolanos en España',
  description: 'Solicitar al Ministerio de Asuntos Exteriores de España la implementación de un proceso de regularización acelerado para venezolanos con más de 2 años de residencia.',
  country: 'España',
  ministry: 'Ministerio de Asuntos Exteriores, Unión Europea y Cooperación de España',
  signatures: 15234,
  goal: 20000,
  isActive: true,
  category: 'Migración',
  urgency: 'Alta',
  deadline: '2024-12-31',
  context: `Más de 500,000 venezolanos residen en España, muchos de ellos en situación migratoria irregular a pesar de llevar años contribuyendo a la sociedad española. La ausencia de un proceso ágil de regularización los mantiene en una situación de vulnerabilidad que afecta su acceso a servicios básicos, trabajo formal y protección legal.

La Ley Orgánica 4/2000 sobre derechos y libertades de los extranjeros en España permite procesos de arraigo social para quienes demuestren integración. Sin embargo, los tiempos de respuesta superan los 18 meses en muchos casos, y los requisitos burocráticos son excesivamente complejos.

Pedimos una reforma urgente que simplifique y acelere estos procesos para venezolanos que cumplan con los criterios de arraigo, reconociendo su contribución a la economía y sociedad española.`,
  letterTemplate: `Excelentísimo/a Sr./Sra. Ministro/a de Asuntos Exteriores, Unión Europea y Cooperación:

Por medio de la presente, yo {NOMBRE}, venezolano/a residente en España, me dirijo a Usted respetuosamente para expresar mi profunda preocupación por la situación migratoria de miles de ciudadanos venezolanos que residen en este país.

España ha sido un destino generoso para nuestra comunidad, que ha llegado huyendo de la grave crisis política, económica y social que atraviesa Venezuela. Muchos de nosotros llevamos años contribuyendo activamente a la sociedad española, pagando impuestos, creando empresas, formando familias y participando activamente en la vida comunitaria.

Sin embargo, los excesivos tiempos de espera en los procesos de regularización migratoria nos mantienen en una situación de incertidumbre jurídica que afecta nuestra capacidad de integrarnos plenamente y acceder a servicios básicos.

Por estas razones, solicitamos respetuosamente:

1. La implementación de un proceso de regularización expedita para venezolanos con más de 2 años de residencia demostrable en España.

2. La reducción de los tiempos de respuesta en solicitudes de arraigo social a un máximo de 6 meses.

3. La simplificación de la documentación requerida, reconociendo las dificultades para obtener ciertos documentos del estado venezolano.

4. La creación de una oficina especializada de atención a venezolanos dentro del Ministerio.

Confiamos en la voluntad del Gobierno de España de defender los derechos humanos y en la larga tradición de solidaridad de este país con quienes se encuentran en situación de vulnerabilidad.

Atentamente,
{NOMBRE} {APELLIDO}
Ciudadano/a venezolano/a residente en España`,
}

export default function CampaignDetailPage() {
  const params = useParams()
  const [signed, setSigned] = useState(false)
  const [signing, setSigning] = useState(false)
  const [showLetter, setShowLetter] = useState(false)

  const campaign = mockCampaign
  const pct = Math.min((campaign.signatures / campaign.goal) * 100, 100)

  const handleSign = async () => {
    setSigning(true)
    await new Promise(r => setTimeout(r, 1500))
    setSigned(true)
    setSigning(false)
  }

  if (signed) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✊
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">¡Gracias por tu firma!</h2>
          <p className="text-gray-500 mb-2">
            Tu firma ha sido registrada. Ahora somos{' '}
            <strong className="text-[#CF142B]">{(campaign.signatures + 1).toLocaleString()}</strong> voces.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            La carta será enviada al {campaign.ministry} una vez alcancemos la meta de{' '}
            {campaign.goal.toLocaleString()} firmas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/incidencia" className="btn-primary">
              Ver más campañas
            </Link>
            <button
              onClick={() => {}}
              className="btn-secondary"
            >
              Compartir campaña
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/incidencia" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium">
        ← Volver a campañas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="badge badge-blue">{campaign.category}</span>
            <span className="badge bg-orange-100 text-orange-800">Urgencia: {campaign.urgency}</span>
            <span className="badge badge-blue">🌎 {campaign.country}</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
            {campaign.title}
          </h1>

          <div className="card p-5 mb-6 border-l-4 border-[#CF142B]">
            <p className="text-sm text-gray-600">
              <strong>Dirigida a:</strong> {campaign.ministry}
            </p>
          </div>

          {/* Context */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">¿Por qué esta campaña?</h2>
            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {campaign.context}
            </div>
          </div>

          {/* Letter Preview */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Carta de incidencia</h2>
              <button
                onClick={() => setShowLetter(!showLetter)}
                className="text-sm text-[#003DA5] font-medium hover:underline"
              >
                {showLetter ? 'Ocultar' : 'Ver carta completa'}
              </button>
            </div>

            {!showLetter ? (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <p className="text-gray-500 text-sm italic">
                  &ldquo;Excelentísimo/a Sr./Sra. Ministro/a de Asuntos Exteriores, Unión Europea y Cooperación:
                  Por medio de la presente, yo [Tu nombre], venezolano/a residente en España, me dirijo a Usted respetuosamente...&rdquo;
                </p>
                <button
                  onClick={() => setShowLetter(true)}
                  className="text-sm text-[#003DA5] font-semibold mt-3 hover:underline"
                >
                  Leer carta completa →
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {campaign.letterTemplate
                    .replace('{NOMBRE}', '[Tu nombre]')
                    .replace('{APELLIDO}', '[Tu apellido]')}
                </pre>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-3">
              * Tu nombre y apellido serán incluidos automáticamente al firmar.
            </p>
          </div>
        </div>

        {/* Sidebar - Sign action */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Progress card */}
            <div className="card p-5">
              <div className="text-center mb-5">
                <div className="text-4xl font-black text-[#CF142B] mb-1">
                  {campaign.signatures.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm">firmas de {campaign.goal.toLocaleString()}</div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                <div
                  className="bg-[#CF142B] h-3 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-center text-sm text-gray-500 mb-5">
                {Math.round(pct)}% de la meta alcanzada
              </div>

              <button
                onClick={handleSign}
                disabled={signing}
                className="btn-danger w-full py-4 text-base"
              >
                {signing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Firmando...
                  </span>
                ) : (
                  '✍️ Firmar esta carta'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Al firmar, autorizas el uso de tu nombre en la carta.
              </p>
            </div>

            {/* Deadline */}
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-gray-400">Fecha límite</p>
                  <p className="font-semibold text-gray-800 text-sm">
                    {new Date(campaign.deadline).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="card p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Compartir campaña</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 text-xs bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Twitter/X
                </button>
                <button className="flex-1 py-2 text-xs bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  WhatsApp
                </button>
                <button className="flex-1 py-2 text-xs bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
