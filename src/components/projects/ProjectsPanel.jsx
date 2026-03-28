import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import ProjectCard from './ProjectCard'

export default function ProjectsPanel() {
  const { gameState, acceptProject, findNewProject, processBilling } = useGame()
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('available')

  const available = gameState.projectOpportunities
  const inProgress = gameState.projects.filter(p => p.status === 'in_progress')
  const completed = gameState.projects.filter(p => ['completed_unbilled', 'billed'].includes(p.status))

  const tabs = [
    { id: 'available', label: t('tab_available'), items: available },
    { id: 'in_progress', label: t('tab_in_progress'), items: inProgress },
    { id: 'completed', label: t('tab_completed'), items: completed },
  ]

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>📂 {t('nav_projects')}</h2>
        <button
          onClick={findNewProject}
          style={{ padding: '8px 16px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          ➕ Yeni Proje Bul
        </button>
      </div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? '#667EEA' : '#2d2d30',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {tab.label} ({tab.items.length})
          </button>
        ))}
      </div>
      {activeTab === 'available' && available.map(p => (
        <ProjectCard key={p.id} project={p} onAccept={acceptProject} />
      ))}
      {activeTab === 'in_progress' && inProgress.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
      {activeTab === 'completed' && completed.map(p => (
        <ProjectCard key={p.id} project={p} onBilling={processBilling} />
      ))}
    </div>
  )
}
