import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'

export default function EventLog() {
  const { gameState } = useGame()
  const { lang } = useLang()

  return (
    <div style={{ background: '#252526', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#aaa' }}>🔔 Bildirimler</h3>
      {gameState.eventLog.length === 0
        ? <p style={{ color: '#666', fontSize: 13 }}>Henüz bildirim yok.</p>
        : gameState.eventLog.map((event, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #3e3e42', fontSize: 13 }}>
            <span style={{ color: '#667EEA', marginRight: 8 }}>Gün {event.day}</span>
            {event.message?.[lang] ?? event.message?.tr}
          </div>
        ))
      }
    </div>
  )
}
