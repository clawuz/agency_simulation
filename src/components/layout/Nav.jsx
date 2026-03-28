import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../auth/AuthProvider'
import { canAccessAdmin } from '../../utils/roleUtils'

export default function Nav({ active, setActive }) {
  const { t } = useLang()
  const { userProfile } = useAuth()
  const tabs = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: '🏠' },
    { id: 'projects', label: t('nav_projects'), icon: '📂' },
    { id: 'team', label: t('nav_team'), icon: '👥' },
    { id: 'education', label: t('nav_education'), icon: '🎓' },
    ...(canAccessAdmin(userProfile?.role) ? [{ id: 'admin', label: t('nav_admin'), icon: '⚙️' }] : []),
  ]

  return (
    <nav style={{ display: 'flex', gap: 2, background: '#2d2d30', padding: '0 16px', borderBottom: '1px solid #3e3e42' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            padding: '10px 16px',
            background: active === tab.id ? '#1e1e1e' : 'transparent',
            color: active === tab.id ? '#fff' : '#aaa',
            border: 'none',
            borderBottom: active === tab.id ? '2px solid #667EEA' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  )
}
