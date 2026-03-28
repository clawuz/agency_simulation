import { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { LanguageProvider } from './contexts/LanguageContext'
import { GameProvider } from './contexts/GameContext'
import LoginPage from './auth/LoginPage'
import Header from './components/layout/Header'
import Nav from './components/layout/Nav'
import Dashboard from './components/dashboard/Dashboard'
import ProjectsPanel from './components/projects/ProjectsPanel'
import TeamPanel from './components/team/TeamPanel'
import EducationPanel from './components/education/EducationPanel'
import AdminPanel from './components/admin/AdminPanel'

function AppShell() {
  const { user, loading, domainError } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Yükleniyor...</div>
  if (!user) return <LoginPage domainError={domainError} />

  const panels = {
    dashboard: <Dashboard />,
    projects: <ProjectsPanel />,
    team: <TeamPanel />,
    education: <EducationPanel />,
    admin: <AdminPanel />,
  }

  return (
    <GameProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <Header />
        <Nav active={activeTab} setActive={setActiveTab} />
        <main style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {panels[activeTab]}
        </main>
      </div>
    </GameProvider>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </LanguageProvider>
  )
}
