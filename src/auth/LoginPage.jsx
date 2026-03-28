import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { isAllowedDomain } from './domainCheck'

export default function LoginPage({ domainError }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    if (!isAllowedDomain(email)) {
      setError('Yalnızca @tribalistanbul.com ve @twist.ddb.com adresleriyle giriş yapabilirsiniz.')
      return
    }
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError('Giriş başarısız. E-posta veya şifrenizi kontrol edin.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1e1e1e', color: '#fff' }}>
      <h1 style={{ marginBottom: 8 }}>🏢 Tribal Istanbul</h1>
      <p style={{ color: '#aaa', marginBottom: 32 }}>Agency Simulation</p>
      {domainError && (
        <p style={{ color: '#f44', marginBottom: 16 }}>Bu e-posta adresiyle giriş yapamazsınız.</p>
      )}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
        <input
          type="email"
          placeholder="ad@tribalistanbul.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #444', background: '#2d2d2d', color: '#fff' }}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #444', background: '#2d2d2d', color: '#fff' }}
        />
        {error && <p style={{ color: '#f44', fontSize: 13 }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', borderRadius: 6, background: '#667EEA', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Giriş Yap
        </button>
      </form>
    </div>
  )
}
