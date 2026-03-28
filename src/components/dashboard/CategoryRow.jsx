import { useRef } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import AwardCard from '../archive/AwardCard'

export default function CategoryRow({ title, awards, onCardClick, onSeeAll }) {
  const { t } = useLang()
  const scrollRef = useRef(null)
  if (!awards || awards.length === 0) return null

  const scroll = dir => {
    scrollRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  }

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Row header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} style={{
            background: 'transparent', border: 'none', color: '#FF6B2B',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '4px 0',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#E8B84B'}
            onMouseLeave={e => e.currentTarget.style.color = '#FF6B2B'}
          >
            {t('archive_see_all')} →
          </button>
        )}
      </div>

      {/* Scroll area with arrows */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => scroll(-1)}
          style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(17,17,17,0.9)', border: '1px solid #2A2A2A',
            color: '#fff', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>◀</button>

        <div
          ref={scrollRef}
          style={{
            display: 'flex', gap: 16, padding: '4px 32px 12px',
            overflowX: 'auto', scrollbarWidth: 'none',
          }}
        >
          {awards.map(award => (
            <AwardCard key={award.id} award={award} onClick={() => onCardClick(award)} />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            zIndex: 2, width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(17,17,17,0.9)', border: '1px solid #2A2A2A',
            color: '#fff', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>▶</button>
      </div>
    </div>
  )
}
