import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import { AWARDS } from '../../data/awards'

export default function AwardsCabinet() {
  const { gameState } = useGame()
  const { t, lang } = useLang()
  const wonAwardIds = gameState.projects
    .filter(p => p.award)
    .map(p => p.award.id)

  return (
    <div style={{ background: '#252526', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#aaa' }}>🏆 {t('awards_title')}</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {AWARDS.map(award => {
          const count = wonAwardIds.filter(id => id === award.id).length
          return (
            <div key={award.id} style={{ textAlign: 'center', opacity: count > 0 ? 1 : 0.3 }}>
              <div style={{ fontSize: 28 }}>{award.icon}</div>
              <div style={{ fontSize: 11, color: '#ccc' }}>{award.label[lang] ?? award.label.tr}</div>
              {count > 0 && <div style={{ fontSize: 11, color: '#4CAF50' }}>×{count}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
