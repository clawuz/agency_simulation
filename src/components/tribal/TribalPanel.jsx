import { useState, useEffect, useMemo } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import AwardCard from '../archive/AwardCard'
import AwardModal from '../archive/AwardModal'
import { useLang } from '../../contexts/LanguageContext'

const LEVEL_ORDER = { 'Grand Prix': 0, 'Kristal': 1, 'Gold': 2, 'Silver': 3, 'Bronze': 4, 'Başarı Ödülü': 5, 'Shortlist': 6 }
const LEVEL_COLORS = {
  'Grand Prix': '#E8B84B',
  'Kristal': '#FF6B2B',
  'Gold': '#FFD166',
  'Silver': '#A0A0A0',
  'Bronze': '#CD7F32',
  'Başarı Ödülü': '#555',
  'Shortlist': '#444',
}

const COMP_ICONS = {
  'Kristal Elma': '🍎',
  'Mediacat Felis Ödülleri': '🏆',
  'Cannes Lions': '🦁',
  'Effie Awards': '📊',
  'Curious Felis': '🐱',
  'Kırmızı Reklam Ödülleri': '🔴',
  'Epica Awards': '🌍',
  'Golden Drum': '🥁',
  'Clio Awards': '🎯',
  'Eurobest': '🇪🇺',
  'New York Festivals': '🗽',
  'Brandverse Awards': '💡',
}

export default function TribalPanel() {
  const { lang } = useLang()
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [yearFilter, setYearFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [view, setView] = useState('grid') // 'grid' | 'table'

  useEffect(() => {
    getDocs(query(collection(db, 'awards'), where('tribal', '==', true), orderBy('year', 'desc')))
      .then(snap => setAwards(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false))
  }, [])

  const years = useMemo(() => [...new Set(awards.map(a => String(a.year)))].sort((a, b) => b - a), [awards])

  const filtered = useMemo(() => {
    return awards
      .filter(a => yearFilter === 'all' || String(a.year) === yearFilter)
      .filter(a => levelFilter === 'all' || a.level === levelFilter)
      .sort((a, b) => {
        const lo = LEVEL_ORDER[a.level] ?? 9
        const lb = LEVEL_ORDER[b.level] ?? 9
        if (lo !== lb) return lo - lb
        return b.year - a.year
      })
  }, [awards, yearFilter, levelFilter])

  const grandPrix = awards.filter(a => a.level === 'Grand Prix')
  const stats = {
    total: awards.length,
    gp: grandPrix.length,
    kristal: awards.filter(a => a.level === 'Kristal').length,
    gold: awards.filter(a => a.level === 'Gold').length,
  }

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 14 }}>
      Yükleniyor...
    </div>
  )

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '40px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
            Tribal <span style={{ color: '#FF6B2B' }}>Ödülleri</span>
          </h1>
        </div>
        <p style={{ margin: 0, color: '#555', fontSize: 14 }}>
          Tribal Worldwide Istanbul'un 2010'dan bugüne ödüllü işleri
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Toplam Ödüllü İş', value: stats.total, color: '#FF6B2B' },
          { label: 'Grand Prix', value: stats.gp, color: '#E8B84B' },
          { label: 'Kristal', value: stats.kristal, color: '#FF6B2B' },
          { label: 'Altın', value: stats.gold, color: '#FFD166' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#111', border: '1px solid #1E1E1E', borderRadius: 12,
            padding: '20px 24px',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grand Prix showcase */}
      {grandPrix.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: '#E8B84B', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🥇</span> Grand Prix Kazananlar
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {grandPrix.map(award => (
              <AwardCard key={award.id} award={award} size="lg" onClick={() => setSelected(award)} />
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: '#1E1E1E', marginBottom: 40 }} />

      {/* Filters + view toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Year filter */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Yıl</span>
            {['all', ...years].map(y => (
              <button key={y} onClick={() => setYearFilter(y)}
                style={{
                  padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1px solid ${yearFilter === y ? '#FF6B2B' : '#2A2A2A'}`,
                  background: yearFilter === y ? '#FF6B2B' : '#111',
                  color: yearFilter === y ? '#fff' : '#A0A0A0',
                  transition: 'all 0.15s',
                }}>
                {y === 'all' ? 'Tümü' : y}
              </button>
            ))}
          </div>
          {/* Level filter */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Seviye</span>
            {['all', 'Grand Prix', 'Kristal', 'Gold', 'Silver', 'Bronze'].map(l => (
              <button key={l} onClick={() => setLevelFilter(l)}
                style={{
                  padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1px solid ${levelFilter === l ? (LEVEL_COLORS[l] || '#FF6B2B') : '#2A2A2A'}`,
                  background: levelFilter === l ? (LEVEL_COLORS[l] || '#FF6B2B') : '#111',
                  color: levelFilter === l ? (l === 'Silver' || l === 'all' ? '#000' : '#fff') : '#A0A0A0',
                  transition: 'all 0.15s',
                }}>
                {l === 'all' ? 'Tümü' : l}
              </button>
            ))}
          </div>
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', background: '#111', border: '1px solid #2A2A2A', borderRadius: 6, overflow: 'hidden' }}>
          {[['grid', '⊞'], ['table', '≡']].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 14,
              background: view === v ? '#FF6B2B' : 'transparent',
              color: view === v ? '#fff' : '#A0A0A0',
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p style={{ margin: '0 0 20px', color: '#555', fontSize: 13 }}>{filtered.length} iş</p>

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {filtered.map(award => (
            <AwardCard key={award.id} award={award} size="lg" onClick={() => setSelected(award)} />
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div style={{ background: '#111', borderRadius: 12, border: '1px solid #1E1E1E', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1E1E1E' }}>
                {['Yıl', 'Yarışma', 'Seviye', 'Proje', 'Marka', 'Kategori'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((award, i) => (
                <tr key={award.id}
                  onClick={() => setSelected(award)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #1A1A1A' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1A1A1A'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', color: '#555', fontWeight: 600 }}>{award.year}</td>
                  <td style={{ padding: '12px 16px', color: '#A0A0A0' }}>
                    {COMP_ICONS[award.competition] || '🏆'} {award.competition}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                      color: LEVEL_COLORS[award.level] || '#A0A0A0',
                      background: `${LEVEL_COLORS[award.level]}18` || 'transparent',
                      padding: '2px 8px', borderRadius: 20,
                      border: `1px solid ${LEVEL_COLORS[award.level]}33`,
                    }}>
                      {award.level}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 600, maxWidth: 220 }}>
                    <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {award.title}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#A0A0A0' }}>{award.brand}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{award.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <AwardModal award={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
