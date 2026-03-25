'use client'

import { useState } from 'react'
import Link from 'next/link'

const areas = ['Tecnología', 'Salud', 'Derecho', 'Arte', 'Idiomas', 'Negocios', 'Educación', 'Ingeniería', 'Otro']

const ofreceMenciones = [
  'Mentoría 1 a 1',
  'Talleres grupales',
  'Conferencias',
  'Consultorías',
  'Voluntariado',
]

export default function TalentosRegistroPage() {
  const [form, setForm] = useState({
    area: '',
    especialidad: '',
    experiencia: '',
    ofrece: [] as string[],
    quierAprender: '',
    disponibilidad: '',
    linkedin: '',
    bio: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleCheck = (item: string) => {
    setForm(prev => ({
      ...prev,
      ofrece: prev.ofrece.includes(item)
        ? prev.ofrece.filter(o => o !== item)
        : [...prev.ofrece, item],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.area || !form.especialidad || !form.experiencia) {
      setError('Por favor completa los campos obligatorios marcados con *')
      return
    }
    setError('')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page-container">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">¡Registro exitoso!</h1>
          <p className="text-gray-600 mb-2">
            Tu perfil de talento ha sido enviado para revisión.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            En las próximas 24-48 horas aparecerás en el Directorio de Talentos y podrás empezar a conectar con la comunidad venezolana.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/talentos" className="btn-primary">
              Ver directorio de talentos
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Ir a mi dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="page-header">
          <div className="venezuela-stripe w-24 h-1 mb-4" />
          <Link href="/talentos" className="text-sm text-[#003DA5] hover:underline mb-3 inline-block">
            ← Volver al directorio
          </Link>
          <h1 className="section-title text-4xl">Registra tu Talento</h1>
          <p className="section-subtitle">
            Únete al directorio de talentos de la diáspora venezolana. Comparte tu experiencia y conecta con compatriotas.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Area de expertise */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#003DA5] rounded-full text-white text-sm font-bold flex items-center justify-center">1</span>
              Expertise y Especialidad
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Área de expertise <span className="text-red-500">*</span></label>
                <select
                  className="input-field"
                  value={form.area}
                  onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                  required
                >
                  <option value="">Selecciona un área...</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Especialidad específica <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ej: Desarrollo web full-stack"
                  value={form.especialidad}
                  onChange={e => setForm(prev => ({ ...prev, especialidad: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label-field">Años de experiencia <span className="text-red-500">*</span></label>
                <select
                  className="input-field"
                  value={form.experiencia}
                  onChange={e => setForm(prev => ({ ...prev, experiencia: e.target.value }))}
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="1-2">1 - 2 años</option>
                  <option value="3-5">3 - 5 años</option>
                  <option value="6-10">6 - 10 años</option>
                  <option value="11-15">11 - 15 años</option>
                  <option value="15+">Más de 15 años</option>
                </select>
              </div>
              <div>
                <label className="label-field">Disponibilidad semanal</label>
                <select
                  className="input-field"
                  value={form.disponibilidad}
                  onChange={e => setForm(prev => ({ ...prev, disponibilidad: e.target.value }))}
                >
                  <option value="">Selecciona...</option>
                  <option value="1-2">1 - 2 horas/semana</option>
                  <option value="3-5">3 - 5 horas/semana</option>
                  <option value="5-10">5 - 10 horas/semana</option>
                  <option value="10+">Más de 10 horas/semana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lo que ofreces */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#003DA5] rounded-full text-white text-sm font-bold flex items-center justify-center">2</span>
              ¿Qué ofreces?
            </h2>
            <p className="text-sm text-gray-500 mb-4">Selecciona las modalidades en las que puedes participar:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ofreceMenciones.map(item => (
                <label
                  key={item}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    form.ofrece.includes(item)
                      ? 'border-[#003DA5] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#003DA5] rounded"
                    checked={form.ofrece.includes(item)}
                    onChange={() => handleCheck(item)}
                  />
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lo que buscas aprender */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#003DA5] rounded-full text-white text-sm font-bold flex items-center justify-center">3</span>
              ¿Qué buscas aprender?
            </h2>
            <div>
              <label className="label-field">Áreas o habilidades que te interesan</label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej: Marketing digital, idiomas, programación..."
                value={form.quierAprender}
                onChange={e => setForm(prev => ({ ...prev, quierAprender: e.target.value }))}
              />
              <p className="text-xs text-gray-400 mt-1">Opcional. Ayuda a otros a conectar contigo.</p>
            </div>
          </div>

          {/* Perfil y contacto */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#003DA5] rounded-full text-white text-sm font-bold flex items-center justify-center">4</span>
              Perfil y Contacto
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">URL de LinkedIn</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://linkedin.com/in/tu-perfil"
                  value={form.linkedin}
                  onChange={e => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Opcional. Facilita que otros revisen tu trayectoria.</p>
              </div>
              <div>
                <label className="label-field">Sobre mí (Bio)</label>
                <textarea
                  className="input-field min-h-[120px] resize-y"
                  placeholder="Cuéntanos sobre tu trayectoria, experiencia y por qué quieres participar en este directorio..."
                  value={form.bio}
                  onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.bio.length}/500 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="btn-primary flex-1 text-base py-3.5">
              Registrar mi talento →
            </button>
            <Link href="/talentos" className="btn-secondary text-center">
              Cancelar
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Al registrarte aceptas que tu perfil sea visible en el directorio público de talentos de Mi Voto Cuenta.
          </p>
        </form>
      </div>
    </div>
  )
}
