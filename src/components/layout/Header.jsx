import { useAuth } from '../../auth/AuthProvider'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import { canSeeBudget } from '../../utils/roleUtils'
import { getFormattedDate } from '../../game/gameLoop'

export default function Header() {
  const { userProfile } = useAuth()
  const { gameState } = useGame()
  const { lang, setLang, t } = useLang()
  const { budget, resourcePoints, reputation, officeLevel, currentTotalDays } = gameState
  const showBudget = canSeeBudget(userProfile?.role)
  const date = getFormattedDate(currentTotalDays)

  return (
    <header style={{ background: '#252526', borderBottom: '1px solid #3e3e42', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>🏢 Tribal Istanbul</span>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: '#ccc', fontSize: 13 }}>
        {showBudget
          ? <span>💰 {t('metric_budget')}: ₺{budget.toLocaleString('tr-TR')}</span>
          : <span>🔋 {t('metric_resource')}: {resourcePoints}</span>
        }
        <span>⭐ {t('metric_reputation')}: {reputation}</span>
        <span>🏢 {t('metric_office')}: {officeLevel}</span>
        <span>📅 Y{date.year} A{date.month} G{date.day}</span>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          style={{ background: '#3c3c3c', color: '#fff', border: '1px solid #555', borderRadius: 4, padding: '2px 6px' }}
        >
          <option value="tr">TR</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  )
}
