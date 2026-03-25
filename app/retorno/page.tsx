'use client'

import { useState } from 'react'

const destinations = [
  'Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay',
  'Mérida', 'Barinas', 'Ciudad Bolívar', 'Porlamar', 'Otro',
]

const timelines = [
  'En los próximos 6 meses',
  'En el próximo año',
  'En los próximos 2 años',
  'En 3 a 5 años',
  'Cuando las condiciones mejoren',
  'Solo explorando opciones',
]

const skillCategories = [
  'Medicina y Salud', 'Ingeniería y Tecnología', 'Educación y Docencia',
  'Derecho y Justicia', 'Economía y Finanzas', 'Agricultura y Ambiente',
  'Arte y Cultura', 'Comercio y Emprendimiento', 'Construcción y Arquitectura',
  'Ciencias e Investigación',
]

interface FormData {
  destination: string
  timeline: string
  skills: string[]
  needs: string
  message: string
}

const stats = [
  { value: '1,200+', label: 'Registrados para retorno' },
  { value: '45', label: 'Ciudades de destino' },
  { value: '78%', label: 'Con planes concretos' },
  { value: '23', label: 'Sectores productivos' },
]

const testimonials = [
  {
    name: 'María José F.',
    from: 'Regresó de España',
    profession: 'Médica',
    text: 'Después de 5 años en Madrid, decidí regresar a Barquisimeto. La plataforma me ayudó a conectar con hospitales locales y planificar mi retorno.',
  },
  {
    name: 'Carlos A.',
    from: 'Regresó de Colombia',
    profession: 'Ingeniero',
    text: 'Trabajé 3 años en Bogotá. Con los ahorros y las conexiones que hice a través de Mi Voz Cuenta, pude abrir mi empresa en Maracaibo.',
  },
]

export default function RetornoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    destination: '',
    timeline: '',
    skills: [],
    needs: '',
    message: '',
  })

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 1000))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            🏠
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">¡Registro exitoso!</h2>
          <p className="text-gray-500 mb-2">
            Tu registro de intención de retorno ha sido guardado.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Te contactaremos con información relevante sobre oportunidades en {form.destination} y
            recursos para tu proceso de retorno.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Destino</p>
              <p className="font-semibold text-gray-800">{form.destination}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Tiempo estimado</p>
              <p className="font-semibold text-gray-800 text-sm">{form.timeline}</p>
            </div>
          </div>
          <a href="/dashboard" className="btn-primary inline-block">
            Ir al Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="section-title text-4xl">Retorno a Venezuela</h1>
        <p className="section-subtitle max-w-2xl">
          Si estás pensando en regresar a Venezuela, regístrate aquí. Tu perfil ayuda a
          conectarte con oportunidades y recursos para facilitar tu retorno.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5 text-center">
            <div className="text-3xl font-black text-[#FFD200] drop-shadow-sm mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registra tu intención de retorno</h2>
            <p className="text-gray-500 text-sm mb-6">
              Este registro es confidencial y te ayuda a conectar con recursos y oportunidades para tu retorno.
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    s === step ? 'bg-[#003DA5] text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {s < step ? '✓' : s}
                  </div>
                  {s < 3 && <div className="w-8 h-px bg-gray-200" />}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-2">
                {step === 1 ? 'Destino y tiempo' : step === 2 ? 'Tu perfil' : 'Mensaje adicional'}
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="label-field">¿A qué ciudad de Venezuela deseas retornar? *</label>
                    <select
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Selecciona tu destino</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label-field">¿Cuándo planeas regresar? *</label>
                    <div className="space-y-2">
                      {timelines.map((t) => (
                        <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          form.timeline === t ? 'border-[#003DA5] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="timeline"
                            value={t}
                            checked={form.timeline === t}
                            onChange={() => setForm({ ...form, timeline: t })}
                            className="text-[#003DA5]"
                          />
                          <span className="text-sm text-gray-700">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => form.destination && form.timeline && setStep(2)}
                    className="btn-primary w-full py-3 disabled:opacity-50"
                    disabled={!form.destination || !form.timeline}
                  >
                    Continuar →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="label-field">¿En qué áreas tienes habilidades? (Selecciona las que apliquen)</label>
                    <p className="text-xs text-gray-400 mb-3">
                      Esto ayuda a conectarte con oportunidades en Venezuela en tu área.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {skillCategories.map((skill) => (
                        <label key={skill} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                          form.skills.includes(skill) ? 'border-[#003DA5] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="checkbox"
                            checked={form.skills.includes(skill)}
                            onChange={() => toggleSkill(skill)}
                            className="text-[#003DA5] rounded"
                          />
                          <span className="text-gray-700 text-xs">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label-field">¿Qué necesitas para facilitar tu retorno?</label>
                    <textarea
                      value={form.needs}
                      onChange={(e) => setForm({ ...form, needs: e.target.value })}
                      className="input-field min-h-[100px] resize-none"
                      placeholder="Ej: información sobre empleadores, apoyo para homologar títulos, conexiones con empresas locales..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                      ← Atrás
                    </button>
                    <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 py-3">
                      Continuar →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="label-field">Mensaje adicional (opcional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field min-h-[120px] resize-none"
                      placeholder="¿Hay algo más que quieras compartir sobre tu proceso de retorno? ¿Tienes una historia que inspire a otros?"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Resumen de tu registro:</strong>
                    </p>
                    <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                      <li>📍 Destino: <strong>{form.destination}</strong></li>
                      <li>📅 Tiempo: <strong>{form.timeline}</strong></li>
                      <li>🎓 Habilidades: <strong>{form.skills.length > 0 ? form.skills.slice(0, 2).join(', ') + (form.skills.length > 2 ? '...' : '') : 'No especificado'}</strong></li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">
                      ← Atrás
                    </button>
                    <button type="submit" className="btn-yellow flex-1 py-3">
                      Registrar intención →
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Info card */}
          <div className="card p-5 border-t-4 border-[#FFD200]">
            <h3 className="font-bold text-gray-900 mb-3">¿Qué obtendrás?</h3>
            <ul className="space-y-3 text-sm">
              {[
                { icon: '🔗', text: 'Conexiones con empleadores en Venezuela' },
                { icon: '📊', text: 'Informes sobre el mercado laboral local' },
                { icon: '🏘️', text: 'Red de venezolanos retornados' },
                { icon: '📋', text: 'Guías para el proceso de retorno' },
                { icon: '💼', text: 'Apoyo para iniciar negocios en Venezuela' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="text-gray-600 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonials */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Historias de retorno</h3>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-600 italic leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.profession} · {t.from}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
