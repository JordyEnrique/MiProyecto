'use client'

import { useState } from 'react'

const categories = [
  { id: 'all', label: 'Todo', icon: '🌐' },
  { id: 'knowledge', label: 'Conocimiento', icon: '📚' },
  { id: 'remesas', label: 'Remesas', icon: '💰' },
  { id: 'networking', label: 'Networking', icon: '🤝' },
]

const posts = [
  {
    id: '1',
    category: 'remesas',
    title: 'Guía completa para enviar dinero a Venezuela desde España en 2024',
    content: 'He compilado las mejores opciones para enviar remesas a Venezuela desde España. Las plataformas más confiables, tasas de cambio actualizadas y métodos más seguros...',
    author: 'Carlos M.',
    country: 'España',
    date: '2024-12-10',
    likes: 234,
    comments: 45,
    tags: ['Remesas', 'España', 'Divisas'],
  },
  {
    id: '2',
    category: 'knowledge',
    title: 'Cómo validar mi licencia de conducir venezolana en Colombia',
    content: 'Después de 3 meses de trámites, logré validar mi licencia. Aquí el proceso paso a paso: documentos necesarios, oficinas, costos y tiempos de espera...',
    author: 'Ana P.',
    country: 'Colombia',
    date: '2024-12-08',
    likes: 187,
    comments: 32,
    tags: ['Colombia', 'Documentos', 'Licencia'],
  },
  {
    id: '3',
    category: 'networking',
    title: 'Red de profesionales venezolanos en tecnología - Miami',
    content: 'Iniciamos una red de venezolanos en tecnología en Miami. Somos más de 200 profesionales en empresas como Amazon, Google, startups locales. Reuniones mensuales...',
    author: 'Luis R.',
    country: 'Estados Unidos',
    date: '2024-12-07',
    likes: 312,
    comments: 67,
    tags: ['Miami', 'Tecnología', 'Networking'],
  },
  {
    id: '4',
    category: 'remesas',
    title: 'Comparativa de tasas: Zelle, Binance, Reserve vs plataformas tradicionales',
    content: 'Actualización diciembre 2024. Analicé las tasas reales que reciben los venezolanos en Venezuela vs lo que enviamos. Resultados sorprendentes...',
    author: 'María G.',
    country: 'Estados Unidos',
    date: '2024-12-06',
    likes: 445,
    comments: 89,
    tags: ['Remesas', 'Divisas', 'Finanzas'],
  },
  {
    id: '5',
    category: 'knowledge',
    title: 'Convalidación de título de médico venezolano en España: mi experiencia',
    content: 'Tardé 2 años pero lo logré. Médico venezolano ejerciendo en España. Aquí todo el proceso de homologación, el examen MIR, dónde buscar ayuda y errores que cometí...',
    author: 'Dr. Andrés T.',
    country: 'España',
    date: '2024-12-05',
    likes: 567,
    comments: 123,
    tags: ['España', 'Médicos', 'Convalidación'],
  },
  {
    id: '6',
    category: 'networking',
    title: 'Venezolanos en Berlín - Comunidad activa busca miembros',
    content: 'La comunidad venezolana en Berlín suma más de 1,500 personas. Tenemos grupo de Telegram, eventos mensuales, ayuda para recién llegados y mucho más...',
    author: 'Valentina S.',
    country: 'Alemania',
    date: '2024-12-04',
    likes: 198,
    comments: 41,
    tags: ['Berlín', 'Alemania', 'Comunidad'],
  },
  {
    id: '7',
    category: 'remesas',
    title: 'Criptomonedas para remesas: USDT y USDC, la guía para principiantes',
    content: 'Explicación simple de cómo usar USDT y USDC para enviar dinero a Venezuela. Sin complicaciones técnicas. He enseñado esto a mis padres de 65 años...',
    author: 'Jorge F.',
    country: 'Chile',
    date: '2024-12-03',
    likes: 289,
    comments: 56,
    tags: ['Crypto', 'USDT', 'Remesas'],
  },
  {
    id: '8',
    category: 'knowledge',
    title: 'Obtener la residencia permanente en Canadá como venezolano: paso a paso',
    content: 'Proceso express: desde la visa de trabajo hasta la residencia permanente en Canadá. 18 meses, programa Express Entry, documentación y costos reales...',
    author: 'Patricia L.',
    country: 'Canadá',
    date: '2024-12-01',
    likes: 634,
    comments: 145,
    tags: ['Canadá', 'Residencia', 'Inmigración'],
  },
]

const categoryColors: Record<string, string> = {
  knowledge: 'bg-blue-100 text-blue-700',
  remesas: 'bg-green-100 text-green-700',
  networking: 'bg-purple-100 text-purple-700',
}

const categoryLabels: Record<string, string> = {
  knowledge: '📚 Conocimiento',
  remesas: '💰 Remesas',
  networking: '🤝 Networking',
}

export default function ConexionPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'knowledge' })

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="venezuela-stripe w-24 h-1 mb-4" />
        <h1 className="section-title text-4xl">Conexión con Venezuela</h1>
        <p className="section-subtitle max-w-2xl">
          Comparte tu conocimiento, experiencias y recursos con la comunidad venezolana.
          Juntos sabemos más.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { icon: '📚', label: 'Artículos de conocimiento', count: '2,341' },
          { icon: '💰', label: 'Guías de remesas', count: '456' },
          { icon: '🤝', label: 'Redes de networking', count: '89' },
        ].map((stat, i) => (
          <div key={i} className="card px-5 py-3 flex items-center gap-3">
            <span className="text-xl">{stat.icon}</span>
            <div>
              <div className="font-bold text-lg text-[#003DA5]">{stat.count}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main feed */}
        <div className="lg:col-span-3">
          {/* Category filter + new post */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all border-2 ${
                    activeCategory === cat.id
                      ? 'bg-[#003DA5] text-white border-[#003DA5]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#003DA5] hover:text-[#003DA5]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm py-2"
            >
              + Compartir
            </button>
          </div>

          {/* New post form */}
          {showForm && (
            <div className="card p-6 mb-6 border-2 border-[#003DA5]">
              <h3 className="font-bold text-gray-900 mb-4">Compartir con la comunidad</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-field">Categoría</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="knowledge">📚 Conocimiento</option>
                    <option value="remesas">💰 Remesas</option>
                    <option value="networking">🤝 Networking</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Título</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="input-field"
                    placeholder="Un título descriptivo para tu aporte..."
                  />
                </div>
                <div>
                  <label className="label-field">Contenido</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Comparte tu experiencia, guía o recurso..."
                  />
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary text-sm">Publicar</button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="btn-secondary text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts list */}
          <div className="space-y-5">
            {filtered.map((post) => (
              <div key={post.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge ${categoryColors[post.category]}`}>
                    {categoryLabels[post.category]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug cursor-pointer hover:text-[#003DA5] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{post.author}</span>
                    <span>•</span>
                    <span>🌎 {post.country}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <button className="flex items-center gap-1 hover:text-[#CF142B] transition-colors">
                      <span>❤️</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#003DA5] transition-colors">
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Remittance quick info */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">💰 Tasas del día</h3>
            <div className="space-y-3">
              {[
                { from: 'USD', to: 'VES', rate: '~38.5 Bs/$' },
                { from: 'EUR', to: 'VES', rate: '~41.2 Bs/€' },
                { from: 'COP', to: 'VES', rate: '~0.0095 Bs/COP' },
              ].map((rate, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-600 font-medium">{rate.from} → {rate.to}</span>
                  <span className="font-bold text-green-600">{rate.rate}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Tasas aproximadas. Verifica antes de enviar.</p>
          </div>

          {/* Top contributors */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">⭐ Top colaboradores</h3>
            <div className="space-y-3">
              {[
                { name: 'Dr. Andrés T.', posts: 23, country: 'España' },
                { name: 'Patricia L.', posts: 18, country: 'Canadá' },
                { name: 'Jorge F.', posts: 15, country: 'Chile' },
                { name: 'María G.', posts: 14, country: 'EE.UU.' },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#003DA5] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.posts} aportes · {user.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular tags */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">🏷️ Temas populares</h3>
            <div className="flex flex-wrap gap-2">
              {['Remesas', 'España', 'Colombia', 'Residencia', 'Documentos', 'Crypto', 'Trabajo', 'Salud'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#003DA5] hover:text-white transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
