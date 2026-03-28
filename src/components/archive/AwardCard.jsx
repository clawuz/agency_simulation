const COMP_GRADIENTS = {
  'Cannes Lions': 'linear-gradient(160deg, #1A0A00 0%, #0A0A0A 100%)',
  'Felis': 'linear-gradient(160deg, #0A001A 0%, #0A0A0A 100%)',
  'Kristal Elma': 'linear-gradient(160deg, #001A0A 0%, #0A0A0A 100%)',
  'Effie': 'linear-gradient(160deg, #001020 0%, #0A0A0A 100%)',
}
const LEVEL_COLORS = {
  'Grand Prix': '#E8B84B',
  'Gold': '#FFD166',
  'Silver': '#A0A0A0',
  'Bronze': '#CD7F32',
}

export default function AwardCard({ award, onClick, size = 'sm' }) {
  const w = size === 'lg' ? 280 : 220
  const imgH = size === 'lg' ? 157 : 124

  return (
    <div
      onClick={onClick}
      style={{
        width: w, minWidth: w, borderRadius: 10, overflow: 'hidden',
        background: '#111', border: '1px solid #1E1E1E', cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.04)'
        e.currentTarget.style.boxShadow = '0 0 30px rgba(255,107,43,0.2)'
        e.currentTarget.style.borderColor = '#FF6B2B'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#1E1E1E'
      }}
    >
      {/* Visual */}
      <div style={{
        height: imgH, position: 'relative', overflow: 'hidden',
        background: award.imageUrl ? '#000' : (COMP_GRADIENTS[award.competition] || COMP_GRADIENTS['Cannes Lions']),
      }}>
        {award.imageUrl ? (
          <img src={award.imageUrl} alt={award.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            {award.competition === 'Cannes Lions' ? '🦁' : award.competition === 'Felis' ? '🏆' : award.competition === 'Kristal Elma' ? '🍎' : '📊'}
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: LEVEL_COLORS[award.level] || '#A0A0A0',
          }}>
            {award.level}
          </span>
          <span style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>{award.year}</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.35,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          marginBottom: 4,
        }}>
          {award.title}
        </div>
        <div style={{ fontSize: 11, color: '#A0A0A0', marginBottom: 7 }}>
          {award.brand}{award.brand && award.agency ? ' · ' : ''}{award.agency}
        </div>
        {/* Labels */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {(award.labels || []).slice(0, 2).map(l => (
            <span key={l} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'rgba(255,209,102,0.12)', color: '#FFD166',
              border: '1px solid rgba(255,209,102,0.25)',
              padding: '2px 8px', borderRadius: 20,
            }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
