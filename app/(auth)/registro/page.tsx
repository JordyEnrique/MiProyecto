'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Canadá', 'Chile', 'Colombia', 'Costa Rica',
  'Ecuador', 'España', 'Estados Unidos', 'Francia', 'Italia', 'México', 'Panamá',
  'Paraguay', 'Perú', 'Portugal', 'República Dominicana', 'Trinidad y Tobago',
  'Uruguay', 'Otro',
]

interface FormData {
  nombre: string
  apellido: string
  cedula: string
  telefono: string
  email: string
  password: string
  confirmPassword: string
  pais: string
  ciudad: string
  profesion: string
}

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: '',
    ciudad: '',
    profesion: '',
  })

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
        setError('Por favor completa todos los campos requeridos.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.')
        return
      }
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.pais || !formData.ciudad) {
      setError('Por favor completa tu país y ciudad de residencia.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          lastName: formData.apellido,
          cedula: formData.cedula,
          phone: formData.telefono,
          email: formData.email,
          password: formData.password,
          country: formData.pais,
          city: formData.ciudad,
          profession: formData.profesion,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar usuario.')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link href="/" className="flex justify-center items-center gap-3 mb-6">
          <img src="/logo-icon.svg" alt="Mi Voto Cuenta" className="w-12 h-12" />
          <div>
            <span className="font-bold text-xl text-gray-900 block">Mi Voto Cuenta</span>
            <span className="text-gray-500 text-sm">Diáspora Venezolana</span>
          </div>
        </Link>

        <h2 className="text-center text-3xl font-black text-gray-900">
          Crear mi cuenta
        </h2>
        <p className="text-center text-gray-500 mt-2 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-[#003DA5] font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>

        {/* Progress steps */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s === step
                  ? 'bg-[#003DA5] text-white'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <span className={`text-sm font-medium ${s === step ? 'text-[#003DA5]' : 'text-gray-400'}`}>
                {s === 1 ? 'Datos personales' : 'Residencia'}
              </span>
              {s < 2 && <div className="w-8 h-px bg-gray-300 ml-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => updateField('nombre', e.target.value)}
                    className="input-field"
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">Apellido *</label>
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => updateField('apellido', e.target.value)}
                    className="input-field"
                    placeholder="García"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Cédula venezolana</label>
                  <input
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => updateField('cedula', e.target.value)}
                    className="input-field"
                    placeholder="V-12345678"
                  />
                </div>
                <div>
                  <label className="label-field">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => updateField('telefono', e.target.value)}
                    className="input-field"
                    placeholder="+58 412 0000000"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Correo electrónico *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="input-field"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="label-field">Contraseña *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="input-field"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="label-field">Confirmar contraseña *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="input-field"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full text-base py-3">
                Continuar →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-field">País de residencia *</label>
                <select
                  value={formData.pais}
                  onChange={(e) => updateField('pais', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona tu país</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-field">Ciudad *</label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => updateField('ciudad', e.target.value)}
                  className="input-field"
                  placeholder="Madrid, Miami, Bogotá..."
                  required
                />
              </div>

              <div>
                <label className="label-field">Profesión u ocupación</label>
                <input
                  type="text"
                  value={formData.profesion}
                  onChange={(e) => updateField('profesion', e.target.value)}
                  className="input-field"
                  placeholder="Ingeniero, médico, estudiante..."
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 leading-relaxed">
                  Al crear tu cuenta aceptas nuestros{' '}
                  <a href="#" className="underline font-medium">términos de uso</a>
                  {' '}y{' '}
                  <a href="#" className="underline font-medium">política de privacidad</a>.
                  Tus datos son confidenciales y no serán compartidos sin tu consentimiento.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creando cuenta...
                    </span>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
