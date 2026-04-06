'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
  mode: string
  paperBalance: number
  maxBetPct: number
  autoBet: boolean
  minConfidence: number
  polyApiKey: string
  polyApiSecret: string
  polyPassphrase: string
  polyAddress: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    mode:          'paper',
    paperBalance:  1000,
    maxBetPct:     5,
    autoBet:       false,
    minConfidence: 0.65,
    polyApiKey:    '',
    polyApiSecret: '',
    polyPassphrase:'',
    polyAddress:   '',
  })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [showKeys, setShowKeys] = useState(false)

  useEffect(() => {
    fetch('/api/predictor/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(prev => ({ ...prev, ...data }))
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/predictor/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Error al guardar')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  function handleChange(key: keyof Settings, value: unknown) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/predictor" className="text-sm text-blue-600 hover:underline mb-1 block">
          ← Volver al predictor
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración del Predictor</h1>
      </div>

      <div className="space-y-6">
        {/* Mode selector */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Modo de operación</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleChange('mode', 'paper')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                settings.mode === 'paper'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="text-2xl mb-1">📄</div>
              <div className="font-semibold text-gray-900">Modo Prueba</div>
              <div className="text-xs text-gray-500 mt-1">
                Practica con balance virtual sin riesgo real. Ideal para probar estrategias.
              </div>
            </button>
            <button
              onClick={() => handleChange('mode', 'real')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                settings.mode === 'real'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-200'
              }`}
            >
              <div className="text-2xl mb-1">💰</div>
              <div className="font-semibold text-gray-900">Dinero Real</div>
              <div className="text-xs text-gray-500 mt-1">
                Conecta tu cuenta de Polymarket para apostar con USDC real en Polygon.
              </div>
            </button>
          </div>

          {settings.mode === 'real' && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              ⚠️ Las apuestas con dinero real son irreversibles. Asegúrate de entender los riesgos antes de continuar.
            </div>
          )}
        </div>

        {/* Paper balance */}
        {settings.mode === 'paper' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Balance de prueba</h2>
            <div>
              <label className="label-field">Balance inicial (USDC virtuales)</label>
              <input
                type="number"
                min="100"
                step="100"
                value={settings.paperBalance}
                onChange={e => handleChange('paperBalance', Number(e.target.value))}
                className="input-field mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">
                Puedes reiniciar tu balance virtual cambiando este valor.
              </p>
            </div>
          </div>
        )}

        {/* Betting strategy */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Estrategia de apuestas</h2>

          <div className="space-y-4">
            <div>
              <label className="label-field">
                Tamaño máximo de apuesta (% del balance)
                <span className="ml-2 text-blue-600 font-bold">{settings.maxBetPct}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={settings.maxBetPct}
                onChange={e => handleChange('maxBetPct', Number(e.target.value))}
                className="w-full mt-1 accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>Conservador (1%)</span>
                <span>Agresivo (25%)</span>
              </div>
            </div>

            {/* Auto-bet */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 text-sm">Apuesta automática</p>
                <p className="text-xs text-gray-500">
                  La IA coloca apuestas automáticamente cuando la confianza supera el umbral
                </p>
              </div>
              <button
                onClick={() => handleChange('autoBet', !settings.autoBet)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoBet ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  settings.autoBet ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {settings.autoBet && (
              <div>
                <label className="label-field">
                  Confianza mínima para auto-apostar
                  <span className="ml-2 text-blue-600 font-bold">
                    {(settings.minConfidence * 100).toFixed(0)}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={settings.minConfidence}
                  onChange={e => handleChange('minConfidence', Number(e.target.value))}
                  className="w-full mt-1 accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>50% (más apuestas)</span>
                  <span>95% (muy selectivo)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Polymarket credentials */}
        {settings.mode === 'real' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Credenciales Polymarket</h2>
              <button
                onClick={() => setShowKeys(v => !v)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showKeys ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-700">
              <p className="font-semibold mb-1">Cómo obtener tus credenciales:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Inicia sesión en <strong>polymarket.com</strong></li>
                <li>Ve a <strong>Configuración → API</strong></li>
                <li>Crea una nueva API key con permisos de trading</li>
                <li>Copia los valores a continuación</li>
              </ol>
            </div>

            <div className="space-y-3">
              {[
                { key: 'polyAddress',    label: 'Wallet Address (0x…)', ph: '0x1234…abcd' },
                { key: 'polyApiKey',     label: 'API Key',              ph: 'poly_api_key_…' },
                { key: 'polyApiSecret',  label: 'API Secret',           ph: '••••••••••••' },
                { key: 'polyPassphrase', label: 'Passphrase',           ph: '••••••••' },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="label-field">{label}</label>
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={settings[key as keyof Settings] as string}
                    onChange={e => handleChange(key as keyof Settings, e.target.value)}
                    placeholder={ph}
                    className="input-field mt-1 font-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI info */}
        <div className="card bg-purple-50 border-purple-200">
          <h2 className="text-lg font-bold text-gray-900 mb-2">🤖 Motor de IA</h2>
          <p className="text-sm text-gray-600">
            Las predicciones usan <strong>Claude Opus 4.6</strong> con pensamiento adaptativo para analizar
            cada mercado. Necesitas configurar la variable de entorno <code className="bg-white px-1 rounded">ANTHROPIC_API_KEY</code> en
            el servidor.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Costo estimado: ~$0.05 – $0.20 por predicción dependiendo de la complejidad del mercado.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary py-3 text-base disabled:opacity-50"
        >
          {saving ? '💾 Guardando…' : saved ? '✅ ¡Guardado!' : '💾 Guardar configuración'}
        </button>
      </div>
    </main>
  )
}
