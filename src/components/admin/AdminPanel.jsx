import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useLang } from '../../contexts/LanguageContext'
import UserRow from './UserRow'

const ROLE_COLORS = {
  super_admin: { bg: '#E8B84B22', border: '#E8B84B', text: '#E8B84B' },
  admin: { bg: '#7C6FE022', border: '#7C6FE0', text: '#A89CF7' },
  finance: { bg: '#10B98122', border: '#10B981', text: '#10B981' },
  creative: { bg: '#F4366822', border: '#F43668', text: '#F87096' },
  account: { bg: '#3B82F622', border: '#3B82F6', text: '#60A5FA' },
  strategy: { bg: '#8B5CF622', border: '#8B5CF6', text: '#A78BFA' },
  social_media: { bg: '#EC489922', border: '#EC4899', text: '#F472B6' },
  digital: { bg: '#06B6D422', border: '#06B6D4', text: '#22D3EE' },
  technology: { bg: '#84CC1622', border: '#84CC16', text: '#A3E635' },
  production: { bg: '#F9731622', border: '#F97316', text: '#FB923C' },
  hr: { bg: '#6B728022', border: '#6B7280', text: '#9CA3AF' },
  pending: { bg: '#37415122', border: '#374151', text: '#6B7280' },
}

function getInitials(email) {
  if (!email) return '?'
  const name = email.split('@')[0].split('.')
  return name.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] || ROLE_COLORS.pending
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.05em',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
    }}>
      {role?.toUpperCase().replace('_', ' ')}
    </span>
  )
}

export default function AdminPanel() {
  const { t } = useLang()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  function loadUsers() {
    setLoading(true)
    getDocs(collection(db, 'users')).then(snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      list.sort((a, b) => (a.email || '').localeCompare(b.email || ''))
      setUsers(list)
      setLoading(false)
    })
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter(u =>
    !search || u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: users.length,
    active: users.filter(u => u.role && u.role !== 'pending').length,
    pending: users.filter(u => !u.role || u.role === 'pending').length,
  }

  return (
    <div style={{ maxWidth: 1000, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            Kullanıcı Yönetimi
          </h2>
          <span style={{ fontSize: 13, color: '#555', fontWeight: 400 }}>Admin</span>
        </div>
        <p style={{ margin: 0, color: '#555', fontSize: 13 }}>Ekip üyelerine rol ve departman ata</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Toplam Üye', value: stats.total, color: '#7C6FE0' },
          { label: 'Aktif', value: stats.active, color: '#10B981' },
          { label: 'Bekleyen', value: stats.pending, color: '#E8B84B' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: '#1C1C24', borderRadius: 10, padding: '14px 18px',
            border: '1px solid #2a2a35',
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + refresh */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444', fontSize: 14 }}>🔍</span>
          <input
            type="text"
            placeholder="İsim veya e-posta ile ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px 10px 36px',
              background: '#1C1C24', border: '1px solid #2a2a35',
              borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none',
            }}
          />
        </div>
        <button
          onClick={loadUsers}
          style={{
            padding: '10px 18px', background: '#1C1C24', border: '1px solid #2a2a35',
            borderRadius: 8, color: '#888', fontSize: 13, cursor: 'pointer',
          }}
        >
          ↺ Yenile
        </button>
      </div>

      {/* User cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#444' }}>Kullanıcı bulunamadı</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(u => (
            <UserRow
              key={u.id}
              userId={u.id}
              profile={u}
              isEditing={editingId === u.id}
              onEdit={() => setEditingId(editingId === u.id ? null : u.id)}
              onSaved={() => { setEditingId(null); loadUsers() }}
              getInitials={getInitials}
              RoleBadge={RoleBadge}
              ROLE_COLORS={ROLE_COLORS}
            />
          ))}
        </div>
      )}
    </div>
  )
}
