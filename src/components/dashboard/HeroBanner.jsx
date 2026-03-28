import { useState, useEffect } from 'react'
import { useLang } from '../../contexts/LanguageContext'

const LEVEL_COLORS = {
  'Grand Prix': '#E8B84B',
  'Gold': '#FFD166',
}

export default function HeroBanner({ awards, onSelect }) {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const items = awards.slice(0, 6)

  useEffect(() => {
    if (items.length < 2) return
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), 5000)
    return () => clearInterval(id)
  }, [items.length])

  if (!items.length) return null
  const award = items[idx]

  return (
    <div style={{ position: 'relative', height: '52vh', minHeight: 340, overflow: 'hidden', background: '#0A0A0A' }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, transition: 'opacity 0.8s ease',
        background: award.imageUrl
          ? `linear-gradient(to right, #0A0A0A 35%, rgba(10,10,10,0.5) 65%, transparent 100%), url(${award.imageUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, #1A0F00 0%, #0A0A0A 100%)',
      }} />

      {/* Gradient overlay bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, #0A0A0A, transparent)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', padding: '0 48px' }}>
        <div style={{ maxWidth: 560 }}>
          {/* Badge */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: LEVEL_COLORS[award.level] || '#E8B84B',
              background: 'rgba(232,184,75,0.12)',
              border: `1px solid ${LEVEL_COLORS[award.level] || '#E8B84B'}44`,
              padding: '4px 12px', borderRadius: 20,
            }}>
              {award.competition} · {award.level} · {award.year}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            margin: '0 0 10px', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800,
            color: '#fff', letterSpacing: '-1.5px', lineHeight: 1.1,
          }}>
            {award.title}
          </h1>

          {/* Brand / Agency */}
          <p style={{ margin: '0 0 24px', fontSize: 15, color: '#A0A0A0' }}>
            {award.brand}{award.brand && award.agency ? ' · ' : ''}{award.agency}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => onSelect(award)}
              style={{
                background: '#FF6B2B', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 6, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e85a1a'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF6B2B'}
            >
              ● {t('hero_see')}
            </button>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      {items.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 20, right: 48, zIndex: 3,
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
                background: i === idx ? '#FF6B2B' : '#555',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
