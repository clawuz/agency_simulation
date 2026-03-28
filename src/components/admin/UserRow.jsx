import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { DEPARTMENTS } from '../../data/departments'

const ROLES = ['super_admin', 'finance', 'creative', 'social_media', 'strategy', 'digital', 'technology', 'account', 'production', 'hr', 'admin', 'pending']

export default function UserRow({ userId, profile, isEditing, onEdit, onSaved, getInitials, RoleBadge, ROLE_COLORS }) {
  const [role, setRole] = useState(profile.role ?? 'pending')
  const [dept, setDept] = useState(profile.department ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    setSaving(true)
    await updateDoc(doc(db, 'users', userId), { role, department: dept })
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); onSaved() }, 1000)
  }

  const initials = getInitials(profile.email)
  const roleColor = (ROLE_COLORS[profile.role] || ROLE_COLORS.pending).text

  const selectStyle = {
    background: '#0F0F13',
    color: '#fff',
    border: '1px solid #2a2a35',
    borderRadius: 6,
    padding: '7px 10px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div style={{
      background: isEditing ? '#1E1E2E' : '#16161E',
      border: `1px solid ${isEditing ? '#7C6FE055' : '#1E1E2A'}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'all 0.15s ease',
    }}>
      {/* Row header — always visible */}
      <div
        onClick={onEdit}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px', cursor: 'pointer',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `${roleColor}22`,
          border: `1px solid ${roleColor}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: roleColor,
          flexShrink: 0,
        }}>
          {initials}
        </div>

        {/* Name + email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {profile.displayName || profile.email?.split('@')[0]}
          </div>
          <div style={{ fontSize: 12, color: '#444', marginTop: 1 }}>{profile.email}</div>
        </div>

        {/* Role badge */}
        <div style={{ flexShrink: 0 }}>
          <RoleBadge role={profile.role} />
        </div>

        {/* Department */}
        {profile.department && (
          <div style={{ fontSize: 12, color: '#444', flexShrink: 0 }}>{profile.department}</div>
        )}

        {/* Chevron */}
        <div style={{ color: '#333', fontSize: 12, transition: 'transform 0.15s', transform: isEditing ? 'rotate(180deg)' : 'none' }}>▼</div>
      </div>

      {/* Expanded editor */}
      {isEditing && (
        <div style={{
          padding: '0 18px 18px',
          borderTop: '1px solid #1E1E2A',
          paddingTop: 16,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Rol</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Departman</label>
              <select value={dept} onChange={e => setDept(e.target.value)} style={selectStyle}>
                <option value="">— Seçiniz</option>
                {Object.keys(DEPARTMENTS).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={onEdit}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #2a2a35', borderRadius: 6, color: '#555', fontSize: 13, cursor: 'pointer' }}
            >
              İptal
            </button>
            <button
              onClick={save}
              disabled={saving || saved}
              style={{
                padding: '8px 20px',
                background: saved ? '#10B981' : '#7C6FE0',
                border: 'none', borderRadius: 6,
                color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {saved ? '✓ Kaydedildi' : saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
