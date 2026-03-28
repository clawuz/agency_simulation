import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import HeroBanner from './HeroBanner'
import CategoryRow from './CategoryRow'
import AwardModal from '../archive/AwardModal'

const ROWS = [
  { id: 'cannes25', title: '🦁 Cannes Lions 2025 — Grand Prix', filter: a => a.competition === 'Cannes Lions' && a.year === 2025 && a.level === 'Grand Prix' },
  { id: 'cannes24', title: '🦁 Cannes Lions 2024 — Grand Prix', filter: a => a.competition === 'Cannes Lions' && a.year === 2024 && a.level === 'Grand Prix' },
  { id: 'felis25', title: '🏆 Felis 2025 — Büyük Ödüller', filter: a => a.competition === 'Felis' && a.year === 2025 },
  { id: 'felis24', title: '🏆 Felis 2024 — Büyük Ödüller', filter: a => a.competition === 'Felis' && a.year === 2024 },
  { id: 'kristal', title: '🍎 Kristal Elma 2024', filter: a => a.competition === 'Kristal Elma' && a.year === 2024 },
  { id: 'effie', title: '📊 Effie Kazananları', filter: a => a.competition === 'Effie' },
  { id: 'turkey', title: '🇹🇷 Türkiye\'den İşler', filter: a => (a.labels || []).includes('Türkiye') || a.agency?.toLowerCase().includes('tribal') || a.agency?.toLowerCase().includes('istanbul') },
]

export default function Dashboard({ onNavigateToArchive }) {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getDocs(query(collection(db, 'awards'), orderBy('year', 'desc')))
      .then(snap => setAwards(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false))
  }, [])

  // Hero: Grand Prix items, most recent first
  const heroAwards = awards.filter(a => a.level === 'Grand Prix').slice(0, 6)

  if (loading) return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 14 }}>
      Yükleniyor...
    </div>
  )

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <HeroBanner awards={heroAwards} onSelect={setSelected} />

      <div style={{ paddingTop: 40, paddingBottom: 60 }}>
        {ROWS.map(row => {
          const rowAwards = awards.filter(row.filter)
          return (
            <CategoryRow
              key={row.id}
              title={row.title}
              awards={rowAwards}
              onCardClick={setSelected}
              onSeeAll={onNavigateToArchive}
            />
          )
        })}
      </div>

      {selected && <AwardModal award={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
