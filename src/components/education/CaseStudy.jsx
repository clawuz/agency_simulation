import { useState } from 'react'
import Quiz from './Quiz'
import { useLang } from '../../contexts/LanguageContext'

export default function CaseStudy({ caseData, onScored }) {
  const { t } = useLang()
  const [phase, setPhase] = useState('info')

  return (
    <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: 10, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15 }}>{caseData.awardIcon} {caseData.title}</h3>
        <span style={{ color: '#aaa', fontSize: 12 }}>{caseData.award}</span>
      </div>

      {phase === 'info' && (
        <>
          <div style={{ fontSize: 13, color: '#ccc', marginBottom: 12 }}>
            <p><strong>🧠 {t('label_insight')}:</strong> {caseData.insight}</p>
            <p><strong>💡 {t('label_idea')}:</strong> {caseData.idea}</p>
            <p><strong>📊 {t('label_result')}:</strong> {caseData.result}</p>
          </div>
          <button
            onClick={() => setPhase('quiz')}
            style={{ padding: '8px 18px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            {t('btn_start_quiz')} →
          </button>
        </>
      )}

      {phase === 'quiz' && (
        <Quiz
          questions={caseData.quiz}
          caseId={caseData.id}
          onComplete={(score) => { onScored(score); setPhase('done') }}
        />
      )}

      {phase === 'done' && (
        <p style={{ color: '#4CAF50', fontSize: 13 }}>✅ Tamamlandı</p>
      )}
    </div>
  )
}
