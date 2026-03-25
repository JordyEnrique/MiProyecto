'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const allUsers = [
  { id: 1, nombre: 'Gabriela Soto Mendoza', pais: '🇨🇴 Colombia', profesion: 'Médica', email: 'g.soto@email.com', fecha: '2025-03-24', estado: 'Activo' },
  { id: 2, nombre: 'Andrés Martínez López', pais: '🇪🇸 España', profesion: 'Ingeniero de Software', email: 'a.martinez@email.com', fecha: '2025-03-23', estado: 'Activo' },
  { id: 3, nombre: 'Valentina Díaz Torres', pais: '🇺🇸 EE.UU.', profesion: 'Abogada', email: 'v.diaz@email.com', fecha: '2025-03-23', estado: 'Activo' },
  { id: 4, nombre: 'Carlos Herrera Gómez', pais: '🇨🇱 Chile', profesion: 'Contador', email: 'c.herrera@email.com', fecha: '2025-03-22', estado: 'Activo' },
  { id: 5, nombre: 'María Fernández Rojas', pais: '🇵🇪 Perú', profesion: 'Docente', email: 'm.fernandez@email.com', fecha: '2025-03-22', estado: 'Activo' },
  { id: 6, nombre: 'Luis Ramírez Castillo', pais: '🇦🇷 Argentina', profesion: 'Arquitecto', email: 'l.ramirez@email.com', fecha: '2025-03-21', estado: 'Activo' },
  { id: 7, nombre: 'Patricia González Mora', pais: '🇪🇸 España', profesion: 'Enfermera', email: 'p.gonzalez@email.com', fecha: '2025-03-20', estado: 'Activo' },
  { id: 8, nombre: 'Ricardo Blanco Vargas', pais: '🇲🇽 México', profesion: 'Chef', email: 'r.blanco@email.com', fecha: '2025-03-19', estado: 'Activo' },
  { id: 9, nombre: 'Sofía Álvarez Peña', pais: '🇵🇦 Panamá', profesion: 'Diseñadora Gráfica', email: 's.alvarez@email.com', fecha: '2025-03-18', estado: 'Activo' },
  { id: 10, nombre: 'Jorge Moreno Ríos', pais: '🇨🇴 Colombia', profesion: 'Psicólogo', email: 'j.moreno@email.com', fecha: '2025-03-17', estado: 'Activo' },
  { id: 11, nombre: 'Carmen Rivas Suárez', pais: '🇺🇸 EE.UU.', profesion: 'Economista', email: 'c.rivas@email.com', fecha: '2025-03-16', estado: 'Inactivo' },
  { id: 12, nombre: 'Miguel Ángel Fuentes', pais: '🇨🇱 Chile', profesion: 'Periodista', email: 'm.fuentes@email.com', fecha: '2025-03-15', estado: 'Activo' },
  { id: 13, nombre: 'Laura Vásquez Cruz', pais: '🇪🇸 España', profesion: 'Farmacéutica', email: 'l.vasquez@email.com', fecha: '2025-03-14', estado: 'Activo' },
  { id: 14, nombre: 'Héctor Jiménez Padilla', pais: '🇦🇷 Argentina', profesion: 'Músico', email: 'h.jimenez@email.com', fecha: '2025-03-13', estado: 'Activo' },
  { id: 15, nombre: 'Isabel Núñez Flores', pais: '🇵🇪 Perú', profesion: 'Bióloga', email: 'i.nunez@email.com', fecha: '2025-03-12', estado: 'Activo' },
  { id: 16, nombre: 'Antonio Guerrero Salas', pais: '🇲🇽 México', profesion: 'Administrador', email: 'a.guerrero@email.com', fecha: '2025-03-11', estado: 'Inactivo' },
  { id: 17, nombre: 'Natalia Serrano Leal', pais: '🇨🇴 Colombia', profesion: 'Veterinaria', email: 'n.serrano@email.com', fecha: '2025-03-10', estado: 'Activo' },
  { id: 18, nombre: 'Roberto Silva Mendez', pais: '🇺🇸 EE.UU.', profesion: 'Ingeniero Civil', email: 'r.silva@email.com', fecha: '2025-03-09', estado: 'Activo' },
  { id: 19, nombre: 'Elena Guzmán Torres', pais: '🇪🇸 España', profesion: 'Artista', email: 'e.guzman@email.com', fecha: '2025-03-08', estado: 'Activo' },
  { id: 20, nombre: 'Francisco Ibáñez Ramos', pais: '🇨🇱 Chile', profesion: 'Fotógrafo', email: 'f.ibanez@email.com', fecha: '2025-03-07', estado: 'Activo' },
  { id: 21, nombre: 'Daniela Pinto Medina', pais: '🇵🇦 Panamá', profesion: 'Nutricionista', email: 'd.pinto@email.com', fecha: '2025-03-06', estado: 'Activo' },
  { id: 22, nombre: 'Alejandro Castro Vega', pais: '🇦🇷 Argentina', profesion: 'Ingeniero de Software', email: 'a.castro@email.com', fecha: '2025-03-05', estado: 'Activo' },
]

const countries = ['Todos', 'Colombia', 'España', 'EE.UU.', 'Chile', 'Perú', 'Argentina', 'México', 'Panamá']
const professions = ['Todas', 'Médica', 'Ingeniero de Software', 'Abogada', 'Contador', 'Docente', 'Arquitecto', 'Enfermera']

const adminSidebar = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { href: '/admin/encuestas', label: 'Encuestas', icon: '📋' },
  { href: '/admin/campanas', label: 'Campañas', icon: '✊' },
]

function UsuariosContent() {
  const searchParams = useSearchParams()
  const key = searchParams.get('key')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(key === 'admin2024')
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('Todos')
  const [selectedProfession, setSelectedProfession] = useState('Todas')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'admin2024') {
      setAccessGranted(true)
      setError('')
    } else {
      setError('Clave incorrecta. Intenta de nuevo.')
    }
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso restringido</h1>
          <p className="text-gray-500 text-sm mb-6">Esta sección es solo para administradores de la plataforma.</p>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="label-field">Clave de acceso</label>
              <input
                type="password"
                className="input-field"
                placeholder="Ingresa la clave de administrador"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" className="btn-primary w-full">Acceder al panel</button>
          </form>
        </div>
      </div>
    )
  }

  const filtered = allUsers.filter(u => {
    const matchSearch = search === '' || u.nombre.toLowerCase().includes(search.toLowerCase()) || u.profesion.toLowerCase().includes(search.toLowerCase())
    const matchCountry = selectedCountry === 'Todos' || u.pais.includes(selectedCountry)
    const matchProf = selectedProfession === 'Todas' || u.profesion === selectedProfession
    return matchSearch && matchCountry && matchProf
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-[#003DA5] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">Panel Admin</span>
              </div>
              <nav className="space-y-1">
                {adminSidebar.map(item => (
                  <Link
                    key={item.href}
                    href={`${item.href}?key=admin2024`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.href === '/admin/usuarios'
                        ? 'bg-[#003DA5] text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="venezuela-stripe w-24 h-1 mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Usuarios Registrados</h1>
                  <p className="text-gray-500">{filtered.length} de {allUsers.length} usuarios</p>
                </div>
                <span className="badge badge-blue text-sm px-3 py-1">{allUsers.length} total</span>
              </div>
            </div>

            {/* Filters */}
            <div className="card p-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-field">Buscar usuario</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Nombre o profesión..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label-field">Filtrar por país</label>
                  <select
                    className="input-field"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                  >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Filtrar por profesión</label>
                  <select
                    className="input-field"
                    value={selectedProfession}
                    onChange={e => setSelectedProfession(e.target.value)}
                  >
                    {professions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">País</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Profesión</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registro</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((user, i) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-400 text-xs">{user.id}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{user.nombre}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.pais}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">{user.profesion}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">{user.email}</td>
                        <td className="py-3 px-4 text-gray-400 text-xs">
                          {new Date(user.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge text-xs ${user.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {user.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="font-medium">No se encontraron usuarios con esos filtros.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsuariosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>}>
      <UsuariosContent />
    </Suspense>
  )
}
