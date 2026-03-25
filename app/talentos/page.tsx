'use client'

import { useState } from 'react'
import Link from 'next/link'

const talents = [
  {
    id: 1,
    nombre: 'Adriana Morales',
    profesion: 'Ingeniera de Software Senior',
    pais: '🇪🇸 España',
    initials: 'AM',
    color: 'bg-[#003DA5]',
    skills: ['React', 'Node.js', 'Python'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Tecnología',
    rating: 5,
    experiencia: 8,
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Vásquez',
    profesion: 'Médico Internista',
    pais: '🇺🇸 EE.UU.',
    initials: 'CV',
    color: 'bg-[#CF142B]',
    skills: ['Medicina Interna', 'Diagnóstico Clínico', 'Telemedicina'],
    disponibilidad: 'Ambos',
    area: 'Salud',
    rating: 5,
    experiencia: 12,
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
    area: 'Derecho',
    rating: 5,
    experiencia: 7,
  },
  {
    id: 4,
    nombre: 'Luis Hernández',
    profesion: 'Arquitecto y Diseñador Urbano',
    pais: '🇨🇱 Chile',
    initials: 'LH',
    color: 'bg-orange-500',
    skills: ['AutoCAD', 'Diseño Urbano', 'Sustentabilidad'],
    disponibilidad: 'Ambos',
    area: 'Ingeniería',
    rating: 4,
    experiencia: 10,
  },
  {
    id: 5,
    nombre: 'Valentina Ríos',
    profesion: 'Profesora de Inglés y Francés',
    pais: '🇦🇷 Argentina',
    initials: 'VR',
    color: 'bg-purple-600',
    skills: ['Inglés', 'Francés', 'IELTS/TOEFL'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Idiomas',
    rating: 5,
    experiencia: 6,
  },
  {
    id: 6,
    nombre: 'Rafael Guzmán',
    profesion: 'Chef y Consultor Gastronómico',
    pais: '🇲🇽 México',
    initials: 'RG',
    color: 'bg-yellow-600',
    skills: ['Cocina venezolana', 'Gestión de restaurantes', 'Pastelería'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Arte',
    rating: 4,
    experiencia: 15,
  },
  {
    id: 7,
    nombre: 'Dr. Pedro Salazar',
    profesion: 'Odontólogo Especialista',
    pais: '🇵🇪 Perú',
    initials: 'PS',
    color: 'bg-teal-600',
    skills: ['Ortodoncia', 'Endodoncia', 'Implantología'],
    disponibilidad: 'Busca aprender',
    area: 'Salud',
    rating: 4,
    experiencia: 9,
  },
  {
    id: 8,
    nombre: 'Ana Belén Rojas',
    profesion: 'Consultora de Negocios y MBA',
    pais: '🇵🇦 Panamá',
    initials: 'AB',
    color: 'bg-indigo-600',
    skills: ['Estrategia empresarial', 'Finanzas', 'Startups'],
    disponibilidad: 'Ambos',
    area: 'Negocios',
    rating: 5,
    experiencia: 11,
  },
  {
    id: 9,
    nombre: 'Marcos Delgado',
    profesion: 'Desarrollador Full Stack',
    pais: '🇨🇴 Colombia',
    initials: 'MD',
    color: 'bg-slate-700',
    skills: ['TypeScript', 'AWS', 'PostgreSQL'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Tecnología',
    rating: 5,
    experiencia: 5,
  },
  {
    id: 10,
    nombre: 'Carmen Jiménez',
    profesion: 'Psicóloga Clínica',
    pais: '🇪🇸 España',
    initials: 'CJ',
    color: 'bg-pink-600',
    skills: ['Terapia Cognitiva', 'Salud Mental Migrante', 'Psicología Infantil'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Salud',
    rating: 5,
    experiencia: 8,
  },
  {
    id: 11,
    nombre: 'Daniel Arteaga',
    profesion: 'Músico y Productor Musical',
    pais: '🇺🇸 EE.UU.',
    initials: 'DA',
    color: 'bg-red-700',
    skills: ['Guitarra', 'Producción musical', 'Canto'],
    disponibilidad: 'Ambos',
    area: 'Arte',
    rating: 4,
    experiencia: 13,
  },
  {
    id: 12,
    nombre: 'Marta Peñaloza',
    profesion: 'Ingeniera Mecánica',
    pais: '🇨🇱 Chile',
    initials: 'MP',
    color: 'bg-cyan-700',
    skills: ['SolidWorks', 'Termodinámica', 'Manufactura'],
    disponibilidad: 'Busca aprender',
    area: 'Ingeniería',
    rating: 4,
    experiencia: 6,
  },
  {
    id: 13,
    nombre: 'Jesús Contreras',
    profesion: 'Docente Universitario de Matemáticas',
    pais: '🇦🇷 Argentina',
    initials: 'JC',
    color: 'bg-emerald-700',
    skills: ['Cálculo', 'Álgebra Lineal', 'Estadística'],
    disponibilidad: 'Disponible para enseñar',
    area: 'Educación',
    rating: 5,
    experiencia: 14,
  },
  {
    id: 14,
    nombre: 'Luisa Cardona',
    profesion: 'Diseñadora UX/UI',
    pais: '🇲🇽 México',
    initials: 'LC',
    color: 'bg-violet-600',
    skills: ['Figma', 'User Research', 'Diseño de productos'],
    disponibilidad: 'Ambos',
    area: 'Tecnología',
    rating: 4,
    experiencia: 4,
  },
]

const areas = ['Todos', 'Tecnología', 'Salud', 'Derecho', 'Arte', 'Idiomas', 'Negocios', 'Educación', 'Ingeniería']

const availabilityColors: Record<string, string> = {
  'Disponible para enseñar': 'bg-green-100 text-green-800',
  'Busca aprender': 'bg-blue-100 text-[#003DA5]',
  'Ambos': 'bg-purple-100 text-purple-800',
}

export default function TalentosPage() {
  const [search, setSearch] = useState('')
  const [selectedArea, setSelectedArea] = useState('Todos')

  const filtered = talents.filter(t => {
    const matchSearch = search === '' ||
      t.nombre.toLowerCase().includes(search.toLowerCase()) ||
      t.profesion.toLowerCase().includes(search.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      t.pais.toLowerCase().includes(search.toLowerCase())
    const matchArea = selectedArea === 'Todos' || t.area === selectedArea
    return matchSearch && matchArea
  })

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="section-title text-4xl">Directorio de Talentos</h1>
            <p className="section-subtitle max-w-2xl">
              Venezolanos con talento y conocimiento dispuestos a enseñar, aprender y conectar.
              Encuentra expertos de la diáspora o regístrate para compartir tus habilidades.
            </p>
          </div>
          <Link href="/talentos/registro" className="btn-yellow flex-shrink-0">
            + Registrar mi talento
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { label: 'Talentos registrados', value: talents.length.toString(), icon: '⭐' },
            { label: 'Áreas de expertise', value: '8', icon: '🎯' },
            { label: 'Países representados', value: '8', icon: '🌎' },
          ].map((s, i) => (
            <div key={i} className="card px-5 py-3 flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className="font-bold text-xl text-[#003DA5]">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          className="input-field max-w-lg"
          placeholder="Buscar por nombre, habilidad, país..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Area filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {areas.map(area => (
          <button
            key={area}
            onClick={() => setSelectedArea(area)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
              selectedArea === area
                ? 'bg-[#003DA5] text-white border-[#003DA5]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#003DA5] hover:text-[#003DA5]'
            }`}
          >
            {area}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        Mostrando <span className="font-semibold text-gray-900">{filtered.length}</span> talentos
      </p>

      {/* Talent grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(talent => (
          <div key={talent.id} className="card-hover flex flex-col">
            <div className="p-5 flex-1">
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${talent.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{talent.initials}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{talent.nombre}</h3>
                  <p className="text-xs text-gray-500 truncate">{talent.pais}</p>
                </div>
              </div>

              {/* Profession */}
              <p className="text-sm text-gray-700 font-medium mb-1 leading-snug">{talent.profesion}</p>
              <p className="text-xs text-gray-400 mb-3">{talent.experiencia} años de experiencia</p>

              {/* Availability badge */}
              <span className={`badge text-xs mb-3 inline-block ${availabilityColors[talent.disponibilidad]}`}>
                {talent.disponibilidad}
              </span>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-4">
                {talent.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < talent.rating ? 'text-[#FFD200]' : 'text-gray-200'}`}>★</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">{talent.rating}.0</span>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button className="btn-primary w-full text-sm py-2.5">
                Conectar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No se encontraron talentos con esos criterios.</p>
          <p className="text-sm mt-2">Prueba con otra búsqueda o área.</p>
        </div>
      )}

      {/* CTA */}
      <section className="mt-12 bg-gradient-to-r from-[#003DA5] to-[#001e52] rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold mb-3">¿Tienes un talento que compartir?</h3>
          <p className="text-blue-200 mb-6">
            Regístrate en nuestro directorio y conecta con venezolanos que buscan aprender de tu experiencia.
            Comparte tus conocimientos y fortalece la diáspora venezolana.
          </p>
          <Link href="/talentos/registro" className="btn-yellow">
            Registrarme como talento →
          </Link>
        </div>
      </section>
    </div>
  )
}
