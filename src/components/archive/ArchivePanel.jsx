import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import { useLang } from '../../contexts/LanguageContext'
import AwardCard from './AwardCard'
import AwardModal from './AwardModal'

const COMPETITIONS = ['Cannes Lions', 'Felis', 'Kristal Elma', 'Effie']
const LEVELS = ['Grand Prix', 'Gold', 'Silver', 'Bronze']
const YEARS = ['2025', '2024', '2023']
const ORIGINS = ['Türkiye', 'Global']

export default function ArchivePanel() {
  const { t } = useLang()
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ competition: [], level: [], year: [], origin: [], label: [] })

  useEffect(() => {
    getDocs(query(collection(db, 'awards'), orderBy('year', 'desc')))
      .then(snap => setAwards(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false))
  }, [])

  // Collect all unique labels from data
  const allLabels = useMemo(() => {
    const set = new Set()
    awards.forEach(a => (a.labels || []).forEach(l => set.add(l)))
    return [...set].sort()
  }, [awards])

  const toggleFilter = (group, val) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group].includes(val) ? prev[group].filter(v => v !== val) : [...prev[group], val],
    }))
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return awards.filter(a => {
      if (q && !a.title?.toLowerCase().includes(q) && !a.brand?.toLowerCase().includes(q) && !a.agency?.toLowerCase().includes(q))
        return false
      if (filters.competition.length && !filters.competition.includes(a.competition)) return false
      if (filters.level.length && !filters.level.includes(a.level)) return false
      if (filters.year.length && !filters.year.includes(String(a.year))) return false
      if (filters.origin.length) {
        const isTR = (a.labels || []).includes('Türkiye') || a.agency?.toLowerCase().includes('tribal') || a.agency?.toLowerCase().includes('istanbul')
        if (filters.origin.includes('Türkiye') && !isTR) return false
        if (filters.origin.includes('Global') && isTR) return false
      }
      if (filters.label.length && !filters.label.some(l => (a.labels || []).includes(l))) return false
      return true
    })
  }, [awards, search, filters])

  const activeCount = Object.values(filters).reduce((s, arr) => s + arr.length, 0)

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '32px' }}>
      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
          {t('archive_title')}
        </h1>
        <p style={{ margin: '6px 0 0', color: '#555', fontSize: 14 }}>
          {filtered.length} {t('archive_results')}
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#555', fontSize: 16 }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('archive_search_placeholder')}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px 14px 44px',
            background: '#111', border: '1px solid #2A2A2A', borderRadius: 10,
            color: '#fff', fontSize: 15, outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#FF6B2B'}
          onBlur={e => e.target.style.borderColor = '#2A2A2A'}
        />
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { key: 'competition', label: t('filter_competition'), options: COMPETITIONS },
          { key: 'level', label: t('filter_level'), options: LEVELS },
          { key: 'year', label: t('filter_year'), options: YEARS },
          { key: 'origin', label: t('filter_origin'), options: ORIGINS },
        ].map(group => (
          <div key={group.key} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 80 }}>
              {group.label}
            </span>
            {group.options.map(opt => {
              const active = filters[group.key].includes(opt)
              return (
                <button key={opt} onClick={() => toggleFilter(group.key, opt)}
                  style={{
                    padding: '5px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    border: `1px solid ${active ? '#FF6B2B' : '#2A2A2A'}`,
                    background: active ? '#FF6B2B' : '#111',
                    color: active ? '#fff' : '#A0A0A0',
                    transition: 'all 0.15s',
                  }}>
                  {opt}
                </button>
              )
            })}
          </div>
        ))}

        {/* Labels row */}
        {allLabels.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 80, paddingTop: 5 }}>
              Etiket
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allLabels.slice(0, 20).map(l => {
                const active = filters.label.includes(l)
                return (
                  <button key={l} onClick={() => toggleFilter('label', l)}
                    style={{
                      padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 11, fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      border: `1px solid ${active ? '#FFD166' : 'rgba(255,209,102,0.2)'}`,
                      background: active ? 'rgba(255,209,102,0.15)' : 'transparent',
                      color: active ? '#FFD166' : '#555',
                      transition: 'all 0.15s',
                    }}>
                    {l}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Clear filters */}
        {activeCount > 0 && (
          <button onClick={() => setFilters({ competition: [], level: [], year: [], origin: [], label: [] })}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid #2A2A2A', color: '#A0A0A0', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            Filtreleri Temizle ({activeCount})
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#555', padding: 60, fontSize: 14 }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', padding: 60, fontSize: 14 }}>{t('archive_no_results')}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {filtered.map(award => (
            <AwardCard key={award.id} award={award} size="lg" onClick={() => setSelected(award)} />
          ))}
        </div>
      )}

      {selected && <AwardModal award={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
