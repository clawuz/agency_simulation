import AwardsCabinet from './AwardsCabinet'
import EventLog from './EventLog'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'

export default function Dashboard() {
  const { gameState } = useGame()
  const { lang } = useLang()
  const activeProjects = gameState.projects.filter(p => p.status === 'in_progress')

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div style={{ background: '#252526', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#aaa' }}>📂 Aktif Projeler</h3>
        {activeProjects.length === 0
          ? <p style={{ color: '#666', fontSize: 13 }}>Aktif proje yok.</p>
          : activeProjects.map(p => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{p.client} — {p.typeLabel?.[lang] ?? p.typeLabel?.tr}</div>
              <div style={{ background: '#3c3c3c', borderRadius: 4, height: 6 }}>
                <div style={{ background: '#667EEA', borderRadius: 4, height: 6, width: `${Math.round(p.progress)}%` }} />
              </div>
            </div>
          ))
        }
      </div>
      <AwardsCabinet />
      <EventLog />
    </div>
  )
}
