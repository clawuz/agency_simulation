import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useLang } from '../../contexts/LanguageContext'
import { useGame } from '../../contexts/GameContext'
import CaseStudy from './CaseStudy'

export default function EducationPanel() {
  const { t } = useLang()
  const { setGameState } = useGame()
  const [cases, setCases] = useState([])

  useEffect(() => {
    getDoc(doc(db, 'education', 'cases')).then(snap => {
      if (snap.exists()) setCases(snap.data().items ?? [])
    })
  }, [])

  function handleScore(points) {
    setGameState(prev => ({ ...prev, reputation: prev.reputation + points * 5 }))
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>🎓 {t('nav_education')}</h2>
      <h3 style={{ color: '#aaa', fontSize: 14, marginBottom: 16 }}>🏆 {t('education_cases')}</h3>
      {cases.length === 0
        ? <p style={{ color: '#555' }}>Case study yükleniyor...</p>
        : cases.map(c => <CaseStudy key={c.id} caseData={c} onScored={handleScore} />)
      }
    </div>
  )
}
