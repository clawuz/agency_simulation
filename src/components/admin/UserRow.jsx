import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { DEPARTMENTS } from '../../data/departments'

const ROLES = ['super_admin', 'finance', 'creative', 'social_media', 'strategy', 'digital', 'technology', 'account', 'production', 'hr', 'admin', 'pending']

export default function UserRow({ userId, profile }) {
  const [role, setRole] = useState(profile.role ?? 'pending')
  const [dept, setDept] = useState(profile.department ?? '')
  const [saved, setSaved] = useState(false)

  async function save() {
    await updateDoc(doc(db, 'users', userId), { role, department: dept })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <tr style={{ borderBottom: '1px solid #3e3e42' }}>
      <td style={{ padding: '10px 12px', fontSize: 13 }}>{profile.email}</td>
      <td style={{ padding: '10px 12px' }}>
        <select value={role} onChange={e => setRole(e.target.value)} style={{ background: '#2d2d30', color: '#fff', border: '1px solid #555', borderRadius: 4, padding: '4px 8px' }}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <select value={dept} onChange={e => setDept(e.target.value)} style={{ background: '#2d2d30', color: '#fff', border: '1px solid #555', borderRadius: 4, padding: '4px 8px' }}>
          <option value="">—</option>
          {Object.keys(DEPARTMENTS).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <button onClick={save} style={{ padding: '4px 12px', background: saved ? '#4CAF50' : '#667EEA', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>
          {saved ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </td>
    </tr>
  )
}
