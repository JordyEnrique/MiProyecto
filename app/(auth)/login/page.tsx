'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top stripe */}
      <div className="venezuela-stripe fixed top-0 left-0 right-0 z-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 mb-6">
          <img src="/logo-icon.svg" alt="Mi Voz Cuenta" className="w-12 h-12" />
          <div>
            <span className="font-bold text-xl text-gray-900 block">Mi Voz Cuenta</span>
            <span className="text-gray-500 text-sm">Diáspora Venezolana</span>
          </div>
        </Link>

        <h2 className="text-center text-3xl font-black text-gray-900">
          Iniciar Sesión
        </h2>
        <p className="text-center text-gray-500 mt-2 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-[#003DA5] font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label-field">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-field">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Tu contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-[#003DA5]" />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <a href="#" className="text-[#003DA5] hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Al iniciar sesión, aceptas nuestros{' '}
              <a href="#" className="text-[#003DA5] hover:underline">términos de uso</a>
              {' '}y{' '}
              <a href="#" className="text-[#003DA5] hover:underline">política de privacidad</a>.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Venezolanos en el mundo</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex gap-1">
            {['🇻🇪', '🇪🇸', '🇺🇸', '🇨🇴', '🇵🇪', '🇨🇱'].map((flag, i) => (
              <span key={i} className="text-2xl">{flag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
