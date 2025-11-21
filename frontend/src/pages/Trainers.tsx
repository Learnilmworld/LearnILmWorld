import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Star,
  Clock,
  User,
  MapPin,
  ChevronDown,
  X,
  Play,
  Heart
} from 'lucide-react'
import axios from 'axios'
import { motion } from 'framer-motion'

/** Trainer types: demoVideo optional */
interface Trainer {
  _id: string
  name?: string
  email?: string
  profile?: {
    bio?: string
    languages?: string[]
    trainerLanguages?: Array<{
      language?: string
      proficiency?: string
      teachingLevel?: string[]
    }>
    experience?: number
    hourlyRate?: number
    avatar?: string
    imageUrl?: string         // <-- primary image field from your schema
    location?: string
    specializations?: string[]
    isAvailable?: boolean
    averageRating?: number
    totalBookings?: number
    demoVideo?: string // optional demo video URL (YouTube or MP4)
  }
  stats?: {
    rating?: number
    totalSessions?: number
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const Trainer: React.FC = () => {
  // ---------- hooks (always declared in same order) ----------
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    language: '',
    minRate: '',
    maxRate: '',
    experience: '',
    specialization: '',
    rating: '',
    sortBy: 'rating'
  })
  // which trainer is currently showing a player (id) — only one at a time
  const [openVideoId, setOpenVideoId] = useState<string | null>(null)

  // local favorites state (UI-only example)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  // ref for video element map (not used for attaching listeners here, but handy)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  // ---------- helpers (pure functions) ----------
  const parseNumber = (val: string | number | undefined, fallback = 0) => {
    if (val === undefined || val === null || val === '') return fallback
    const n = Number(val)
    return Number.isFinite(n) ? n : fallback
  }

  const getRating = useCallback((t: Trainer): number => {
    const s = t?.stats?.rating
    const p = t?.profile?.averageRating
    const rv = typeof s === 'number' && !Number.isNaN(s) ? s : (typeof p === 'number' && !Number.isNaN(p) ? p : 0)
    return rv
  }, [])

  const isYouTube = (url?: string) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be')
  }
  const toYouTubeEmbed = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split(/[?&]/)[0]
        return `https://www.youtube.com/embed/${id}`
      }
      const u = new URL(url)
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      return url
    } catch {
      return url
    }
  }

  // ---------- data fetching ----------
  useEffect(() => {
    let mounted = true
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/trainers`)
        let data = Array.isArray(response.data) ? response.data : []
       
        // Keep only verified trainers
        data = data.filter(trainer => trainer.profile.verificationStatus === 'verified')
        
        if (mounted) setTrainers(data)
      } catch (error) {
        console.error('Failed to fetch trainers:', error)
        if (mounted) setTrainers([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchTrainers()
    return () => { mounted = false }
  }, [])

  // ---------- derived filtered list (stable hooks) ----------
  const filteredTrainers = useMemo(() => {
    try {
      let list = (Array.isArray(trainers) ? trainers.slice() : []).filter(Boolean) as Trainer[]
      const q = (searchTerm || '').trim().toLowerCase()

      if (q) {
        list = list.filter(trainer => {
          if (!trainer) return false
          const name = (trainer.name || '').toLowerCase()
          const bio = (trainer.profile?.bio || '').toLowerCase()
          const languages = Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.map(l => (l || '').toLowerCase()) : []
          const trainerLangs = Array.isArray(trainer.profile?.trainerLanguages) ? trainer.profile!.trainerLanguages!.map(tl => (tl.language || '').toLowerCase()) : []
          const specializations = Array.isArray(trainer.profile?.specializations) ? trainer.profile!.specializations!.map(s => (s || '').toLowerCase()) : []
          return (
            name.includes(q) ||
            bio.includes(q) ||
            languages.some(lang => lang.includes(q)) ||
            trainerLangs.some(lang => lang.includes(q)) ||
            specializations.some(spec => spec.includes(q))
          )
        })
      }

      // Language filter
      if (filters.language && filters.language.trim() !== '') {
        const langQ = filters.language.trim().toLowerCase()
        list = list.filter(trainer => {
          const langs = Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.map(l => (l || '').toLowerCase()) : []
          const tlangs = Array.isArray(trainer.profile?.trainerLanguages) ? trainer.profile!.trainerLanguages!.map(tl => (tl.language || '').toLowerCase()) : []
          return langs.some(l => l.includes(langQ)) || tlangs.some(l => l.includes(langQ))
        })
      }

      // Price range
      if (filters.minRate !== '') {
        const min = parseNumber(filters.minRate, 0)
        list = list.filter(trainer => parseNumber(trainer.profile?.hourlyRate, 0) >= min)
      }
      if (filters.maxRate !== '') {
        const max = parseNumber(filters.maxRate, Infinity)
        list = list.filter(trainer => parseNumber(trainer.profile?.hourlyRate, 0) <= max)
      }

      // Experience filter
      if (filters.experience !== '') {
        const minExp = parseNumber(filters.experience, 0)
        list = list.filter(trainer => parseNumber(trainer.profile?.experience, 0) >= minExp)
      }

      // Specialization filter
      if (filters.specialization && filters.specialization.trim() !== '') {
        const specQ = filters.specialization.trim().toLowerCase()
        list = list.filter(trainer => {
          const specs = Array.isArray(trainer.profile?.specializations) ? trainer.profile!.specializations!.map(s => (s || '').toLowerCase()) : []
          return specs.some(s => s.includes(specQ))
        })
      }

      // Rating filter
      if (filters.rating !== '') {
        const minRating = parseNumber(filters.rating, 0)
        list = list.filter(trainer => getRating(trainer) >= minRating)
      }

      // Sorting
      const sorted = list.slice()
      switch (filters.sortBy) {
        case 'rating':
          sorted.sort((a, b) => getRating(b) - getRating(a))
          break
        case 'price_low':
          sorted.sort((a, b) => parseNumber(a.profile?.hourlyRate, 0) - parseNumber(b.profile?.hourlyRate, 0))
          break
        case 'price_high':
          sorted.sort((a, b) => parseNumber(b.profile?.hourlyRate, 0) - parseNumber(a.profile?.hourlyRate, 0))
          break
        case 'experience':
          sorted.sort((a, b) => parseNumber(b.profile?.experience, 0) - parseNumber(a.profile?.experience, 0))
          break
        default:
          break
      }

      return sorted
    } catch (err) {
      console.error('filtering error', err)
      return []
    }
  }, [trainers, searchTerm, filters, getRating])

  // ---------- stable callbacks ----------
  const clearFilters = useCallback(() => {
    setFilters({
      language: '',
      minRate: '',
      maxRate: '',
      experience: '',
      specialization: '',
      rating: '',
      sortBy: 'rating'
    })
    setSearchTerm('')
  }, [])

  const toggleVideo = useCallback((id: string) => {
    setOpenVideoId(prev => (prev === id ? null : id))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  // ---------- loading UI early return (hooks declared above) ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-pale-top, #f5f7fb)' }}>
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    )
  }

  // ---------- render ----------
  return (
    <div className="min-h-screen bg-pale" style={{ background: `linear-gradient(180deg,var(--bg-pale-top),var(--bg-pale-bottom))` }}>
      {/* Floating decorative orbs (kept) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-28 h-28 rounded-full" style={{ background: 'var(--brand-teal)', opacity: 0.06, animation: 'floaty 6s ease-in-out infinite' }} />
        <div className="absolute top-40 right-12 w-20 h-20 rounded-full" style={{ background: '#9787F3', opacity: 0.06, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 rounded-full" style={{ background: 'var(--accent-orange)', opacity: 0.04, animation: 'floaty 6s ease-in-out infinite', animationDelay: '3.2s' }} />
      </div>

      {/* Header (smaller) */}
      <header className="relative z-10 bg-white bg-opacity-90 backdrop-blur-lg border-b border-white border-opacity-30 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link to="/" className="flex items-center">
              <div className="text-2xl md:text-3xl font-[Good Vibes] font-extrabold tracking-wide relative inline-flex items-center">
    {/* LEARN */}
    <span className="bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent drop-shadow-lg">
      LEARN
    </span>

    {/* Rotating Globe */}
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      className="inline-block mx-1 text-3xl"
    >
      🌎
    </motion.span>

    {/* SPHERE */}
    <span className="bg-gradient-to-r from-black via-gray-800 to-gray-700 bg-clip-text text-transparent drop-shadow-lg">
      SPHERE
    </span>

    {/* Optional subtle shine */}
    <motion.div
      className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full blur-xl pointer-events-none"
      animate={{ x: [-200, 200] }}
      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
    />
  </div>

            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
         {/* Page title (single-line hero) */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 break-keep">
            Find Your Perfect Language Trainer
          </h1>
          {/* Description below the hero line */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with expert language trainers from around the world. Start your journey to fluency today.
          </p>
        </div>

        {/* Search + Filters (moved up) */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl px-0">
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search trainers by name, language, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)] focus:border-[var(--brand-teal)] transition-all duration-200 text-lg"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(s => !s)}
                  className="flex items-center px-4 py-3 bg-[var(--brand-teal)] text-white rounded-xl hover:bg-[var(--brand-teal)]/90 transition-all duration-200 font-semibold"
                  aria-expanded={showFilters}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            {showFilters && (
              // reduced width + removed background for the filters panel
              <div className="mt-4 p-4 rounded-xl animate-slide-down max-w-2xl mx-auto">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Language</label>
                    <input
                      type="text"
                      placeholder="e.g., English, Spanish"
                      value={filters.language}
                      onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Min Price ($/hr)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Max Price ($/hr)</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={filters.maxRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Min Experience (years)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.experience}
                      onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g., Business, Exam Prep"
                      value={filters.specialization}
                      onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]"
                    >
                      <option value="rating">Highest Rated</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="experience">Most Experienced</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button onClick={clearFilters} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600">
            Found <span className="font-bold text-[var(--brand-teal)]">{filteredTrainers.length}</span> trainers
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrainers.map((trainer, index) => {
            const id = trainer._id || `trainer-${index}`

            // PREFER imageUrl (primary) then avatar - uses your schema's imageUrl field.
            const avatar = trainer.profile?.imageUrl || trainer.profile?.avatar || ''

            const rating = getRating(trainer) || 0
            const reviews = parseNumber(trainer.profile?.totalBookings, 0)

            // languages fallback
            const languagesList = (Array.isArray(trainer.profile?.trainerLanguages) && trainer.profile!.trainerLanguages!.length > 0)
              ? trainer.profile!.trainerLanguages!.slice(0, 3).map(tl => tl.language || '')
              : (Array.isArray(trainer.profile?.languages) ? trainer.profile!.languages!.slice(0, 3) : [])

            const demoUrl = trainer.profile?.demoVideo
            const showingVideo = openVideoId === id && !!demoUrl

            return (
              <article
                key={id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:scale-105 ring-1 ring-gray-50 flex flex-col"
                style={{ minHeight: 360 }}
              >
                {/* Demo video / poster (stays at top) */}
                {demoUrl ? (
                  <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100">
                    {!showingVideo ? (
                      <>
                        <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                          {avatar ? (
                            <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover brightness-80" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                        </div>

                        <button
                          onClick={() => toggleVideo(id)}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label="Play demo"
                        >
                          <div className="bg-white/95 hover:bg-white p-3 rounded-full shadow-2xl flex items-center justify-center border border-white">
                            <Play className="h-6 w-6 text-[var(--brand-teal)]" />
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-44 bg-black">
                          {isYouTube(demoUrl) ? (
                            <iframe
                              title={`demo-${id}`}
                              src={`${toYouTubeEmbed(demoUrl)}?autoplay=0&rel=0`}
                              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                              className="w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              ref={el => { videoRefs.current[id] = el }}
                              src={demoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => setOpenVideoId(null)}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1 shadow"
                          aria-label="Close video"
                        >
                          <X className="h-4 w-4 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-4 w-full h-44 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {avatar ? (
                      <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                )}

                {/* Trainer details (price moved up) */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[var(--brand-teal)] rounded-lg flex items-center justify-center mr-3 overflow-hidden flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{trainer.name || 'Unnamed Trainer'}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1 gap-3">
                        <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-sm">
                          <Star className="h-4 w-4" />
                          <span className="font-medium">{rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">({reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE: only shown up here */}
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1 bg-[var(--brand-teal)] text-white rounded-full font-semibold">${parseNumber(trainer.profile?.hourlyRate, 25)}/hr</div>
                  </div>
                </div>

                {/* languages */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {languagesList.map((language, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {language || '—'}
                    </span>
                  ))}
                </div>

                {/* bio (moved below filters per request; kept short) */}
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons.'}
                </p>

                {/* stats */}
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[var(--brand-teal)]" />
                    <span>{parseNumber(trainer.profile?.experience, 5)}+ years</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[var(--brand-teal)]" />
                    <span>{trainer.profile?.location || 'Online'}</span>
                  </div>
                </div>

                {/* Bottom CTAs: only heart, View Profile, Book Now */}
                <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleFavorite(id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${favorites[id] ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    aria-pressed={!!favorites[id]}
                    aria-label={favorites[id] ? 'Unfavorite' : 'Add to favorites'}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Favorite</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <Link to={`/register`} className="px-3 py-2 bg-[var(--brand-teal)] text-white rounded-md text-sm hover:brightness-95 transition">Sign in to book</Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* no results */}
        {filteredTrainers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No trainers found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search criteria or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Trainer

// import React, { useState } from 'react'
// import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import { Mail, Lock, User, Eye, EyeOff, ArrowRight, GraduationCap, BookOpen } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'
// import '../theme.css'

// import 'react-phone-input-2/lib/style.css'
// import 'flag-icons/css/flag-icons.min.css'
// import PhoneInput from 'react-phone-input-2'

// // For TypeScript type safety
// interface Certificate {
//   name: string
//   issuer: string
//   certificateLink: string
//   issuedDate: string
//   certificateImage?: File | string
// }

// interface RegisterFormData {
//   name: string
//   email: string
//   password: string
//   confirmPassword: string
//   role: 'student' | 'trainer'
//   education: string
//   experience: string
//   certificates: Certificate[]
//   dob: string
//   bio: string
//   resume: File | string | null // can be file or URL
//   phone: string
//   languages?: string
//   subjects?: string
//   standards?: string
//   customStandardRange?: string
//   nationalityCode?: string
// }


// const Register: React.FC = () => {
//   const navigate = useNavigate()
//   const { register } = useAuth()
//   const [searchParams] = useSearchParams()
//   const defaultRole = (searchParams.get('role') || 'student') as string

//   const [formData, setFormData] = useState<RegisterFormData>({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: defaultRole as 'student' | 'trainer',
//     education: '',
//     certificates: [],
//     experience: '',
//     dob: '',
//     bio: '',
//     resume: null,
//     phone: '',
//     subjects: '',
//     languages: '',
//     standards: '',
//     customStandardRange: '',
//     nationalityCode: '',
//   })

//   const showStandards = formData.role === "trainer" && formData.subjects?.trim() !== "";


//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//       setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
//     }


//   const addCertificate = (certificate: Certificate) => {
//     setFormData(prev => ({
//       ...prev,
//       certificates: [...(prev.certificates || []), certificate],
//     }))
//   }



//   const removeCertificate = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       certificates: prev.certificates.filter((_, i) => i !== index),
//     }))
//   }

//   const handleCertificateChange = (index: number, field: string, value: string) => {
//     const newCerts = [...formData.certificates]
//     newCerts[index][field as keyof typeof newCerts[0]] = value
//     setFormData(prev => ({ ...prev, certificates: newCerts }))
//   }

//   // Simple validation function
//   const validatePhoneNumber = (phone: string) => {
//     const cleanedPhone = phone.replace(/\s|-/g, ''); // remove spaces & dashes
//     const phoneRegex = /^[0-9]{10,15}$/; // allows only digits, between 10 and 15
//     return phoneRegex.test(cleanedPhone);
//   };

//   // Calculate max allowed DOB (user must be 18+)
//   const today = new Date()
//   const maxDOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
//   const maxDOBString = maxDOB.toISOString().split('T')[0] // yyyy-mm-dd


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match')
//       setLoading(false)
//       return
//     }
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long')
//       setLoading(false)
//       return
//     }

//     // Trainer age validation , Phone Validation, 
//     if (formData.role === 'trainer') {
//       const dob = new Date(formData.dob)
//       const age = today.getFullYear() - dob.getFullYear()
//       const hasBirthdayPassed =
//         today.getMonth() > dob.getMonth() ||
//         (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate())

//       const actualAge = hasBirthdayPassed ? age : age - 1

//       if (actualAge < 18) {
//         setError('Trainer must be at least 18 years old.')
//         setLoading(false)
//         return
//       }

      
//       if (!validatePhoneNumber(formData.phone)) {
//         setError("Please enter a valid phone number (10–15 digits).");
//         return;
//       }

//       //  Subjects and lang validation
//       const hasSubjects = formData.subjects?.trim() !== '';
//       const hasLanguages = formData.languages?.trim() !== '';

//       if (!hasSubjects && !hasLanguages) {
//         setError('Please enter at least one of: Subjects or Languages.');
//         setLoading(false);
//         return;
//       }

//       if (formData.subjects?.trim() !== "" && !formData.standards) {
//         setError("Please select the standards you can teach.");
//         setLoading(false);
//         return;
//       }


//       if (formData.standards === 'Others' && !formData.customStandardRange?.trim()) {
//         setError('Please specify your custom standard range.');
//         setLoading(false);
//         return;
//       }

//     }

//     const experienceYears = parseInt(formData.experience) || 0;
//     // Ensure every certificateImage is a string before sending
//     const sanitizedCertificates = (formData.certificates || []).map(cert => ({
//       ...cert,
//       certificateImage:
//         typeof cert.certificateImage === 'string'
//           ? cert.certificateImage
//           : '', // convert {} -> ''
//     }))


//     // Convert resume to base64 if it's a File
//     let resumeData = ''
//     if (formData.resume instanceof File) {
//       resumeData = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = () => resolve(reader.result as string)
//         reader.onerror = error => reject(error)
//         reader.readAsDataURL(formData.resume as Blob) // converts file to base64
//       })
//     } else if (typeof formData.resume === 'string') {
//       resumeData = formData.resume
//     }


//   const result = await register({
//     name: formData.name,
//     email: formData.email,
//     password: formData.password,
//     role: formData.role,
//     profile: {
//       phone: formData.phone,
//       ...(formData.role === 'trainer' && {
//         education: formData.education,
//         teachingExperienceDetails: formData.experience,
//         experience: experienceYears,
//         certifications: sanitizedCertificates,
//         dob: formData.dob,
//         bio: formData.bio,
//         nationalityCode: formData.nationalityCode,
//         resume: resumeData,
//         subjects: formData.subjects?.split(',').map(s => s.trim()).filter(Boolean),
//         languages: formData.languages?.split(',').map(l => l.trim()).filter(Boolean),
//         standards:
//           formData.standards === 'Others'
//             ? formData.customStandardRange
//             : formData.standards,
//       }),
//     },
//   })


//   // console.log('Submitting register data:', JSON.stringify({
//   //   ...formData,
//   //   certificates: sanitizedCertificates
//   // }, null, 2))



//     if (result?.success) {
//     if (formData.role === 'student') {
//       navigate('/student')
//     } else if (formData.role === 'trainer') {
//       setError(
//       'Your registration has been received! An admin will review and verify your details before you can log in.'
//     )
//       setTimeout(() => navigate('/login'), 3000) // redirect them back to login instead of trainer dashboard
//     }
//   } else {
//     setError(result?.error || 'Registration failed')
//   }
//     setLoading(false)
//   }

//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 transition-all duration-700 ${
//       formData.role === 'trainer' ? 'bg-[#2D274B]' : 'bg-[#dc8d33]'
//     }`}
//       // style={{
//       //   background: `linear-gradient(180deg, #F5F3FF, #EAEFFE)`,
//       // }}
//     >
//       {/* Decorative orbs */}
//       <div className="fixed inset-0 pointer-events-none">
//         <div
//           className="absolute top-20 left-10 w-32 h-32 rounded-full"
//           style={{
//             background: '#fff7e1',
//             opacity: 0.16,
//             animation: 'floaty 6s ease-in-out infinite',
//           }}
//         />
//         <div
//           className="absolute top-44 right-20 w-24 h-24 rounded-full"
//           style={{
//             background: '#fff7e1',
//             opacity: 0.26,
//             animation: 'floaty 6s ease-in-out infinite',
//             animationDelay: '1.8s',
//           }}
//         />
//         <div
//           className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full"
//           style={{
//             background: '#fff7e1',
//             opacity: 0.14,
//             animation: 'floaty 6s ease-in-out infinite',
//             animationDelay: '3.2s',
//           }}
//         />
//         <div
//           className="absolute bottom-44 right-44 w-40 h-40 rounded-full"
//           style={{
//             background: '#fff7e1',
//             opacity: 0.14,
//             animation: 'floaty 6s ease-in-out infinite',
//             animationDelay: '1.8s',
//           }}
//         />
//       </div>

//       {/*Changing css for main card here  */}
//       <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 p-4 sm:p-8">
//         <div className="text-center mb-8">
//           {/* change css for text */}
//           <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold  mb-2 text-center ${
//             formData.role === 'trainer' ? 'text-[#dc8d33]' : 'text-[#2D274B]'
//           }`}>
//             Join LearniLM 🌎 World
//           </h1>
//           <p className=
//           {`text-xl font-bold sm:text-base md:text-xl 
//            ${
//             formData.role === 'trainer' ? 'text-[#dc8d33]' : 'text-[#2D274B]'
//           }`}>
//             Start your Learning Journey today
//           </p>
//         </div>

//         <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur">
//           {error && (
//             <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
//               <div className="flex items-center gap-2">
//                 ⚠️ <span>{error}</span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-base font-bold  text-[#2D274B] mb-3">
//                 I want to join as :
//               </label>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <label
//                   className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition bg-gray-100 ${
//                     formData.role === 'student'
//                       ? 'border-[#9787F3] bg-[rgba(151,135,243,0.06)]'
//                       : 'border-gray-200 hover:border-[#9787F3]'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="role"
//                     value="student"
//                     checked={formData.role === 'student'}
//                     onChange={handleChange}
//                     className="sr-only"
//                   />
//                   <BookOpen className="h-6 w-6 text-[#9787F3] mr-3" />
//                   <div>
//                     <div className="font-semibold text-[#2D274B]">Student</div>
//                     <div className="text-sm font-bold text-[#4B437C]">Start your learning journey</div>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition bg-gray-100 ${
//                     formData.role === 'trainer'
//                       ? 'border-[#9787F3] bg-[rgba(151,135,243,0.06)]'
//                       : 'border-gray-200 hover: hover:border-[#9787F3]'
//                   }`}
//                 >
//                   {/* Trainer form */}
//                   <input
//                     type="radio"
//                     name="role"
//                     value="trainer"
//                     checked={formData.role === 'trainer'}
//                     onChange={handleChange}
//                     className="sr-only"
//                   />
//                   <GraduationCap className="h-6 w-6 text-[#9787F3] mr-3" />
//                   <div>
//                     <div className="font-semibold text-[#2D274B]">Trainer</div>
//                     <div className="text-sm font-bold text-[#4B437C]">Be a Teacher </div>
//                   </div>
//                 </label>
//               </div>
//             </div>
//             {/* name */}
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-semibold text-[#2D274B] mb-2"
//               >
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   placeholder="Enter your full name"
//                 />
//               </div>
//             </div>
//             {/* email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-semibold text-[#2D274B] mb-2"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>
//             {/* passowrd */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-semibold text-[#2D274B] mb-2"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   placeholder="Create a password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(s => !s)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] hover:text-[#4B437C]"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>
//             {/* confirm password */}
//             <div>
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-sm font-semibold text-[#2D274B] mb-2"
//               >
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] h-5 w-5" />
//                 <input
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   placeholder="Confirm your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(s => !s)}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] hover:text-[#4B437C]"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="h-5 w-5" />
//                   ) : (
//                     <Eye className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Phone Number + nationality  code */}
//             <div>
//               <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                 Phone Number
//               </label>
//               <div className="w-full">
//                 <PhoneInput
//                   country={'in'} // default country code
//                   value={formData.phone}
//                   onChange={(phone, countryData) =>
//                     setFormData(prev => ({
//                       ...prev, phone, nationalityCode: (countryData as any)?.iso2?.toUpperCase() || ''
//                     }))
//                   }
//                   inputStyle={{
//                     width: '100%',
//                     borderRadius: '0.75rem',
//                     border: '2px solid #e5e7eb',
//                     padding: '12px 14px 12px 52px',
//                     fontSize: '16px',
//                   }}
//                   buttonStyle={{
//                     border: 'none',
//                     backgroundColor: 'transparent',
//                   }}
//                   dropdownStyle={{ maxHeight: '200px' }}
//                   enableSearch={true}
//                 />
//               </div>
//             </div>


//             {formData.role === 'trainer' && (
//               <>
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Education
//                   </label>
//                   <input
//                     type="text"
//                     name="education"
//                     value={formData.education}
//                     onChange={handleChange}
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                     placeholder="Enter your education"
//                   />
//                 </div>


//                  {/* Phone Number */}
//                 {/* <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Phone Number
//                   </label>
//                   <div className="w-full">
//                     <PhoneInput
//                       country={'in'} // default country code
//                       value={formData.phone}
//                       onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
//                       inputStyle={{
//                         width: '100%',
//                         borderRadius: '0.75rem',
//                         border: '2px solid #e5e7eb',
//                         padding: '12px 14px 12px 52px',
//                         fontSize: '16px',
//                       }}
//                       buttonStyle={{
//                         border: 'none',
//                         backgroundColor: 'transparent',
//                       }}
//                       dropdownStyle={{ maxHeight: '200px' }}
//                       enableSearch={true}
//                     />
//                     </div>
//                 </div> */}

//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Teaching Experience
//                   </label>
//                   <input
//                     type="text"
//                     name="experience"
//                     value={formData.experience}
//                     onChange={handleChange}
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                     placeholder="E.g., 5 years teaching English"
//                   />
//                 </div>

//                 {/* Subjects Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Subjects You Can Teach
//                   </label>
//                   <input
//                     type="text"
//                     name="subjects"
//                     value={formData.subjects}
//                     onChange={handleChange}
//                     placeholder="e.g., Math, Science, English"
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">You may leave this empty if you select languages below.</p>
//                 </div>

//                 {/* Languages Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Languages You Can Teach In
//                   </label>
//                   <input
//                     type="text"
//                     name="languages"
//                     value={formData.languages}
//                     onChange={handleChange}
//                     placeholder="e.g., English, Hindi, Urdu"
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">You must fill at least one of: Subjects or Languages.</p>
//                 </div>

//                 {/* Standards Field, only shown when subject field is used*/}
//                 {showStandards && (
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Standards You Can Teach <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex flex-wrap gap-4">
//                     {['5-8', '5-10', '5-12', 'Others'].map(option => (
//                       <label key={option} className="flex items-center gap-2 text-[#2D274B] font-medium">
//                         <input
//                           type="radio"
//                           name="standards"
//                           value={option}
//                           checked={formData.standards === option}
//                           onChange={handleChange}
//                           required
//                         />
//                         {option}
//                       </label>
//                     ))}
//                   </div>

//                   {/* Show custom range input when "Others" is selected */}
//                   {formData.standards === 'Others' && (
//                     <input
//                       type="text"
//                       name="customStandardRange"
//                       value={formData.customStandardRange}
//                       onChange={handleChange}
//                       placeholder="Specify range (e.g., 3-9)"
//                       className="mt-3 w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                     />
//                   )}
//                 </div>
//                 )}


//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                     max={maxDOBString}
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                 </div>

//                 {/* Bio / Description */}
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Short Bio / Pitch
//                   </label>
//                   <textarea
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleChange}
//                     rows={3}
//                     placeholder="Describe your teaching style, experience, or motivation..."
//                     className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                 </div>

//                 {/* Resume upload */}
//                 <div>
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Resume (PDF or link)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) setFormData(prev => ({ ...prev, resume: file }));
//                     }}
//                     className="w-full pl-4 pr-4 py-2 border-2 border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                   <p className="text-sm text-[#6B64A1] mt-1">Or paste a link instead:</p>
//                   <input
//                     type="text"
//                     placeholder="https://example.com/myresume.pdf"
//                     onChange={e => setFormData(prev => ({ ...prev, resume: e.target.value }))}
//                     className="w-full pl-4 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
//                   />
//                 </div>
//                 {/* Certificate section */}
//                 <div className="space-y-3 ">
//                   <label className="block text-sm font-semibold text-[#2D274B] mb-2">
//                     Certificates
//                   </label>
//                   {formData.certificates.map((cert, index) => (
//                     <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-xl mb-6">
//                       <input
//                         type="text"
//                         placeholder="Certificate Name"
//                         value={cert.name}
//                         onChange={e => handleCertificateChange(index, 'name', e.target.value)}
//                         className="pl-2 py-2 border rounded-xl"
//                       />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={e => {
//                             const file = e.target.files?.[0];
//                             if (file) {
//                               const reader = new FileReader();
//                               reader.onloadend = () => {
//                                 const dataUrl = reader.result as string;
//                                 const newCerts = [...formData.certificates];
//                                 newCerts[index].certificateImage = dataUrl; // store Base64 string
//                                 setFormData(prev => ({ ...prev, certificates: newCerts }));
//                               };
//                               reader.readAsDataURL(file);
//                             }
//                           }}
//                           className="pl-2 py-2 border rounded-xl"
//                         />


//                        <input
//                         type="text"
//                         placeholder="Issued By (Issuer Name)"
//                         value={cert.issuer}
//                         onChange={e => handleCertificateChange(index, 'issuer', e.target.value)}
//                         className="pl-2 py-2 border rounded-xl"
//                       />
//                       <input
//                         type="text"
//                         placeholder="Certificate Link"
//                         value={cert.certificateLink}
//                         onChange={e => handleCertificateChange(index, 'certificateLink', e.target.value)}
//                         className="pl-2 py-2 border rounded-xl"
//                       />
//                       <input
//                         type="date"
//                         value={cert.issuedDate}
//                         onChange={e => handleCertificateChange(index, 'issuedDate', e.target.value)}
//                         className="pl-2 py-2 border rounded-xl"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeCertificate(index)}
//                           className="mt-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200"
//                           style={{
//                             backgroundColor: 'rgba(255, 0, 0, 0.08)', // soft red tint background
//                             color: '#E74C3C', // vibrant red text
//                             }}
//                             onMouseEnter={e => ((e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 0, 0, 0.15)')}
//                             onMouseLeave={e => ((e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 0, 0, 0.08)')}
//                           >
//                         Remove
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addCertificate({ name: '',
//                     issuer: '', certificateLink: '', issuedDate: '',certificateImage: '', })}
//                     className="font-semibold mt-2"
//                     style={{ color: '#9787F3' }}

//                   >
//                     + Add Certificate
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* submit button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex items-center justify-center text-base sm:text-lg py-3 rounded-xl font-semibold text-[#2D274B] hover:opacity-90 transition ${
//                 loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//               style={{
//                 backgroundColor: formData.role === 'trainer' ? '#CBE56A' : '#CBE56A',
//                 color: formData.role === 'trainer' ? '#2D274B' : '#2D274B',
//               }}
//             >
//               {/* style={{
//                 backgroundColor: formData.role === 'trainer' ? '#2D274B' : '#CBE56A',
//                 color: formData.role === 'trainer' ? '#dc8d33' : '#2D274B',
//               }} this was the color of the button */}
//               {loading ? (
//                 <div className="loading-dots">
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                   <div></div>
//                 </div>
//               ) : (
//                 <>
//                   Create Account <ArrowRight className="ml-2 h-5 w-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* sign in button */}
//           <div className="mt-8 text-center">
//             <p className="text-[#4B437C] font-bold">
//               Already have an account?{' '}
//               <Link
//                 to="/login"
//                 className="font-bold hover:underline"
//                 style={{ color: '#9787F3' }}
//               >
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register
