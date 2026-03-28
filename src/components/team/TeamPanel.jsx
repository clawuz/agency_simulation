import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../auth/AuthProvider'
import { getVisibleDepartments } from '../../utils/roleUtils'
import { DEPARTMENTS } from '../../data/departments'
import EmployeeCard from './EmployeeCard'

function generateCandidate(department, nextId) {
  const roles = DEPARTMENTS[department] || []
  const jobTitle = roles[Math.floor(Math.random() * roles.length)]
  const names = ['Ayşe Kaya', 'Mehmet Demir', 'Zeynep Çelik', 'Ali Yıldız', 'Fatma Şahin', 'Can Öztürk', 'Selin Arslan', 'Emre Koç']
  return {
    id: nextId,
    name: names[Math.floor(Math.random() * names.length)],
    jobTitle,
    department,
    salary: 25000 + Math.floor(Math.random() * 50000),
    level: 1,
    productivity: 1,
    hiringFee: 5000 + Math.floor(Math.random() * 10000),
  }
}

export default function TeamPanel() {
  const { gameState, setGameState } = useGame()
  const { userProfile } = useAuth()
  const { t } = useLang()
  const [showHireModal, setShowHireModal] = useState(false)
  const [candidate, setCandidate] = useState(null)

  const visibleDepts = getVisibleDepartments(userProfile?.role, userProfile?.department)

  function fireEmployee(id) {
    setGameState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }))
  }

  function openHire(dept) {
    setCandidate(generateCandidate(dept, gameState.nextEmployeeId ?? 1))
    setShowHireModal(true)
  }

  function hireCandidate() {
    setGameState(prev => ({
      ...prev,
      budget: prev.budget - candidate.hiringFee,
      employees: [...prev.employees, candidate],
      nextEmployeeId: (prev.nextEmployeeId ?? 1) + 1,
    }))
    setShowHireModal(false)
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>👥 {t('nav_team')}</h2>
      {visibleDepts.map(dept => {
        const deptEmployees = gameState.employees.filter(e => e.department === dept)
        return (
          <div key={dept} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 15, color: '#aaa' }}>{dept} ({deptEmployees.length})</h3>
              <button
                onClick={() => openHire(dept)}
                style={{ padding: '4px 12px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
              >
                + {t('btn_hire')}
              </button>
            </div>
            {deptEmployees.length === 0
              ? <p style={{ color: '#555', fontSize: 13 }}>Bu departmanda çalışan yok.</p>
              : deptEmployees.map(e => <EmployeeCard key={e.id} employee={e} onFire={fireEmployee} />)
            }
          </div>
        )
      })}

      {showHireModal && candidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#252526', borderRadius: 12, padding: 24, width: 360 }}>
            <h3 style={{ marginTop: 0 }}>Aday: {candidate.name}</h3>
            <p style={{ color: '#ccc', fontSize: 13 }}>
              {candidate.jobTitle} · {candidate.department}<br />
              Maaş: ₺{candidate.salary.toLocaleString('tr-TR')}/ay<br />
              İşe alım ücreti: ₺{candidate.hiringFee.toLocaleString('tr-TR')}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={hireCandidate} style={{ flex: 1, padding: 10, background: '#667EEA', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>İşe Al</button>
              <button onClick={() => setShowHireModal(false)} style={{ flex: 1, padding: 10, background: '#444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
