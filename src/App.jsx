import { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { LanguageProvider } from './contexts/LanguageContext'
import LoginPage from './auth/LoginPage'
import Header from './components/layout/Header'
import Nav from './components/layout/Nav'
import Dashboard from './components/dashboard/Dashboard'
import ArchivePanel from './components/archive/ArchivePanel'
import TribalPanel from './components/tribal/TribalPanel'
import AdminPanel from './components/admin/AdminPanel'

function AppShell() {
  const { user, loading, domainError } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) return (
    <div style={{ background: '#0A0A0A', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B2B', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16 }}>
      Yükleniyor...
    </div>
  )
  if (!user) return <LoginPage domainError={domainError} />

  const panels = {
    dashboard: <Dashboard onNavigateToArchive={() => setActiveTab('archive')} />,
    archive: <ArchivePanel />,
    tribal: <TribalPanel />,
    admin: <AdminPanel />,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Nav active={activeTab} setActive={setActiveTab} />
      <main style={{ flex: 1 }}>
        {panels[activeTab] ?? panels.dashboard}
      </main>
    </div>
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
