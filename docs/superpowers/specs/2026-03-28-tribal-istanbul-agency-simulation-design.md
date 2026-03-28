# Tribal Istanbul Agency Simulation — Design Spec
**Date:** 2026-03-28
**Author:** Ömer Kılavuz (Group Brand Director, Tribal Worldwide Istanbul)

---

## Overview

A web-based simulation and training tool inspired by the Agency Simulation VS Code extension (banyapon.agency-empire), fully customized for Tribal Worldwide Istanbul's culture, departments, clients, and "Unexpected Works" ethos.

**Purpose:** Onboarding for new employees, team building for internal teams, and agency culture education.

**Languages:** Turkish (TR) and English (EN) — switchable at runtime.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| State persistence | Firebase Firestore |
| Authentication | Firebase Auth (domain-restricted) |
| Hosting | Firebase Hosting |
| Project | agency-planing (ID: 933162635662) |

---

## Authentication & Authorization

### Domain Restriction
Only the following email domains are permitted:
- `@tribalistanbul.com`
- `@twist.ddb.com`

All other email domains are rejected at login with a clear error message.

### Role-Based Access Control

Each user has a `role` and `department` assigned by an admin via the Admin panel. Roles determine what content, metrics, and actions the user can see and perform.

| Role | Department | Special Access |
|---|---|---|
| `super_admin` | Üst Yönetim | Everything + budget (TL) |
| `finance` | Finans | Budget (TL) + financial reports |
| `creative` | Creative | Creative projects and tasks |
| `social_media` | Social Media | Social media projects and tasks |
| `strategy` | Strategy | Strategy projects and tasks |
| `digital` | Digital | Digital projects and tasks |
| `technology` | Technology | Technology projects and tasks |
| `account` | Account | Account projects and tasks |
| `production` | Production | Production projects and tasks |
| `hr` | İnsan Kaynakları | HR tasks and employee management view |
| `admin` | Any | Admin panel + role assignment |

### Budget Visibility
- **Üst Yönetim + Finans roles:** See actual budget in TL (💰 Bütçe)
- **All other roles:** See abstracted "Kaynak Puanı" (🔋 Resource Points) instead

---

## Departments & Roles

| Department | Roles |
|---|---|
| Üst Yönetim | Yönetici Ortak, Ajans Başkanı, CFO |
| Creative | ECD, Creative Director, Art Director, Copywriter, Motion Graphics |
| Social Media | Community Manager, Content Creator |
| Strategy | CSO, Brand Strategist, Data & Insight Analyst |
| Digital | Digital Campaign Manager, Web Developer |
| Technology | Tech Producer |
| Account | Account Director, Account Supervisor, Account Manager, Group Brand Director |
| Production | Production Head, Productor |
| İnsan Kaynakları | IK Director |
| Finans | CFO, Finans Uzmanı |

---

## Game Mechanics

### Header Metrics

| Metric | Visible To | Description |
|---|---|---|
| 💰 Bütçe (TL) | Üst Yönetim, Finans | Actual agency funds |
| 🔋 Kaynak Puanı | All other roles | Abstracted resource unit |
| ⭐ İtibar | Everyone | Reputation score (increases with awards) |
| 🏢 Ofis Seviyesi | Everyone | Office level (Apa Nef Plaza themed, 1–5) |
| 📅 Tarih | Everyone | In-game calendar date |

### Project Types
- 360° Entegre Kampanya
- Sosyal Medya Kampanyası
- TVC Prodüksiyon
- Dijital Kampanya
- Marka Kimliği & Brand Identity
- Experiential Aktivasyon
- Technology Production (AR/Interactive)
- OOH Kampanyası
- İçerik Prodüksiyonu

### Clients
Turkish Airlines, Algida, Dove, Audi, ING, Şok Marketler, IKSV, Findeks, Netflix, İş Bankası, Fiba Banka, AJET, Miles & Smiles, Turkish Cargo

### Billing Structures
- 1 taksit (100%)
- 2 taksit (50-50, 60-40, 70-30, 40-60, 30-70)
- 3 taksit (30-30-40)

### Awards System
Completed projects can win awards, boosting İtibar:

| Award | İtibar Bonus |
|---|---|
| 🥉 Effie Bronze | +5 |
| 🥈 Kristal Elma | +10 |
| 🦁 Cannes Lions Shortlist | +20 |
| 🏆 Cannes Lions | +50 |
| 🏆 Felis Yılın Ajansı | +100 |

### Random Events (Tribal-themed)
- "Cannes Lions shortlist'e girdiniz!"
- "Müşteri brief'i değiştirdi, baştan başlıyoruz"
- "Felis ödül gecesi — ekip motivasyonu zirve!"

### Game Loop
- Day/time progresses automatically (configurable speed)
- Projects advance based on assigned employees and their skill levels
- Daily salary costs deducted from budget
- Auto-save to Firestore every 30 seconds

---

## Screens & Navigation

```
🏠 Dashboard  |  📂 Projeler  |  👥 Ekip  |  🎓 Eğitim  |  ⚙️ Admin
```

### 1. Dashboard
- Header bar with all metrics (role-filtered)
- Active project summary
- Recent notifications / event log
- **Ödül Kabinesi:** Cannes Lions, Felis, Effie, Kristal Elma wins displayed

### 2. Projeler (Projects)
- 3 tabs: Mevcut (Available) / Devam Eden (In Progress) / Tamamlanan (Completed)
- Project cards: client, type, budget, timeline, billing structure
- Accept project → assigns to relevant department
- Role-filtered: users see projects relevant to their department

### 3. Ekip (Team)
- Listed by department
- Hire / fire / train employees
- Employee card: name, role, department, salary, skill level
- Admin and HR roles can manage all departments

### 4. Eğitim (Education)
Two sub-tabs:

**4a. Ödüllük Fikirler**
- Cannes Lions winning case studies (video/visual + description)
- Each case: strategy, insight, creative idea breakdown, result
- Format:
  ```
  📽 Case Name
  🏆 Award: Cannes Lions Gold / Grand Prix
  🧠 Insight: ...
  💡 Idea: ...
  📊 Result: ...
  [Watch] → [Start Quiz] → [Earn Points]
  ```
- After watching: 3–5 question mini quiz
- Correct answers → points added to user's İtibar score

**4b. Departman Eğitimleri** *(future expansion)*
- Department-specific training modules

### 5. Admin *(admin role only)*
- User list with current role/department
- Assign/change roles and departments
- Edit game parameters (speed, starting budget, event probabilities)

### Language Switcher
- TR / EN toggle in top-right corner
- Persists per user in Firestore

---

## Firestore Data Model

```
users/{uid}
  ├── email: string
  ├── role: string
  ├── department: string
  ├── language: "tr" | "en"
  ├── gameState:
  │   ├── resourcePoints: number      (non-finance view)
  │   ├── reputation: number
  │   ├── officeLevel: number
  │   └── currentTotalDays: number
  └── quizScores: [{ caseId, score, completedAt }]

agency/ (single document)
  ├── budget: number                  (TL, restricted read)
  ├── officeLevel: number
  ├── currentTotalDays: number
  ├── projects: []
  ├── employees: []
  ├── awards: []
  └── eventLog: []

education/
  ├── cases: [{ id, title, award, insight, idea, result, videoUrl, quiz[] }]
  └── completions: { uid → [caseId] }
```

### Firestore Security Rules
- `agency.budget` readable only by roles: `super_admin`, `finance`, `admin`
- `users/{uid}` writable only by the owner or `admin`
- `education/cases` readable by all authenticated Tribal/Twist users

---

## UI Style
- VS Code dark theme inspired (matching the original extension aesthetic)
- Tribal Istanbul brand colors and "Unexpected Works" tone
- Responsive: desktop-first (primary use case), mobile-compatible

---

## Out of Scope (v1)
- Real financial integrations
- Actual project management (this is simulation only)
- Push notifications
- Multiplayer real-time competition (future)
- Departman Eğitimleri content (structure only in v1)
