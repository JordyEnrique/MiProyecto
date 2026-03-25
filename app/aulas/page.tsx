'use client'

import { useState } from 'react'
import Link from 'next/link'

const classrooms = [
  {
    id: '1',
    title: 'Derechos laborales de venezolanos en Colombia',
    instructor: 'Dra. María Rodríguez',
    description: 'Aprende sobre tus derechos laborales en Colombia: contrato de trabajo, seguridad social, permisos migratorios especiales y más.',
    date: '2024-12-15',
    time: '7:00 PM (COL)',
    duration: '90 min',
    enrolled: 234,
    maxCapacity: 500,
    category: 'Legal',
    isLive: false,
    isUpcoming: true,
    tags: ['Colombia', 'Derechos', 'Laboral'],
  },
  {
    id: '2',
    title: 'Cómo homologar tu título universitario en España',
    instructor: 'Lic. Carlos Méndez',
    description: 'Guía práctica paso a paso para homologar o convalidar títulos universitarios venezolanos en España, incluyendo documentos requeridos.',
    date: '2024-12-18',
    time: '6:00 PM (ESP)',
    duration: '120 min',
    enrolled: 412,
    maxCapacity: 600,
    category: 'Educación',
    isLive: false,
    isUpcoming: true,
    tags: ['España', 'Títulos', 'Convalidación'],
  },
  {
    id: '3',
    title: 'Emprendimiento digital para la diáspora venezolana',
    instructor: 'Ing. Alejandra Pérez',
    description: 'Herramientas y estrategias para crear un negocio digital que funcione desde cualquier país del mundo con clientes globales.',
    date: '2024-12-20',
    time: '8:00 PM (VEN)',
    duration: '90 min',
    enrolled: 189,
    maxCapacity: 400,
    category: 'Emprendimiento',
    isLive: false,
    isUpcoming: true,
    tags: ['Negocios', 'Digital', 'Emprendimiento'],
  },
  {
    id: '4',
    title: 'Salud mental y bienestar en la migración',
    instructor: 'Psic. Valentina Torres',
    description: 'Espacio de reflexión sobre el impacto emocional de la migración y herramientas para cuidar la salud mental en el exterior.',
    date: '2024-12-10',
    time: '7:00 PM (EST)',
    duration: '90 min',
    enrolled: 521,
    maxCapacity: 500,
    category: 'Bienestar',
    isLive: true,
    isUpcoming: false,
    tags: ['Salud Mental', 'Bienestar', 'Migración'],
  },
  {
    id: '5',
    title: 'Proceso de naturalización en Estados Unidos',
    instructor: 'Abog. Roberto Castillo',
    description: 'Todo lo que necesitas saber sobre el proceso de naturalización en EE.UU.: requisitos, tiempos, examen de ciudadanía.',
    date: '2025-01-08',
    time: '7:00 PM (EST)',
    duration: '150 min',
    enrolled: 98,
    maxCapacity: 300,
    category: 'Legal',
    isLive: false,
    isUpcoming: true,
    tags: ['EE.UU.', 'Ciudadanía', 'Naturalización'],
  },
  {
    id: '6',
    title: 'Inversión responsable: enviar dinero a Venezuela',
    instructor: 'Ec. Luis Fernández',
    description: 'Análisis de opciones seguras para enviar dinero a Venezuela, criptomonedas, tasas de cambio y plataformas de remesas.',
    date: '2025-01-15',
    time: '6:00 PM (VEN)',
    duration: '90 min',
    enrolled: 67,
    maxCapacity: 250,
    category: 'Financiero',
    isLive: false,
    isUpcoming: true,
    tags: ['Remesas', 'Inversión', 'Finanzas'],
  },
]

const featuredTalents = [
  {
    id: 1,
    nombre: 'Adriana Morales',
    profesion: 'Ingeniera de Software Senior',
    pais: '🇪🇸 España',
    initials: 'AM',
    color: 'bg-[#003DA5]',
    skills: ['React', 'Node.js', 'Python'],
    disponibilidad: 'Disponible para enseñar',
    rating: 5,
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Vásquez',
    profesion: 'Médico Internista',
    pais: '🇺🇸 EE.UU.',
    initials: 'CV',
    color: 'bg-[#CF142B]',
    skills: ['Medicina Interna', 'Diagnóstico', 'Telemedicina'],
    disponibilidad: 'Ambos',
    rating: 5,
  },
  {
    id: 3,
    nombre: 'Gabriela Torres',
    profesion: 'Abogada de Derecho Migratorio',
    pais: '🇨🇴 Colombia',
    initials: 'GT',
    color: 'bg-green-600',
    skills: ['Derecho Migratorio', 'Refugio', 'Asesoría Legal'],
    disponibilidad: 'Disponible para enseñar',
    rating: 5,
  },
  {
    id: 4,
    nombre: 'Valentina Ríos',
    profesion: 'Profesora de Inglés y Francés',
    pais: '🇦🇷 Argentina',
    initials: 'VR',
    color: 'bg-purple-600',
    skills: ['Inglés', 'Francés', 'IELTS/TOEFL'],
    disponibilidad: 'Disponible para enseñar',
    rating: 5,
  },
  {
    id: 5,
    nombre: 'Rafael Guzmán',
    profesion: 'Chef y Consultor Gastronómico',
    pais: '🇲🇽 México',
    initials: 'RG',
    color: 'bg-yellow-600',
    skills: ['Cocina venezolana', 'Gestión', 'Pastelería'],
    disponibilidad: 'Disponible para enseñar',
    rating: 4,
  },
  {
    id: 6,
    nombre: 'Ana Belén Rojas',
    profesion: 'Consultora de Negocios y MBA',
    pais: '🇵🇦 Panamá',
    initials: 'AB',
    color: 'bg-indigo-600',
    skills: ['Estrategia empresarial', 'Finanzas', 'Startups'],
    disponibilidad: 'Ambos',
    rating: 5,
  },
]

const categoryColors: Record<string, string> = {
  Legal: 'bg-blue-100 text-blue-700',
  Educación: 'bg-purple-100 text-purple-700',
  Emprendimiento: 'bg-yellow-100 text-yellow-700',
  Bienestar: 'bg-green-100 text-green-700',
  Financiero: 'bg-orange-100 text-orange-700',
}

const availabilityColors: Record<string, string> = {
  'Disponible para enseñar': 'bg-green-100 text-green-800',
  'Busca aprender': 'bg-blue-100 text-[#003DA5]',
  'Ambos': 'bg-purple-100 text-purple-800',
}

export default function AulasPage() {
  const [activeTab, setActiveTab] = useState<'aulas' | 'talentos'>('aulas')
  const liveClassrooms = classrooms.filter(c => c.isLive)
  const upcomingClassrooms = classrooms.filter(c => c.isUpcoming && !c.isLive)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="section-title text-4xl">Aulas Virtuales & Talentos</h1>
        <p className="section-subtitle">
          Aprende en sesiones en vivo, o conecta con talentos de la diáspora venezolana para compartir y adquirir conocimiento.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('aulas')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
            activeTab === 'aulas'
              ? 'border-[#003DA5] text-[#003DA5]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🎓 Aulas Virtuales
        </button>
        <button
          onClick={() => setActiveTab('talentos')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
            activeTab === 'talentos'
              ? 'border-[#003DA5] text-[#003DA5]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ⭐ Directorio de Talentos
        </button>
      </div>

      {/* TAB: Aulas Virtuales */}
      {activeTab === 'aulas' && (
        <>
          {/* Live Now */}
          {liveClassrooms.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-gray-900">EN VIVO AHORA</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {liveClassrooms.map((cls) => (
                  <div key={cls.id} className="card border-2 border-red-200 overflow-hidden">
                    <div className="bg-[#CF142B] text-white px-5 py-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-sm font-semibold">EN VIVO - {cls.enrolled} participantes</span>
                    </div>
                    <div className="p-6">
                      <span className={`badge ${categoryColors[cls.category] || 'badge-blue'} mb-3`}>
                        {cls.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{cls.title}</h3>
                      <p className="text-gray-500 text-sm mb-3">{cls.description}</p>
                      <p className="text-sm text-gray-600 font-medium mb-4">👤 {cls.instructor}</p>
                      <button className="btn-danger w-full">
                        Unirse a la sesión en vivo →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">
              Próximas sesiones
              <span className="ml-2 badge badge-blue">{upcomingClassrooms.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingClassrooms.map((cls) => {
                const fillPct = (cls.enrolled / cls.maxCapacity) * 100
                return (
                  <div key={cls.id} className="card-hover flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className={`badge ${categoryColors[cls.category] || 'badge-blue'}`}>
                          {cls.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{cls.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{cls.description}</p>

                      <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <span>👤</span>
                          <span className="font-medium text-gray-700">{cls.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{new Date(cls.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>🕐</span>
                          <span>{cls.time} — {cls.duration}</span>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{cls.enrolled} inscritos</span>
                          <span>{cls.maxCapacity - cls.enrolled} plazas disponibles</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${fillPct > 80 ? 'bg-red-400' : 'bg-[#003DA5]'}`}
                            style={{ width: `${Math.min(fillPct, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {cls.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="px-6 pb-5">
                      <button className="btn-primary w-full text-sm py-2.5">
                        Inscribirse gratis
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Propose a classroom */}
          <section className="mt-12 bg-gradient-to-r from-[#003DA5] to-[#001e52] rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-3">¿Quieres dictar un Aula Virtual?</h3>
              <p className="text-blue-200 mb-6">
                Si tienes conocimiento valioso para la comunidad venezolana, propon tu sesión y ayuda
                a otros a navegar los desafíos de la diáspora.
              </p>
              <button className="btn-yellow">
                Proponer sesión →
              </button>
            </div>
          </section>
        </>
      )}

      {/* TAB: Directorio de Talentos */}
      {activeTab === 'talentos' && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Directorio de Talentos</h2>
              <p className="text-gray-500 text-sm mt-1">Venezolanos de la diáspora listos para enseñar y conectar.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/talentos" className="btn-secondary text-sm py-2.5">
                Ver directorio completo →
              </Link>
              <Link href="/talentos/registro" className="btn-yellow text-sm py-2.5">
                + Registrar talento
              </Link>
            </div>
          </div>

          {/* Featured talents grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTalents.map(talent => (
              <div key={talent.id} className="card-hover flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${talent.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-sm">{talent.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{talent.nombre}</h3>
                      <p className="text-xs text-gray-500 truncate">{talent.pais}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mb-3 leading-snug">{talent.profesion}</p>
                  <span className={`badge text-xs mb-3 inline-block ${availabilityColors[talent.disponibilidad]}`}>
                    {talent.disponibilidad}
                  </span>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {talent.skills.map((skill, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < talent.rating ? 'text-[#FFD200]' : 'text-gray-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button className="btn-primary w-full text-sm py-2.5">Conectar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/talentos" className="btn-primary">
              Ver todos los talentos →
            </Link>
          </div>

          {/* CTA */}
          <section className="mt-12 bg-gradient-to-r from-[#003DA5] to-[#001e52] rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-3">¿Tienes un talento que compartir?</h3>
              <p className="text-blue-200 mb-6">
                Regístrate en nuestro directorio y conecta con venezolanos que buscan aprender de tu experiencia.
              </p>
              <Link href="/talentos/registro" className="btn-yellow">
                Registrarme como talento →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
