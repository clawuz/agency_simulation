import { useAuth } from '../../auth/AuthProvider'
import { useLang } from '../../contexts/LanguageContext'

export default function Header({ activeTab, setActiveTab }) {
  const { userProfile, user } = useAuth()
  const { lang, setLang } = useLang()
  const initials = (userProfile?.name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid #1E1E1E',
      padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <div
        onClick={() => setActiveTab('dashboard')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.5px' }}>
          Tribal <span style={{ color: '#FF6B2B' }}>●</span>
        </span>
        <span style={{ color: '#A0A0A0', fontSize: 13, fontWeight: 400, marginLeft: 4 }}>İlham Arşivi</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', background: '#111', border: '1px solid #2A2A2A', borderRadius: 6, overflow: 'hidden' }}>
          {['TR', 'EN'].map(l => (
            <button key={l} onClick={() => setLang(l.toLowerCase())}
              style={{
                padding: '5px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: lang === l.toLowerCase() ? '#FF6B2B' : 'transparent',
                color: lang === l.toLowerCase() ? '#fff' : '#A0A0A0',
                transition: 'all 0.15s',
              }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF6B2B, #E8B84B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'default',
        }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
