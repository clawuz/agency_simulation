import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../firebase'

export default function Quiz({ questions, caseId, onComplete }) {
  const { user } = useAuth()
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState(null)

  function answer(idx) {
    setSelected(idx)
    const correct = idx === questions[current].correct
    const newScore = correct ? score + 1 : score

    setTimeout(async () => {
      if (current + 1 >= questions.length) {
        setScore(newScore)
        setDone(true)
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            quizScores: arrayUnion({ caseId, score: newScore, total: questions.length, completedAt: Date.now() }),
          })
        }
        onComplete(newScore)
      } else {
        setCurrent(c => c + 1)
        setSelected(null)
        setScore(newScore)
      }
    }, 800)
  }

  if (done) return (
    <div style={{ textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 40 }}>{score === questions.length ? '🏆' : '⭐'}</div>
      <h3>{score} / {questions.length} doğru</h3>
      <p style={{ color: '#aaa' }}>+{score * 5} itibar puanı kazandın!</p>
    </div>
  )

  const q = questions[current]
  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: 16 }}>{current + 1}. {q.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selected === null && answer(i)}
            style={{
              padding: '10px 14px',
              textAlign: 'left',
              background: selected === null ? '#2d2d30' : i === q.correct ? '#2e7d32' : i === selected ? '#c0392b' : '#2d2d30',
              color: '#fff',
              border: '1px solid #3e3e42',
              borderRadius: 6,
              cursor: selected === null ? 'pointer' : 'default',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
