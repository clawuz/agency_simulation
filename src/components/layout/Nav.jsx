import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../auth/AuthProvider'
import { canAccessAdmin } from '../../utils/roleUtils'

export default function Nav({ active, setActive }) {
  const { t } = useLang()
  const { userProfile } = useAuth()
  const tabs = [
    { id: 'dashboard', label: t('nav_home'), icon: '🏠' },
    { id: 'archive', label: t('nav_archive'), icon: '🌍' },
    { id: 'tribal', label: t('nav_tribal'), icon: '🏆' },
    ...(canAccessAdmin(userProfile?.role) ? [{ id: 'admin', label: t('nav_admin'), icon: '⚙️' }] : []),
  ]

  return (
    <nav style={{
      display: 'flex', gap: 0,
      background: 'rgba(10,10,10,0.95)',
      borderBottom: '1px solid #1E1E1E',
      padding: '0 32px',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            padding: '14px 20px',
            background: 'transparent',
            color: active === tab.id ? '#FF6B2B' : '#A0A0A0',
            border: 'none',
            borderBottom: active === tab.id ? '2px solid #FF6B2B' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: active === tab.id ? 600 : 400,
            transition: 'all 0.2s',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => { if (active !== tab.id) e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { if (active !== tab.id) e.currentTarget.style.color = '#A0A0A0' }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  )
}
