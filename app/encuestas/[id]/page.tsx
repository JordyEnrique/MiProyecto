'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Question {
  id: string
  text: string
  type: 'single' | 'multiple' | 'text' | 'rating'
  options?: string[]
}

const mockSurvey = {
  id: '1',
  title: 'Condiciones laborales de la diáspora venezolana 2024',
  description: 'Esta encuesta busca entender las condiciones de empleo, salario y derechos laborales de los venezolanos en el exterior. Tus respuestas son completamente confidenciales y serán utilizadas para elaborar informes que apoyen políticas de protección a migrantes.',
  category: 'Laboral',
  timeEstimate: '8 min',
  responses: 2847,
  questions: [
    {
      id: 'q1',
      text: '¿En qué país resides actualmente?',
      type: 'single' as const,
      options: ['España', 'Estados Unidos', 'Colombia', 'Chile', 'Perú', 'Argentina', 'Ecuador', 'Panamá', 'Otro'],
    },
    {
      id: 'q2',
      text: '¿Cuál es tu situación laboral actual?',
      type: 'single' as const,
      options: [
        'Empleado formal (con contrato)',
        'Empleado informal',
        'Trabajador independiente / freelance',
        'Emprendedor / Empresario',
        'Desempleado buscando trabajo',
        'Estudiante',
        'No aplica',
      ],
    },
    {
      id: 'q3',
      text: '¿Tu trabajo actual corresponde a tu nivel de formación o experiencia previa?',
      type: 'single' as const,
      options: [
        'Sí, trabajo en mi área de formación',
        'Parcialmente, hay algo relacionado',
        'No, trabajo en un área diferente',
        'No aplica',
      ],
    },
    {
      id: 'q4',
      text: '¿Cuáles son los principales obstáculos que has enfrentado en el mercado laboral? (Selecciona todos los que apliquen)',
      type: 'multiple' as const,
      options: [
        'Reconocimiento de títulos / convalidación',
        'Discriminación por nacionalidad',
        'Barrera del idioma',
        'Falta de documentos migratorios',
        'Falta de experiencia local',
        'Redes de contacto limitadas',
        'No he tenido obstáculos significativos',
      ],
    },
    {
      id: 'q5',
      text: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con tus condiciones laborales actuales?',
      type: 'rating' as const,
    },
    {
      id: 'q6',
      text: '¿Has experimentado algún tipo de discriminación laboral por ser venezolano?',
      type: 'single' as const,
      options: ['Sí, frecuentemente', 'Sí, ocasionalmente', 'Raramente', 'No', 'No estoy seguro/a'],
    },
    {
      id: 'q7',
      text: '¿Qué tipo de apoyo necesitas más para mejorar tu situación laboral?',
      type: 'text' as const,
    },
  ] as Question[],
}

export default function SurveyDetailPage() {
  const params = useParams()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const survey = mockSurvey
  const currentQuestion = survey.questions[currentStep]
  const totalQuestions = survey.questions.length
  const progress = ((currentStep + 1) / totalQuestions) * 100

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleMultipleToggle = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) || []
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option]
    handleAnswer(questionId, updated)
  }

  const canContinue = () => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.type === 'text') return true
    if (currentQuestion.type === 'multiple') return Array.isArray(answer) && answer.length > 0
    return !!answer
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">¡Gracias por participar!</h2>
          <p className="text-gray-500 mb-2">
            Tu respuesta ha sido registrada exitosamente.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Tus datos serán incluidos en el informe sobre condiciones laborales de la diáspora venezolana 2024.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/encuestas" className="btn-primary">
              Ver más encuestas
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/encuestas" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium">
        ← Volver a encuestas
      </Link>

      {/* Survey Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#003DA5] rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
            📋
          </div>
          <div>
            <span className="badge badge-blue mb-2">{survey.category}</span>
            <h1 className="text-2xl font-black text-gray-900 mb-1">{survey.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed">{survey.description}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-400">
              <span>⏱️ {survey.timeEstimate}</span>
              <span>👥 {survey.responses.toLocaleString()} respuestas</span>
              <span>❓ {totalQuestions} preguntas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Pregunta {currentStep + 1} de {totalQuestions}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-[#003DA5] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card p-8 mb-6">
        <div className="mb-6">
          <span className="text-xs font-semibold text-[#003DA5] uppercase tracking-wide">
            Pregunta {currentStep + 1}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">{currentQuestion.text}</h2>
        </div>

        {/* Single choice */}
        {currentQuestion.type === 'single' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option
                    ? 'border-[#003DA5] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswer(currentQuestion.id, option)}
                  className="text-[#003DA5]"
                />
                <span className="text-gray-800 text-sm font-medium">{option}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple choice */}
        {currentQuestion.type === 'multiple' && currentQuestion.options && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 mb-3">Selecciona todas las opciones que apliquen</p>
            {currentQuestion.options.map((option) => {
              const selected = ((answers[currentQuestion.id] as string[]) || []).includes(option)
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selected ? 'border-[#003DA5] bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleMultipleToggle(currentQuestion.id, option)}
                    className="text-[#003DA5] rounded"
                  />
                  <span className="text-gray-800 text-sm font-medium">{option}</span>
                </label>
              )
            })}
          </div>
        )}

        {/* Rating */}
        {currentQuestion.type === 'rating' && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>1 - Muy insatisfecho</span>
              <span>5 - Muy satisfecho</span>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, String(val))}
                  className={`flex-1 py-5 rounded-xl border-2 text-xl font-bold transition-all ${
                    answers[currentQuestion.id] === String(val)
                      ? 'border-[#003DA5] bg-[#003DA5] text-white'
                      : 'border-gray-200 text-gray-500 hover:border-[#003DA5] hover:text-[#003DA5]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text */}
        {currentQuestion.type === 'text' && (
          <textarea
            value={(answers[currentQuestion.id] as string) || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="input-field min-h-[120px] resize-none"
            placeholder="Escribe tu respuesta aquí..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>

        {currentStep < totalQuestions - 1 ? (
          <button
            onClick={() => setCurrentStep(s => s + 1)}
            disabled={!canContinue()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar respuestas ✓'
            )}
          </button>
        )}
      </div>
    </div>
  )
}
