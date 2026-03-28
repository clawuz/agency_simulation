import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useLang } from '../../contexts/LanguageContext'
import UserRow from './UserRow'

export default function AdminPanel() {
  const { t } = useLang()
  const [users, setUsers] = useState([])

  useEffect(() => {
    getDocs(collection(db, 'users')).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>⚙️ {t('nav_admin')}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ color: '#aaa', textAlign: 'left', borderBottom: '1px solid #3e3e42' }}>
            <th style={{ padding: '8px 12px' }}>E-posta</th>
            <th style={{ padding: '8px 12px' }}>Rol</th>
            <th style={{ padding: '8px 12px' }}>Departman</th>
            <th style={{ padding: '8px 12px' }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => <UserRow key={u.id} userId={u.id} profile={u} />)}
        </tbody>
      </table>
    </div>
  )
}
