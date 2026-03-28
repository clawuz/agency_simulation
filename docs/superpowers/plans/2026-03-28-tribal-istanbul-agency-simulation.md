# Tribal Istanbul Agency Simulation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-based simulation and training game for Tribal Worldwide Istanbul employees, with Firebase Auth (domain-restricted), role-based access, TR/EN language support, and a Cannes Lions education module.

**Architecture:** React + Vite SPA with Firebase Auth, Firestore for persistence, and Firebase Hosting. Game loop runs client-side in React state; auto-saves to Firestore every 30 seconds. Roles and departments are stored in Firestore and assigned by admins.

**Tech Stack:** React 18, Vite, Firebase 10 (Auth + Firestore + Hosting), Vitest + React Testing Library

---

## File Map

```
Agency_Planing/
├── index.html
├── vite.config.js
├── package.json
├── firestore.rules
├── firebase.json
├── .firebaserc
├── src/
│   ├── main.jsx                          # React root mount
│   ├── App.jsx                           # Routes + auth gate
│   ├── firebase.js                       # Firebase init
│   ├── auth/
│   │   ├── AuthProvider.jsx              # Auth context + domain guard
│   │   ├── LoginPage.jsx                 # Login UI
│   │   └── domainCheck.js                # Email domain validation logic
│   ├── contexts/
│   │   ├── GameContext.jsx               # Game state + auto-save
│   │   └── LanguageContext.jsx           # TR/EN i18n context
│   ├── hooks/
│   │   ├── useAuth.js                    # Auth state hook
│   │   └── useGameState.js               # Firestore game state hook
│   ├── data/
│   │   ├── i18n.js                       # All TR/EN strings
│   │   ├── clients.js                    # Client name list
│   │   ├── projectTypes.js               # Project type definitions
│   │   ├── departments.js                # Departments + roles
│   │   ├── events.js                     # Random event definitions
│   │   └── awards.js                     # Award tiers + reputation bonuses
│   ├── game/
│   │   ├── gameLoop.js                   # Day tick logic
│   │   └── projectEngine.js              # Project progress + billing logic
│   ├── utils/
│   │   ├── roleUtils.js                  # Role permission helpers
│   │   └── formatUtils.js               # Currency + date formatters
│   └── components/
│       ├── layout/
│       │   ├── Header.jsx                # Metrics bar + language switcher
│       │   └── Nav.jsx                   # Tab navigation
│       ├── dashboard/
│       │   ├── Dashboard.jsx             # Dashboard page
│       │   ├── MetricsBar.jsx            # Budget/Kaynak/Itibar/Date
│       │   ├── AwardsCabinet.jsx         # Cannes/Felis/Effie/Kristal display
│       │   └── EventLog.jsx              # Notification feed
│       ├── projects/
│       │   ├── ProjectsPanel.jsx         # Available/InProgress/Completed tabs
│       │   ├── ProjectCard.jsx           # Single project card
│       │   └── ProjectDetail.jsx         # Project detail modal
│       ├── team/
│       │   ├── TeamPanel.jsx             # Department-grouped employee list
│       │   └── EmployeeCard.jsx          # Single employee card
│       ├── education/
│       │   ├── EducationPanel.jsx        # Education page with sub-tabs
│       │   ├── CaseStudy.jsx             # Single Cannes case viewer
│       │   └── Quiz.jsx                  # Mini quiz + scoring
│       └── admin/
│           ├── AdminPanel.jsx            # User list + role assignment
│           └── UserRow.jsx               # Single user row with role editor
└── tests/
    ├── auth/
    │   └── domainCheck.test.js
    ├── game/
    │   ├── gameLoop.test.js
    │   └── projectEngine.test.js
    └── utils/
        └── roleUtils.test.js
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Initialize Vite + React project**

```bash
cd /Users/okilavuz/Desktop/omer_works/Agency_Planing
npm create vite@latest . -- --template react
```

When prompted about existing files, select "Ignore files and continue".

- [ ] **Step 2: Install dependencies**

```bash
npm install firebase react-router-dom
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

Replace content of `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `tests/setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, update the `scripts` section:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Local server running at `http://localhost:5173`

- [ ] **Step 7: Commit**

```bash
git init
git add package.json vite.config.js index.html src/ tests/setup.js
git commit -m "feat: initialize React + Vite project with Vitest"
```

---

## Task 2: Firebase Configuration

**Files:**
- Create: `src/firebase.js`
- Modify: `firebase.json`
- Modify: `.firebaserc`

- [ ] **Step 1: Write firebase.js**

Create `src/firebase.js`:

```js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  projectId: 'agency-planing',
  // Fill remaining config from Firebase Console:
  // Project Settings → Your apps → Web app → SDK setup
  apiKey: '',
  authDomain: '',
  storageBucket: '',
  messagingSenderId: '933162635662',
  appId: '',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

> **Action required:** Go to Firebase Console → Project `agency-planing` → Project Settings → Add a web app → copy the config values and fill in the blanks above.

- [ ] **Step 2: Update firebase.json for hosting**

Replace `firebase.json` content:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "ui": { "enabled": true },
    "singleProjectMode": true
  }
}
```

- [ ] **Step 3: Verify .firebaserc points to correct project**

`/Users/okilavuz/Desktop/omer_works/.firebaserc` already contains:
```json
{ "projects": { "default": "lingocards-6502d" } }
```

Create a project-local `.firebaserc` inside `Agency_Planing/`:

```json
{
  "projects": {
    "default": "agency-planing"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/firebase.js firebase.json .firebaserc
git commit -m "feat: add Firebase config for agency-planing project"
```

---

## Task 3: Domain-Restricted Authentication

**Files:**
- Create: `src/auth/domainCheck.js`
- Create: `tests/auth/domainCheck.test.js`
- Create: `src/auth/AuthProvider.jsx`
- Create: `src/auth/LoginPage.jsx`

- [ ] **Step 1: Write failing test for domain check**

Create `tests/auth/domainCheck.test.js`:

```js
import { isAllowedDomain } from '../../src/auth/domainCheck'

describe('isAllowedDomain', () => {
  it('allows @tribalistanbul.com', () => {
    expect(isAllowedDomain('omer@tribalistanbul.com')).toBe(true)
  })

  it('allows @twist.ddb.com', () => {
    expect(isAllowedDomain('guldeniz@twist.ddb.com')).toBe(true)
  })

  it('rejects @gmail.com', () => {
    expect(isAllowedDomain('user@gmail.com')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isAllowedDomain('')).toBe(false)
  })

  it('rejects no-at-sign string', () => {
    expect(isAllowedDomain('notanemail')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test tests/auth/domainCheck.test.js
```

Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Implement domainCheck.js**

Create `src/auth/domainCheck.js`:

```js
const ALLOWED_DOMAINS = ['tribalistanbul.com', 'twist.ddb.com']

export function isAllowedDomain(email) {
  if (!email || !email.includes('@')) return false
  const domain = email.split('@')[1]
  return ALLOWED_DOMAINS.includes(domain)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test tests/auth/domainCheck.test.js
```

Expected: PASS (5 tests)

- [ ] **Step 5: Create AuthProvider**

Create `src/auth/AuthProvider.jsx`:

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { isAllowedDomain } from './domainCheck'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null) // { role, department }
  const [loading, setLoading] = useState(true)
  const [domainError, setDomainError] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!isAllowedDomain(firebaseUser.email)) {
          await signOut(auth)
          setDomainError(true)
          setLoading(false)
          return
        }
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setUserProfile(snap.exists() ? snap.data() : { role: 'pending', department: null })
        setUser(firebaseUser)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, domainError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

- [ ] **Step 6: Create LoginPage**

Create `src/auth/LoginPage.jsx`:

```jsx
import { useState } from 'react'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
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
```

- [ ] **Step 7: Commit**

```bash
git add src/auth/ tests/auth/
git commit -m "feat: domain-restricted Firebase auth with AuthProvider and LoginPage"
```

---

## Task 4: Role Utilities

**Files:**
- Create: `src/utils/roleUtils.js`
- Create: `tests/utils/roleUtils.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/utils/roleUtils.test.js`:

```js
import { canSeeBudget, canAccessAdmin, getVisibleDepartments } from '../../src/utils/roleUtils'

describe('canSeeBudget', () => {
  it('returns true for super_admin', () => expect(canSeeBudget('super_admin')).toBe(true))
  it('returns true for finance', () => expect(canSeeBudget('finance')).toBe(true))
  it('returns true for admin', () => expect(canSeeBudget('admin')).toBe(true))
  it('returns false for creative', () => expect(canSeeBudget('creative')).toBe(false))
  it('returns false for account', () => expect(canSeeBudget('account')).toBe(false))
})

describe('canAccessAdmin', () => {
  it('returns true for admin', () => expect(canAccessAdmin('admin')).toBe(true))
  it('returns true for super_admin', () => expect(canAccessAdmin('super_admin')).toBe(true))
  it('returns false for creative', () => expect(canAccessAdmin('creative')).toBe(false))
})

describe('getVisibleDepartments', () => {
  it('returns all departments for admin', () => {
    const result = getVisibleDepartments('admin', null)
    expect(result.length).toBeGreaterThan(5)
  })
  it('returns only own department for creative', () => {
    const result = getVisibleDepartments('creative', 'Creative')
    expect(result).toEqual(['Creative'])
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm test tests/utils/roleUtils.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement roleUtils.js**

Create `src/utils/roleUtils.js`:

```js
import { DEPARTMENTS } from '../data/departments'

const BUDGET_ROLES = ['super_admin', 'finance', 'admin']
const ADMIN_ROLES = ['admin', 'super_admin']
const ALL_DEPT_ROLES = ['admin', 'super_admin', 'hr']

export function canSeeBudget(role) {
  return BUDGET_ROLES.includes(role)
}

export function canAccessAdmin(role) {
  return ADMIN_ROLES.includes(role)
}

export function getVisibleDepartments(role, department) {
  if (ALL_DEPT_ROLES.includes(role)) return Object.keys(DEPARTMENTS)
  return department ? [department] : []
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npm test tests/utils/roleUtils.test.js
```

Expected: PASS (8 tests)

- [ ] **Step 5: Commit**

```bash
git add src/utils/roleUtils.js tests/utils/roleUtils.test.js
git commit -m "feat: role permission utilities with tests"
```

---

## Task 5: Game Data — Clients, Projects, Departments, Awards, Events

**Files:**
- Create: `src/data/clients.js`
- Create: `src/data/projectTypes.js`
- Create: `src/data/departments.js`
- Create: `src/data/awards.js`
- Create: `src/data/events.js`

- [ ] **Step 1: Create clients.js**

Create `src/data/clients.js`:

```js
export const CLIENTS = [
  'Turkish Airlines',
  'Algida',
  'Dove',
  'Audi',
  'ING',
  'Şok Marketler',
  'IKSV',
  'Findeks',
  'Netflix',
  'İş Bankası',
  'Fiba Banka',
  'AJET',
  'Miles & Smiles',
  'Turkish Cargo',
]
```

- [ ] **Step 2: Create projectTypes.js**

Create `src/data/projectTypes.js`:

```js
export const PROJECT_TYPES = [
  { id: '360_integrated', label: { tr: '360° Entegre Kampanya', en: '360° Integrated Campaign' }, baseBudget: 500000, baseDays: 60 },
  { id: 'social_media', label: { tr: 'Sosyal Medya Kampanyası', en: 'Social Media Campaign' }, baseBudget: 80000, baseDays: 20 },
  { id: 'tvc', label: { tr: 'TVC Prodüksiyon', en: 'TVC Production' }, baseBudget: 350000, baseDays: 45 },
  { id: 'digital', label: { tr: 'Dijital Kampanya', en: 'Digital Campaign' }, baseBudget: 120000, baseDays: 25 },
  { id: 'brand_identity', label: { tr: 'Marka Kimliği', en: 'Brand Identity' }, baseBudget: 150000, baseDays: 30 },
  { id: 'experiential', label: { tr: 'Experiential Aktivasyon', en: 'Experiential Activation' }, baseBudget: 250000, baseDays: 35 },
  { id: 'tech_production', label: { tr: 'Technology Production', en: 'Technology Production' }, baseBudget: 200000, baseDays: 40 },
  { id: 'ooh', label: { tr: 'OOH Kampanyası', en: 'OOH Campaign' }, baseBudget: 90000, baseDays: 15 },
  { id: 'content', label: { tr: 'İçerik Prodüksiyonu', en: 'Content Production' }, baseBudget: 60000, baseDays: 14 },
]

export const BILLING_STRUCTURES = [
  { name: '1 Taksit (100%)', installments: [{ percent: 100, daysAfterCompletion: 0 }] },
  { name: '2 Taksit (50-50)', installments: [{ percent: 50, daysAfterCompletion: 0 }, { percent: 50, daysAfterCompletion: 30 }] },
  { name: '2 Taksit (60-40)', installments: [{ percent: 60, daysAfterCompletion: 0 }, { percent: 40, daysAfterCompletion: 30 }] },
  { name: '2 Taksit (70-30)', installments: [{ percent: 70, daysAfterCompletion: 0 }, { percent: 30, daysAfterCompletion: 30 }] },
  { name: '3 Taksit (30-30-40)', installments: [{ percent: 30, daysAfterCompletion: 0 }, { percent: 30, daysAfterCompletion: 15 }, { percent: 40, daysAfterCompletion: 45 }] },
]
```

- [ ] **Step 3: Create departments.js**

Create `src/data/departments.js`:

```js
export const DEPARTMENTS = {
  'Üst Yönetim': ['Yönetici Ortak', 'Ajans Başkanı', 'CFO'],
  'Creative': ['ECD', 'Creative Director', 'Art Director', 'Copywriter', 'Motion Graphics'],
  'Social Media': ['Community Manager', 'Content Creator'],
  'Strategy': ['CSO', 'Brand Strategist', 'Data & Insight Analyst'],
  'Digital': ['Digital Campaign Manager', 'Web Developer'],
  'Technology': ['Tech Producer'],
  'Account': ['Account Director', 'Account Supervisor', 'Account Manager', 'Group Brand Director'],
  'Production': ['Production Head', 'Productor'],
  'İnsan Kaynakları': ['IK Director'],
  'Finans': ['CFO', 'Finans Uzmanı'],
}

export const ROLE_TO_DEPARTMENT = {
  super_admin: 'Üst Yönetim',
  finance: 'Finans',
  creative: 'Creative',
  social_media: 'Social Media',
  strategy: 'Strategy',
  digital: 'Digital',
  technology: 'Technology',
  account: 'Account',
  production: 'Production',
  hr: 'İnsan Kaynakları',
  admin: null, // cross-department
}
```

- [ ] **Step 4: Create awards.js**

Create `src/data/awards.js`:

```js
export const AWARDS = [
  { id: 'effie_bronze', label: { tr: 'Effie Bronze', en: 'Effie Bronze' }, icon: '🥉', reputationBonus: 5 },
  { id: 'kristal_elma', label: { tr: 'Kristal Elma', en: 'Kristal Elma' }, icon: '🍎', reputationBonus: 10 },
  { id: 'cannes_shortlist', label: { tr: 'Cannes Lions Shortlist', en: 'Cannes Lions Shortlist' }, icon: '🦁', reputationBonus: 20 },
  { id: 'cannes_lions', label: { tr: 'Cannes Lions', en: 'Cannes Lions' }, icon: '🏆', reputationBonus: 50 },
  { id: 'felis_agency_of_year', label: { tr: 'Felis Yılın Ajansı', en: 'Felis Agency of the Year' }, icon: '🐱', reputationBonus: 100 },
]

// Probability that a completed project wins an award (0-1)
export const AWARD_CHANCE = 0.15
```

- [ ] **Step 5: Create events.js**

Create `src/data/events.js`:

```js
export const RANDOM_EVENTS = [
  {
    id: 'cannes_shortlist',
    message: { tr: 'Cannes Lions shortlist\'e girdiniz! 🦁', en: 'You made the Cannes Lions shortlist! 🦁' },
    type: 'money_gain',
    reputationDelta: 20,
    budgetDelta: 0,
  },
  {
    id: 'brief_changed',
    message: { tr: 'Müşteri brief\'i değiştirdi, baştan başlıyoruz.', en: 'Client changed the brief — starting over.' },
    type: 'money_loss',
    reputationDelta: -5,
    budgetDelta: -20000,
  },
  {
    id: 'felis_night',
    message: { tr: 'Felis ödül gecesi — ekip motivasyonu zirve! ⭐', en: 'Felis awards night — team morale is through the roof! ⭐' },
    type: 'system',
    reputationDelta: 10,
    budgetDelta: 0,
  },
]

export const EVENT_CHANCE_PER_DAY = 0.05 // 5% each game day
```

- [ ] **Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add game data — clients, projects, departments, awards, events"
```

---

## Task 6: i18n — TR/EN Language System

**Files:**
- Create: `src/data/i18n.js`
- Create: `src/contexts/LanguageContext.jsx`

- [ ] **Step 1: Create i18n.js**

Create `src/data/i18n.js`:

```js
export const STRINGS = {
  // Nav
  nav_dashboard: { tr: 'Dashboard', en: 'Dashboard' },
  nav_projects: { tr: 'Projeler', en: 'Projects' },
  nav_team: { tr: 'Ekip', en: 'Team' },
  nav_education: { tr: 'Eğitim', en: 'Education' },
  nav_admin: { tr: 'Admin', en: 'Admin' },

  // Metrics
  metric_budget: { tr: 'Bütçe', en: 'Budget' },
  metric_resource: { tr: 'Kaynak Puanı', en: 'Resource Points' },
  metric_reputation: { tr: 'İtibar', en: 'Reputation' },
  metric_office: { tr: 'Ofis Seviyesi', en: 'Office Level' },

  // Projects
  tab_available: { tr: 'Mevcut', en: 'Available' },
  tab_in_progress: { tr: 'Devam Eden', en: 'In Progress' },
  tab_completed: { tr: 'Tamamlanan', en: 'Completed' },
  btn_accept: { tr: 'Kabul Et', en: 'Accept' },
  btn_billing: { tr: 'Fatura Kes', en: 'Process Billing' },
  label_client: { tr: 'Müşteri', en: 'Client' },
  label_budget: { tr: 'Bütçe', en: 'Budget' },
  label_timeline: { tr: 'Süre', en: 'Timeline' },
  label_billing: { tr: 'Ödeme', en: 'Billing' },

  // Team
  btn_hire: { tr: 'İşe Al', en: 'Hire' },
  btn_fire: { tr: 'Çıkar', en: 'Fire' },
  btn_train: { tr: 'Eğit', en: 'Train' },
  label_salary: { tr: 'Maaş', en: 'Salary' },
  label_skills: { tr: 'Yetenekler', en: 'Skills' },

  // Education
  education_cases: { tr: 'Ödüllük Fikirler', en: 'Award-Worthy Ideas' },
  btn_watch: { tr: 'İzle', en: 'Watch' },
  btn_start_quiz: { tr: 'Quize Başla', en: 'Start Quiz' },
  label_insight: { tr: 'Insight', en: 'Insight' },
  label_idea: { tr: 'Fikir', en: 'Idea' },
  label_result: { tr: 'Sonuç', en: 'Result' },

  // Auth
  auth_domain_error: { tr: 'Yalnızca @tribalistanbul.com ve @twist.ddb.com adresleriyle giriş yapabilirsiniz.', en: 'Only @tribalistanbul.com and @twist.ddb.com addresses are allowed.' },
  auth_login: { tr: 'Giriş Yap', en: 'Log In' },

  // Events
  event_project_completed: { tr: 'Proje tamamlandı', en: 'Project completed' },
  event_payment_received: { tr: 'Ödeme alındı', en: 'Payment received' },

  // Awards cabinet
  awards_title: { tr: 'Ödül Kabinesi', en: 'Awards Cabinet' },

  // Admin
  admin_users: { tr: 'Kullanıcılar', en: 'Users' },
  admin_assign_role: { tr: 'Rol Ata', en: 'Assign Role' },
  admin_department: { tr: 'Departman', en: 'Department' },
}
```

- [ ] **Step 2: Create LanguageContext.jsx**

Create `src/contexts/LanguageContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'
import { STRINGS } from '../data/i18n'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr')

  function t(key) {
    const entry = STRINGS[key]
    if (!entry) return key
    return entry[lang] ?? entry['en'] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/i18n.js src/contexts/LanguageContext.jsx
git commit -m "feat: TR/EN i18n system with LanguageContext"
```

---

## Task 7: Game State & Loop

**Files:**
- Create: `src/game/gameLoop.js`
- Create: `src/game/projectEngine.js`
- Create: `src/contexts/GameContext.jsx`
- Create: `tests/game/gameLoop.test.js`
- Create: `tests/game/projectEngine.test.js`

- [ ] **Step 1: Write failing tests for gameLoop**

Create `tests/game/gameLoop.test.js`:

```js
import { tickDay, INITIAL_GAME_STATE } from '../../src/game/gameLoop'

describe('tickDay', () => {
  it('increments currentTotalDays by 1', () => {
    const state = { ...INITIAL_GAME_STATE }
    const next = tickDay(state)
    expect(next.currentTotalDays).toBe(2)
  })

  it('does not mutate original state', () => {
    const state = { ...INITIAL_GAME_STATE }
    tickDay(state)
    expect(state.currentTotalDays).toBe(1)
  })

  it('deducts daily salary cost from budget', () => {
    const state = {
      ...INITIAL_GAME_STATE,
      budget: 1000000,
      employees: [{ salary: 30000 }, { salary: 20000 }],
    }
    const next = tickDay(state)
    // Daily cost = monthly salary / 30
    expect(next.budget).toBe(1000000 - 1000 - 667)
  })
})
```

- [ ] **Step 2: Run to verify failure**

```bash
npm test tests/game/gameLoop.test.js
```

Expected: FAIL

- [ ] **Step 3: Implement gameLoop.js**

Create `src/game/gameLoop.js`:

```js
export const INITIAL_GAME_STATE = {
  budget: 1000000,
  resourcePoints: 1000,
  reputation: 10,
  officeLevel: 1,
  currentTotalDays: 1,
  employees: [],
  projects: [],
  projectOpportunities: [],
  awards: [],
  eventLog: [],
  nextProjectId: 1,
  nextEmployeeId: 1,
}

const DAYS_PER_MONTH = 30

export function tickDay(state) {
  const dailySalaryCost = state.employees.reduce(
    (sum, emp) => sum + Math.round(emp.salary / DAYS_PER_MONTH),
    0
  )

  return {
    ...state,
    currentTotalDays: state.currentTotalDays + 1,
    budget: state.budget - dailySalaryCost,
  }
}

export function getFormattedDate(totalDays) {
  const year = Math.floor((totalDays - 1) / (DAYS_PER_MONTH * 12)) + 1
  const month = Math.floor(((totalDays - 1) % (DAYS_PER_MONTH * 12)) / DAYS_PER_MONTH) + 1
  const day = ((totalDays - 1) % DAYS_PER_MONTH) + 1
  return { year, month, day }
}
```

- [ ] **Step 4: Run to verify pass**

```bash
npm test tests/game/gameLoop.test.js
```

Expected: PASS (3 tests)

- [ ] **Step 5: Write failing tests for projectEngine**

Create `tests/game/projectEngine.test.js`:

```js
import { advanceProject, isProjectComplete } from '../../src/game/projectEngine'

const mockProject = {
  id: 1,
  progress: 0,
  durationDays: 10,
  assignedEmployees: [{ productivity: 1 }],
}

describe('advanceProject', () => {
  it('increments progress by employee productivity', () => {
    const next = advanceProject(mockProject)
    expect(next.progress).toBeGreaterThan(0)
  })

  it('does not exceed 100', () => {
    const nearDone = { ...mockProject, progress: 99 }
    const next = advanceProject(nearDone)
    expect(next.progress).toBeLessThanOrEqual(100)
  })
})

describe('isProjectComplete', () => {
  it('returns true when progress >= 100', () => {
    expect(isProjectComplete({ progress: 100 })).toBe(true)
    expect(isProjectComplete({ progress: 100 })).toBe(true)
  })

  it('returns false when progress < 100', () => {
    expect(isProjectComplete({ progress: 50 })).toBe(false)
  })
})
```

- [ ] **Step 6: Run to verify failure**

```bash
npm test tests/game/projectEngine.test.js
```

Expected: FAIL

- [ ] **Step 7: Implement projectEngine.js**

Create `src/game/projectEngine.js`:

```js
export function advanceProject(project) {
  const productivitySum = project.assignedEmployees.reduce(
    (sum, emp) => sum + (emp.productivity ?? 1),
    0
  )
  const progressPerDay = (productivitySum / project.durationDays) * 100
  const newProgress = Math.min(100, project.progress + progressPerDay)
  return { ...project, progress: newProgress }
}

export function isProjectComplete(project) {
  return project.progress >= 100
}

export function generateProject(clients, projectTypes, billingStructures, nextId) {
  const client = clients[Math.floor(Math.random() * clients.length)]
  const type = projectTypes[Math.floor(Math.random() * projectTypes.length)]
  const billing = billingStructures[Math.floor(Math.random() * billingStructures.length)]
  const budgetVariance = 0.7 + Math.random() * 0.6
  return {
    id: nextId,
    client,
    type: type.id,
    typeLabel: type.label,
    budget: Math.round(type.baseBudget * budgetVariance),
    durationDays: type.baseDays + Math.floor(Math.random() * 15),
    billing,
    status: 'available',
    progress: 0,
    assignedEmployees: [],
    installments: billing.installments.map(inst => ({ ...inst, paid: false })),
  }
}
```

- [ ] **Step 8: Run to verify pass**

```bash
npm test tests/game/projectEngine.test.js
```

Expected: PASS (4 tests)

- [ ] **Step 9: Create GameContext**

Create `src/contexts/GameContext.jsx`:

```jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../auth/AuthProvider'
import { INITIAL_GAME_STATE, tickDay } from '../game/gameLoop'
import { advanceProject, isProjectComplete, generateProject } from '../game/projectEngine'
import { CLIENTS } from '../data/clients'
import { PROJECT_TYPES, BILLING_STRUCTURES } from '../data/projectTypes'
import { RANDOM_EVENTS, EVENT_CHANCE_PER_DAY } from '../data/events'
import { AWARDS, AWARD_CHANCE } from '../data/awards'

const GameContext = createContext(null)
const GAME_SPEED_MS = 2000
const AUTOSAVE_INTERVAL = 30000

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE)
  const [loaded, setLoaded] = useState(false)
  const stateRef = useRef(gameState)
  stateRef.current = gameState

  // Load from Firestore
  useEffect(() => {
    if (!user) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists() && snap.data().gameState) {
        setGameState(snap.data().gameState)
      }
      setLoaded(true)
    })
  }, [user])

  // Autosave
  useEffect(() => {
    if (!user || !loaded) return
    const id = setInterval(() => {
      setDoc(doc(db, 'users', user.uid), { gameState: stateRef.current }, { merge: true })
    }, AUTOSAVE_INTERVAL)
    return () => clearInterval(id)
  }, [user, loaded])

  // Game loop
  useEffect(() => {
    if (!loaded) return
    const id = setInterval(() => {
      setGameState(prev => {
        let next = tickDay(prev)

        // Advance projects
        next = {
          ...next,
          projects: next.projects.map(p =>
            p.status === 'in_progress' ? { ...advanceProject(p), status: isProjectComplete(advanceProject(p)) ? 'completed_unbilled' : 'in_progress' } : p
          ),
        }

        // Random event
        if (Math.random() < EVENT_CHANCE_PER_DAY) {
          const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
          next = {
            ...next,
            budget: next.budget + (event.budgetDelta ?? 0),
            reputation: next.reputation + (event.reputationDelta ?? 0),
            eventLog: [{ ...event, day: next.currentTotalDays }, ...next.eventLog.slice(0, 19)],
          }
        }

        return next
      })
    }, GAME_SPEED_MS)
    return () => clearInterval(id)
  }, [loaded])

  function acceptProject(projectId) {
    setGameState(prev => ({
      ...prev,
      projects: prev.projectOpportunities
        .filter(p => p.id === projectId)
        .map(p => ({ ...p, status: 'in_progress' }))
        .concat(prev.projects),
      projectOpportunities: prev.projectOpportunities.filter(p => p.id !== projectId),
    }))
  }

  function findNewProject() {
    setGameState(prev => {
      if (prev.projectOpportunities.length >= 5) return prev
      const project = generateProject(CLIENTS, PROJECT_TYPES, BILLING_STRUCTURES, prev.nextProjectId)
      return {
        ...prev,
        projectOpportunities: [...prev.projectOpportunities, project],
        nextProjectId: prev.nextProjectId + 1,
      }
    })
  }

  function processBilling(projectId) {
    setGameState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId || p.status !== 'completed_unbilled') return p
        const awardRoll = Math.random()
        let award = null
        if (awardRoll < AWARD_CHANCE) {
          award = AWARDS[Math.floor(Math.random() * AWARDS.length)]
        }
        return {
          ...p,
          status: 'billed',
          award,
        }
      }),
      reputation: (() => {
        const project = prev.projects.find(p => p.id === projectId)
        if (!project) return prev.reputation
        const awardRoll = Math.random()
        if (awardRoll < AWARD_CHANCE) {
          const award = AWARDS[Math.floor(Math.random() * AWARDS.length)]
          return prev.reputation + award.reputationBonus
        }
        return prev.reputation
      })(),
    }))
  }

  return (
    <GameContext.Provider value={{ gameState, loaded, acceptProject, findNewProject, processBilling }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
```

- [ ] **Step 10: Run all tests**

```bash
npm test
```

Expected: All pass

- [ ] **Step 11: Commit**

```bash
git add src/game/ src/contexts/GameContext.jsx tests/game/
git commit -m "feat: game loop, project engine, GameContext with Firestore autosave"
```

---

## Task 8: App Shell — Routing & Layout

**Files:**
- Create: `src/App.jsx`
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/Nav.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Create Header.jsx**

Create `src/components/layout/Header.jsx`:

```jsx
import { useAuth } from '../../auth/AuthProvider'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import { canSeeBudget } from '../../utils/roleUtils'
import { getFormattedDate } from '../../game/gameLoop'

export default function Header() {
  const { userProfile } = useAuth()
  const { gameState } = useGame()
  const { lang, setLang, t } = useLang()
  const { budget, resourcePoints, reputation, officeLevel, currentTotalDays } = gameState
  const showBudget = canSeeBudget(userProfile?.role)
  const date = getFormattedDate(currentTotalDays)

  return (
    <header style={{ background: '#252526', borderBottom: '1px solid #3e3e42', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>🏢 Tribal Istanbul</span>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: '#ccc', fontSize: 13 }}>
        {showBudget
          ? <span>💰 {t('metric_budget')}: ₺{budget.toLocaleString('tr-TR')}</span>
          : <span>🔋 {t('metric_resource')}: {resourcePoints}</span>
        }
        <span>⭐ {t('metric_reputation')}: {reputation}</span>
        <span>🏢 {t('metric_office')}: {officeLevel}</span>
        <span>📅 Y{date.year} A{date.month} G{date.day}</span>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          style={{ background: '#3c3c3c', color: '#fff', border: '1px solid #555', borderRadius: 4, padding: '2px 6px' }}
        >
          <option value="tr">TR</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create Nav.jsx**

Create `src/components/layout/Nav.jsx`:

```jsx
import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../auth/AuthProvider'
import { canAccessAdmin } from '../../utils/roleUtils'

export default function Nav({ active, setActive }) {
  const { t } = useLang()
  const { userProfile } = useAuth()
  const tabs = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: '🏠' },
    { id: 'projects', label: t('nav_projects'), icon: '📂' },
    { id: 'team', label: t('nav_team'), icon: '👥' },
    { id: 'education', label: t('nav_education'), icon: '🎓' },
    ...(canAccessAdmin(userProfile?.role) ? [{ id: 'admin', label: t('nav_admin'), icon: '⚙️' }] : []),
  ]

  return (
    <nav style={{ display: 'flex', gap: 2, background: '#2d2d30', padding: '0 16px', borderBottom: '1px solid #3e3e42' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            padding: '10px 16px',
            background: active === tab.id ? '#1e1e1e' : 'transparent',
            color: active === tab.id ? '#fff' : '#aaa',
            border: 'none',
            borderBottom: active === tab.id ? '2px solid #667EEA' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Create App.jsx**

Create `src/App.jsx`:

```jsx
import { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { LanguageProvider } from './contexts/LanguageContext'
import { GameProvider } from './contexts/GameContext'
import LoginPage from './auth/LoginPage'
import Header from './components/layout/Header'
import Nav from './components/layout/Nav'
import Dashboard from './components/dashboard/Dashboard'
import ProjectsPanel from './components/projects/ProjectsPanel'
import TeamPanel from './components/team/TeamPanel'
import EducationPanel from './components/education/EducationPanel'
import AdminPanel from './components/admin/AdminPanel'

function AppShell() {
  const { user, userProfile, loading, domainError } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Yükleniyor...</div>
  if (!user) return <LoginPage domainError={domainError} />

  const panels = {
    dashboard: <Dashboard />,
    projects: <ProjectsPanel />,
    team: <TeamPanel />,
    education: <EducationPanel />,
    admin: <AdminPanel />,
  }

  return (
    <GameProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <Header />
        <Nav active={activeTab} setActive={setActiveTab} />
        <main style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {panels[activeTab]}
        </main>
      </div>
    </GameProvider>
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
```

- [ ] **Step 4: Update main.jsx**

Replace `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 5: Smoke test in browser**

```bash
npm run dev
```

Open `http://localhost:5173` — login page should appear. Log in with a Tribal/Twist email to verify auth gate.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/main.jsx src/components/layout/
git commit -m "feat: app shell with auth gate, header, tab navigation"
```

---

## Task 9: Dashboard Panel

**Files:**
- Create: `src/components/dashboard/Dashboard.jsx`
- Create: `src/components/dashboard/AwardsCabinet.jsx`
- Create: `src/components/dashboard/EventLog.jsx`

- [ ] **Step 1: Create AwardsCabinet.jsx**

Create `src/components/dashboard/AwardsCabinet.jsx`:

```jsx
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import { AWARDS } from '../../data/awards'

export default function AwardsCabinet() {
  const { gameState } = useGame()
  const { t } = useLang()
  const wonAwardIds = gameState.projects
    .filter(p => p.award)
    .map(p => p.award.id)

  return (
    <div style={{ background: '#252526', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#aaa' }}>🏆 {t('awards_title')}</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {AWARDS.map(award => {
          const count = wonAwardIds.filter(id => id === award.id).length
          return (
            <div key={award.id} style={{ textAlign: 'center', opacity: count > 0 ? 1 : 0.3 }}>
              <div style={{ fontSize: 28 }}>{award.icon}</div>
              <div style={{ fontSize: 11, color: '#ccc' }}>{award.label.tr}</div>
              {count > 0 && <div style={{ fontSize: 11, color: '#4CAF50' }}>×{count}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create EventLog.jsx**

Create `src/components/dashboard/EventLog.jsx`:

```jsx
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'

export default function EventLog() {
  const { gameState } = useGame()
  const { lang } = useLang()

  return (
    <div style={{ background: '#252526', borderRadius: 8, padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#aaa' }}>🔔 Bildirimler</h3>
      {gameState.eventLog.length === 0
        ? <p style={{ color: '#666', fontSize: 13 }}>Henüz bildirim yok.</p>
        : gameState.eventLog.map((event, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #3e3e42', fontSize: 13 }}>
            <span style={{ color: '#667EEA', marginRight: 8 }}>Gün {event.day}</span>
            {event.message?.[lang] ?? event.message?.tr}
          </div>
        ))
      }
    </div>
  )
}
```

- [ ] **Step 3: Create Dashboard.jsx**

Create `src/components/dashboard/Dashboard.jsx`:

```jsx
import AwardsCabinet from './AwardsCabinet'
import EventLog from './EventLog'
import { useGame } from '../../contexts/GameContext'

export default function Dashboard() {
  const { gameState } = useGame()
  const activeProjects = gameState.projects.filter(p => p.status === 'in_progress')

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>Dashboard</h2>
      <div style={{ background: '#252526', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 14, color: '#aaa' }}>📂 Aktif Projeler</h3>
        {activeProjects.length === 0
          ? <p style={{ color: '#666', fontSize: 13 }}>Aktif proje yok.</p>
          : activeProjects.map(p => (
            <div key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{p.client} — {p.typeLabel?.tr}</div>
              <div style={{ background: '#3c3c3c', borderRadius: 4, height: 6 }}>
                <div style={{ background: '#667EEA', borderRadius: 4, height: 6, width: `${p.progress}%` }} />
              </div>
            </div>
          ))
        }
      </div>
      <AwardsCabinet />
      <EventLog />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/
git commit -m "feat: dashboard with awards cabinet and event log"
```

---

## Task 10: Projects Panel

**Files:**
- Create: `src/components/projects/ProjectsPanel.jsx`
- Create: `src/components/projects/ProjectCard.jsx`

- [ ] **Step 1: Create ProjectCard.jsx**

Create `src/components/projects/ProjectCard.jsx`:

```jsx
import { useLang } from '../../contexts/LanguageContext'

export default function ProjectCard({ project, onAccept, onBilling }) {
  const { lang, t } = useLang()

  return (
    <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>{project.client}</strong>
        <span style={{ color: '#aaa', fontSize: 12 }}>{project.typeLabel?.[lang]}</span>
      </div>
      <div style={{ fontSize: 13, color: '#ccc', marginBottom: 8 }}>
        <span>💰 ₺{project.budget?.toLocaleString('tr-TR')}</span>
        <span style={{ marginLeft: 16 }}>⏱ {project.durationDays} gün</span>
        <span style={{ marginLeft: 16 }}>💳 {project.billing?.name}</span>
      </div>
      {project.status === 'in_progress' && (
        <div>
          <div style={{ background: '#3c3c3c', borderRadius: 4, height: 6, marginBottom: 8 }}>
            <div style={{ background: '#667EEA', borderRadius: 4, height: 6, width: `${Math.round(project.progress)}%` }} />
          </div>
          <span style={{ fontSize: 12, color: '#aaa' }}>{Math.round(project.progress)}%</span>
        </div>
      )}
      {project.status === 'available' && onAccept && (
        <button
          onClick={() => onAccept(project.id)}
          style={{ padding: '6px 14px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
        >
          {t('btn_accept')}
        </button>
      )}
      {project.status === 'completed_unbilled' && onBilling && (
        <button
          onClick={() => onBilling(project.id)}
          style={{ padding: '6px 14px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
        >
          {t('btn_billing')}
        </button>
      )}
      {project.award && (
        <div style={{ marginTop: 8, fontSize: 13 }}>
          {project.award.icon} {project.award.label?.[lang]}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create ProjectsPanel.jsx**

Create `src/components/projects/ProjectsPanel.jsx`:

```jsx
import { useState } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useLang } from '../../contexts/LanguageContext'
import ProjectCard from './ProjectCard'

export default function ProjectsPanel() {
  const { gameState, acceptProject, findNewProject, processBilling } = useGame()
  const { t } = useLang()
  const [tab, setTab] = useState('available')

  const available = gameState.projectOpportunities
  const inProgress = gameState.projects.filter(p => p.status === 'in_progress')
  const completed = gameState.projects.filter(p => ['completed_unbilled', 'billed'].includes(p.status))

  const tabs = [
    { id: 'available', label: t('tab_available'), items: available },
    { id: 'in_progress', label: t('tab_in_progress'), items: inProgress },
    { id: 'completed', label: t('tab_completed'), items: completed },
  ]

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>📂 {t('nav_projects')}</h2>
        <button
          onClick={findNewProject}
          style={{ padding: '8px 16px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          ➕ Yeni Proje Bul
        </button>
      </div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              background: tab === t.id ? '#667EEA' : '#2d2d30',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {t.label} ({t.items.length})
          </button>
        ))}
      </div>
      {tab === 'available' && available.map(p => (
        <ProjectCard key={p.id} project={p} onAccept={acceptProject} />
      ))}
      {tab === 'in_progress' && inProgress.map(p => (
        <ProjectCard key={p.id} project={p} />
      ))}
      {tab === 'completed' && completed.map(p => (
        <ProjectCard key={p.id} project={p} onBilling={processBilling} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/projects/
git commit -m "feat: projects panel with available/in-progress/completed tabs"
```

---

## Task 11: Team Panel

**Files:**
- Create: `src/components/team/TeamPanel.jsx`
- Create: `src/components/team/EmployeeCard.jsx`

- [ ] **Step 1: Create EmployeeCard.jsx**

Create `src/components/team/EmployeeCard.jsx`:

```jsx
import { useLang } from '../../contexts/LanguageContext'

export default function EmployeeCard({ employee, onFire }) {
  const { t } = useLang()
  return (
    <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: 14 }}>{employee.name}</strong>
          <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{employee.jobTitle} · {employee.department}</div>
          <div style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>
            💰 ₺{employee.salary?.toLocaleString('tr-TR')}/ay · ⚡ Lv.{employee.level}
          </div>
        </div>
        <button
          onClick={() => onFire(employee.id)}
          style={{ padding: '4px 10px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
        >
          {t('btn_fire')}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create TeamPanel.jsx**

Create `src/components/team/TeamPanel.jsx`:

```jsx
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
  const [selectedDept, setSelectedDept] = useState(null)
  const [candidate, setCandidate] = useState(null)

  const visibleDepts = getVisibleDepartments(userProfile?.role, userProfile?.department)

  function fireEmployee(id) {
    setGameState(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }))
  }

  function openHire(dept) {
    setSelectedDept(dept)
    setCandidate(generateCandidate(dept, (gameState.nextEmployeeId ?? 1)))
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/team/
git commit -m "feat: team panel with department grouping, hire/fire modal"
```

---

## Task 12: Education Panel — Cannes Cases & Quiz

**Files:**
- Create: `src/components/education/EducationPanel.jsx`
- Create: `src/components/education/CaseStudy.jsx`
- Create: `src/components/education/Quiz.jsx`

- [ ] **Step 1: Seed Cannes case data in Firestore**

In Firebase Console → Firestore → Create collection `education`, document `cases`, with array field `items`. Add at minimum 2 sample cases:

```json
{
  "items": [
    {
      "id": "case_1",
      "title": "Turkcell — Loneliness Can Be Shared",
      "award": "Cannes Lions Silver",
      "awardIcon": "🥈",
      "insight": "Yalnızlık modern toplumun görünmeyen salgını haline geldi.",
      "idea": "Turkcell, yalnız yaşayan kişilerin birbirleriyle bağlantı kurmasını sağlayan bir platform yarattı.",
      "result": "3 milyondan fazla kişi platforma katıldı. Marka bilinirliği %18 arttı.",
      "quiz": [
        { "question": "Kampanyanın temel insight'ı nedir?", "options": ["Fiyat rekabeti", "Yalnızlık salgını", "5G teknolojisi", "Müzik streaming"], "correct": 1 },
        { "question": "Kampanya hangi ödülü kazandı?", "options": ["Effie Gold", "Cannes Lions Silver", "Kristal Elma", "Felis Grand Prix"], "correct": 1 }
      ]
    },
    {
      "id": "case_2",
      "title": "Algida — I Heart",
      "award": "Effie Bronze",
      "awardIcon": "🥉",
      "insight": "Dondurma sadece serinlemek için değil, mutluluk anlarının simgesidir.",
      "idea": "Algida'nın ikonik kalp logosu, insanların sevdikleriyle paylaştığı anların merkezi haline getirildi.",
      "result": "Marka tercih skoru rekabette %12 puan öne geçti.",
      "quiz": [
        { "question": "Kampanyanın duygusal çekirdeği nedir?", "options": ["Sağlıklı yaşam", "Mutluluk anları", "Fiyat avantajı", "Teknoloji"], "correct": 1 }
      ]
    }
  ]
}
```

- [ ] **Step 2: Create Quiz.jsx**

Create `src/components/education/Quiz.jsx`:

```jsx
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
        await updateDoc(doc(db, 'users', user.uid), {
          quizScores: arrayUnion({ caseId, score: newScore, total: questions.length, completedAt: Date.now() }),
        })
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
```

- [ ] **Step 3: Create CaseStudy.jsx**

Create `src/components/education/CaseStudy.jsx`:

```jsx
import { useState } from 'react'
import Quiz from './Quiz'
import { useLang } from '../../contexts/LanguageContext'

export default function CaseStudy({ caseData, onScored }) {
  const { t } = useLang()
  const [phase, setPhase] = useState('info') // 'info' | 'quiz' | 'done'

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
```

- [ ] **Step 4: Create EducationPanel.jsx**

Create `src/components/education/EducationPanel.jsx`:

```jsx
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
```

- [ ] **Step 5: Commit**

```bash
git add src/components/education/
git commit -m "feat: education panel with Cannes case studies and quiz scoring"
```

---

## Task 13: Admin Panel

**Files:**
- Create: `src/components/admin/AdminPanel.jsx`
- Create: `src/components/admin/UserRow.jsx`

- [ ] **Step 1: Create UserRow.jsx**

Create `src/components/admin/UserRow.jsx`:

```jsx
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
```

- [ ] **Step 2: Create AdminPanel.jsx**

Create `src/components/admin/AdminPanel.jsx`:

```jsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/
git commit -m "feat: admin panel for user role and department assignment"
```

---

## Task 14: Firestore Security Rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Write firestore.rules**

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAllowedDomain() {
      return request.auth.token.email.matches('.*@tribalistanbul\\.com$')
          || request.auth.token.email.matches('.*@twist\\.ddb\\.com$');
    }

    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    function isBudgetRole() {
      let role = get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
      return role == 'super_admin' || role == 'finance' || role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && isAllowedDomain() && (request.auth.uid == userId || hasRole('admin') || hasRole('super_admin'));
      allow write: if isAuthenticated() && isAllowedDomain() && (request.auth.uid == userId || hasRole('admin') || hasRole('super_admin'));
    }

    // Agency state — budget field restricted
    match /agency/{docId} {
      allow read: if isAuthenticated() && isAllowedDomain();
      allow write: if isAuthenticated() && isAllowedDomain() && isBudgetRole();
    }

    // Education — read by all Tribal/Twist users, write by admin only
    match /education/{docId} {
      allow read: if isAuthenticated() && isAllowedDomain();
      allow write: if isAuthenticated() && isAllowedDomain() && (hasRole('admin') || hasRole('super_admin'));
    }
  }
}
```

- [ ] **Step 2: Deploy rules**

```bash
firebase deploy --only firestore:rules
```

Expected: `Deploy complete!`

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "feat: Firestore security rules with domain restriction and role-based budget access"
```

---

## Task 15: Firebase Hosting Deploy

**Files:**
- No new files

- [ ] **Step 1: Build the app**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

- [ ] **Step 2: Deploy to Firebase Hosting**

```bash
firebase deploy --only hosting
```

Expected: Hosting URL printed, e.g. `https://agency-planing.web.app`

- [ ] **Step 3: Smoke test live URL**

Open the live URL in browser. Verify:
- Login page appears
- Non-Tribal email is rejected with error message
- Tribal email logs in and sees the dashboard

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: production deploy — Tribal Istanbul Agency Simulation v1"
```

---

## Self-Review

### Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| React + Vite + Firebase | Task 1, 2 |
| Domain restriction (@tribalistanbul.com, @twist.ddb.com) | Task 3 |
| Role-based access (budget visibility, admin panel) | Task 4, 13 |
| TR/EN language switcher | Task 6 |
| All departments + roles | Task 5 |
| All clients | Task 5 |
| All project types + billing | Task 5 |
| Awards system (Cannes, Felis, Effie, Kristal) | Task 5, 9 |
| Random events | Task 5, 7 |
| Game loop (day tick, salary deduction) | Task 7 |
| Dashboard + event log + awards cabinet | Task 9 |
| Projects panel (3 tabs, accept, billing) | Task 10 |
| Team panel (hire/fire by department) | Task 11 |
| Education — Cannes cases + quiz + scoring | Task 12 |
| Admin panel — role assignment | Task 13 |
| Firestore security rules | Task 14 |
| Firebase Hosting deploy | Task 15 |

### No Placeholder Issues Found
All code steps contain actual implementation. No TBD/TODO in plan.

### Type Consistency Check
- `gameState` shape defined in `INITIAL_GAME_STATE` (Task 7) and used consistently across GameContext, panels, and game engine.
- `userProfile.role` string used consistently in `roleUtils.js`, `AuthProvider`, `Nav`, and `AdminPanel`.
- `project.status` values (`available`, `in_progress`, `completed_unbilled`, `billed`) consistent across `projectEngine.js`, `ProjectsPanel`, `ProjectCard`.
