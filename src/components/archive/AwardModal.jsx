import { useEffect } from 'react'
import { useLang } from '../../contexts/LanguageContext'

const LEVEL_COLORS = {
  'Grand Prix': '#E8B84B',
  'Gold': '#FFD166',
  'Silver': '#A0A0A0',
  'Bronze': '#CD7F32',
}
const COMP_GRADIENTS = {
  'Cannes Lions': 'linear-gradient(160deg, #2A1500 0%, #111 100%)',
  'Felis': 'linear-gradient(160deg, #12002A 0%, #111 100%)',
  'Kristal Elma': 'linear-gradient(160deg, #002A12 0%, #111 100%)',
  'Effie': 'linear-gradient(160deg, #001830 0%, #111 100%)',
}

function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/]+)/)
  return m ? m[1] : null
}

function getVimeoId(url) {
  if (!url) return null
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

export default function AwardModal({ award, onClose }) {
  const { lang, t } = useLang()

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!award) return null

  const content = award.content?.[lang] || award.content?.tr || {}
  const ytId = getYouTubeId(award.videoUrl)
  const vimeoId = !ytId ? getVimeoId(award.videoUrl) : null
  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`
    : vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}`
    : null

  const sections = [
    { key: 'insight', emoji: '🧠', label: t('detail_insight'), text: content.insight },
    { key: 'idea', emoji: '💡', label: t('detail_idea'), text: content.idea },
    { key: 'execution', emoji: '🎬', label: t('detail_execution'), text: content.execution },
    { key: 'result', emoji: '📊', label: t('detail_result'), text: content.result },
  ].filter(s => s.text)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{
        background: '#111', borderRadius: 16, border: '1px solid #2A2A2A',
        width: '100%', maxWidth: 960, maxHeight: '90vh',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 80px rgba(0,0,0,0.8)',
      }}>
        {/* Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px 0' }}>
          <button onClick={onClose} style={{
            background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#A0A0A0',
            width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FF6B2B'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = '#A0A0A0' }}
          >✕</button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '8px 32px 32px' }}>
          {/* Top section: media + meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, marginBottom: 32 }}>
            {/* Media */}
            <div style={{
              borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9',
              background: award.imageUrl ? '#000' : (COMP_GRADIENTS[award.competition] || '#111'),
            }}>
              {embedUrl ? (
                <iframe src={embedUrl} title={award.title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              ) : award.imageUrl ? (
                <img src={award.imageUrl} alt={award.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                  {award.competition === 'Cannes Lions' ? '🦁' : award.competition === 'Felis' ? '🏆' : award.competition === 'Kristal Elma' ? '🍎' : '📊'}
                </div>
              )}
            </div>

            {/* Meta */}
            <div style={{ paddingTop: 8 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: LEVEL_COLORS[award.level] || '#A0A0A0',
                  background: 'rgba(232,184,75,0.1)', padding: '4px 12px', borderRadius: 20,
                  border: `1px solid ${LEVEL_COLORS[award.level] || '#A0A0A0'}44`,
                }}>
                  {award.competition} · {award.level}
                </span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                {award.title}
              </h2>
              <div style={{ fontSize: 13, color: '#A0A0A0', marginBottom: 4 }}>{award.brand}</div>
              <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>{award.agency}</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>{award.category} · {award.year}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(award.labels || []).map(l => (
                  <span key={l} style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'rgba(255,209,102,0.1)', color: '#FFD166',
                    border: '1px solid rgba(255,209,102,0.25)',
                    padding: '3px 10px', borderRadius: 20,
                  }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Content sections */}
          {sections.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {sections.map((s, i) => (
                <div key={s.key} style={{
                  padding: '20px 0',
                  borderTop: i > 0 ? '1px solid #1E1E1E' : 'none',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{s.emoji}</span>
                    <span style={{ letterSpacing: '0.02em' }}>{s.label}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: '#A0A0A0', lineHeight: 1.75 }}>{s.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
