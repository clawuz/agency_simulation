# Tribal İlham Arşivi — Design Spec
**Date:** 2026-03-28
**Author:** Ömer Kılavuz (Group Brand Director, Tribal Worldwide Istanbul)
**Replaces:** Agency Simulation (Projeler + Ekip sekmeleri kaldırılıyor)

---

## Genel Bakış

Tribal Istanbul'un kurumsal ödül belleği ve ilham arşivi. Netflix benzeri premium bir keşif deneyimi. Çalışanlar ödüllü reklam işlerini keşfeder, insight/fikir/execution/sonuç detaylarına ulaşır, label/kategori bazlı arama yapar.

**Kapsam dışı:** Quiz, puan sistemi, oyun mekaniği (tamamen kaldırılıyor)
**Korunanlar:** Dashboard (yeniden tasarlanmış), Eğitim→Arşiv (tamamen yeniden), Admin paneli

**Diller:** TR / EN — runtime'da toggle

---

## Renk & Tipografi Sistemi

### Renkler
```
--bg-base:       #0A0A0A   /* derin siyah — tüm arka plan */
--bg-card:       #111111   /* kart yüzeyi */
--bg-elevated:   #1A1A1A   /* modal, dropdown */
--bg-hover:      #222222   /* hover state */

--orange:        #FF6B2B   /* ana aksan — CTA, hover glow, rozetler */
--gold:          #E8B84B   /* Grand Prix, featured, hero */
--yellow:        #FFD166   /* label etiketleri, secondary accent */

--text-primary:  #FFFFFF
--text-secondary:#A0A0A0
--text-muted:    #555555

--border:        #1E1E1E
--border-light:  #2A2A2A
```

### Tipografi
- Font: `Inter` (Google Fonts) — yükleme: `font-display: swap`
- Hero başlık: 52px, weight 800, letter-spacing -1.5px
- Kart başlık: 15px, weight 600
- Label: 11px, weight 700, letter-spacing 0.08em, UPPERCASE
- Body: 14px, weight 400, line-height 1.7

### Tasarım Prensipleri
- **Spacing:** 4px grid (8, 12, 16, 24, 32, 48, 64px)
- **Border radius:** Kartlar 10px, butonlar 6px, badge'ler 20px (pill)
- **Shadows:** `0 0 40px rgba(255,107,43,0.15)` — orange glow on hover
- **Transitions:** `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover kart:** `transform: scale(1.03)` + orange glow border
- **Hiçbir şey generic görünmemeli** — her element özenle typography ve spacing ile işlenmiş

---

## Navigation

```
[🏢 Tribal İlham Arşivi]          [TR | EN]  [kullanıcı avatar]
──────────────────────────────────────────────────────────────
  🏠 Ana Sayfa   🏆 Arşiv   ⚙️ Admin (sadece admin/super_admin)
```

- Header: `position: sticky`, `backdrop-filter: blur(20px)`, `background: rgba(10,10,10,0.9)`
- Logo: bold, turuncu nokta ile `Tribal ●` formatı
- Nav item aktif: alt çizgi, orange renk

---

## Ekran 1: Ana Sayfa (Dashboard)

### Hero Bölümü
Ekranın üst %45'i. Öne çıkan iş (en son eklenen Grand Prix veya editoryal seçim).

```
┌────────────────────────────────────────────────────────────┐
│  [Blurred/gradient campaign visual — full width]            │
│                                                             │
│  🏆 CANNES LIONS · GRAND PRIX · FILM · 2025                │  ← small caps, gold
│                                                             │
│  Kampanya Adı                                               │  ← 52px bold
│  Marka · Ajans · Yıl                                       │  ← secondary text
│                                                             │
│  [● İncele]   [+ Kaydet]                                    │  ← buttons
│                                                             │
│                                          ◀ ▶ ● ○ ○ ○       │  ← dots/nav
└────────────────────────────────────────────────────────────┘
```

- Arka plan: kampanya görseli blur + `linear-gradient(to right, #0A0A0A 40%, transparent 100%)`
- Fallback: `linear-gradient(135deg, #1A0F00 0%, #0A0A0A 100%)`
- "İncele" butonu: `background: #FF6B2B`, border-radius 6px, padding 12px 24px, font-weight 700
- Hero 5-6 iş arasında otomatik rotate (5sn), nokta navigasyonu

### Kategori Satırları (Netflix-style)
Her satır:
```
Cannes Lions 2025 Grand Prix                              Tümünü Gör →
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │ │      │ │      │ │      │
│      │ │      │ │      │ │      │ │      │ │      │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
◀                                                     ▶
```

Sabit satır sırası:
1. 🦁 **Cannes Lions 2025** — Grand Prix Kazananları
2. 🦁 **Cannes Lions 2024** — Grand Prix Kazananları
3. 🏆 **Felis 2025** — Büyük Ödüller
4. 🏆 **Felis 2024** — Büyük Ödüller
5. 🍎 **Kristal Elma 2024**
6. 📊 **Effie Kazananları**
7. 🇹🇷 **Türkiye'den İşler** (tüm Türk ajansları)

### Kart Tasarımı
```
┌─────────────────────┐
│                     │  ← 16:9 görsel (imageUrl) veya gradient fallback
│   [görsel/gradient] │
│                     │
├─────────────────────┤
│ 🏆 Grand Prix  2025 │  ← gold badge + yıl, 11px
│ Kampanya Adı        │  ← 14px bold, max 2 satır
│ Marka · Ajans       │  ← 12px muted
│ [Film] [Social]     │  ← sarı label pill'ler, max 2
└─────────────────────┘
```

- Kart width: ~220px, hover: `scale(1.04)` + `box-shadow: 0 0 30px rgba(255,107,43,0.2)`
- Gradient fallback: her yarışmanın rengi — Cannes: `#1A0A00→#0A0A0A`, Felis: `#0A001A→#0A0A0A`

---

## Ekran 2: Arşiv

### Üst Bölüm — Arama & Filtreler

```
┌─────────────────────────────────────────┐
│ 🔍  Marka, ajans veya kampanya ara...   │  ← tam genişlik, 16px
└─────────────────────────────────────────┘

Yarışma:
[Tümü] [Cannes Lions] [Felis] [Kristal Elma] [Effie]

Seviye:
[Grand Prix] [Gold] [Silver] [Bronze] [Shortlist]

Kategori:
[Film] [Dijital] [OOH] [PR] [Brand Experience] [Data/Tech]
[Social Cause] [Humor] [Inclusion] [Çevre] [Spor] [Müzik]

Yıl:
[2025] [2024] [2023]

Köken:
[Türkiye] [Global]
```

- Filtre grupları: bold başlık, altında tıklanabilir pill'ler
- Seçili pill: `background: #FF6B2B`, `color: #fff`
- Seçilmemiş: `background: #1A1A1A`, `border: 1px solid #2A2A2A`, `color: #A0A0A0`
- Birden fazla seçilebilir (OR filtresi aynı grup içinde, AND gruplar arası)
- "X sonuç" sayacı — filtreleme anlık (debounced)

### Grid
- 4 kolon (desktop), 2 kolon (tablet), 1 kolon (mobile)
- Aynı kart tasarımı — biraz daha büyük (width ~280px)

---

## Ekran 3: İş Detay Modalı

Kart tıklanınca full-screen modal açılır (`backdrop-filter: blur(8px)`).

```
┌──────────────────────────────────────────────────────────┐
│                                                    [✕]   │
│  ┌─────────────────────────────────┐  ┌──────────────┐   │
│  │                                 │  │ 🏆 CANNES    │   │
│  │   [Video embed veya görsel]     │  │ Grand Prix   │   │
│  │   16:9, full rounded corners    │  │ Film · 2025  │   │
│  │                                 │  │              │   │
│  └─────────────────────────────────┘  │ Kampanya Adı │   │
│                                       │              │   │
│                                       │ Marka        │   │
│                                       │ Ajans        │   │
│                                       │              │   │
│                                       │ [Film][Humor]│   │
│  ─────────────────────────────────────────────────── │   │
│                                                       │   │
│  🧠 Insight                                           │   │
│  Lorem ipsum insight text...                          │   │
│                                                       │   │
│  💡 Fikir                                             │   │
│  Lorem ipsum idea text...                             │   │
│                                                       │   │
│  🎬 Execution                                         │   │
│  Lorem ipsum execution text...                        │   │
│                                                       │   │
│  📊 Sonuç                                             │   │
│  Lorem ipsum result text...                           │   │
└──────────────────────────────────────────────────────────┘
```

- Layout: sol kolon video/görsel (%55), sağ kolon meta+etiketler (%40)
- Aşağıda: 4 section (insight, fikir, execution, sonuç) — tam genişlik
- Section başlıkları: emoji + bold, `border-bottom: 1px solid #1E1E1E`
- Video: YouTube/Vimeo embed, `border-radius: 10px`, `aspect-ratio: 16/9`
- Görsel yoksa: büyük gradient placeholder + ödül ikonu ortada
- ESC ile kapanır, dışına tıklayınca kapanır

---

## Firestore Veri Modeli

```
awards/{id}
  ├── title: string
  ├── brand: string
  ├── agency: string
  ├── year: number
  ├── competition: "Cannes Lions" | "Felis" | "Kristal Elma" | "Effie"
  ├── level: "Grand Prix" | "Gold" | "Silver" | "Bronze" | "Shortlist"
  ├── category: string           (Film, Digital, OOH, PR, vb.)
  ├── labels: string[]           (["Social Cause", "Humor", "Turkey", "2025", ...])
  ├── videoUrl: string | null    (YouTube/Vimeo URL)
  ├── imageUrl: string | null    (campaign visual URL)
  ├── createdAt: timestamp
  └── content: {
        tr: { insight, idea, execution, result }
        en: { insight, idea, execution, result }
      }
```

**İlk yükleme:** ~65 iş
- Cannes Lions 2025 Grand Prix: ~30
- Cannes Lions 2024 Grand Prix: ~30
- Felis 2024-2025 Grand Prix: ~10
- Kristal Elma 2024 Grand Prix: ~7
- Effie Europe 2025 Gold: ~5

---

## Dosya Yapısı (yeni/değişen)

```
src/
├── data/
│   └── i18n.js                    — güncellenir (yeni string'ler)
├── components/
│   ├── layout/
│   │   ├── Header.jsx             — güncellenir (yeni nav, logo)
│   │   └── Nav.jsx                — güncellenir (Arşiv, Projeler/Ekip kaldır)
│   ├── dashboard/
│   │   ├── Dashboard.jsx          — tamamen yeniden yazılır
│   │   ├── HeroBanner.jsx         — YENİ: rotating hero
│   │   └── CategoryRow.jsx        — YENİ: Netflix-style yatay scroll satırı
│   ├── archive/                   — YENİ klasör (education/ yerini alır)
│   │   ├── ArchivePanel.jsx       — YENİ: arama + filtreler + grid
│   │   ├── AwardCard.jsx          — YENİ: kart
│   │   └── AwardModal.jsx         — YENİ: detay modalı
│   └── admin/                     — mevcut, korunur
```

**Kaldırılanlar:**
- `src/components/projects/` — silinir
- `src/components/team/` — silinir
- `src/components/education/` — silinir (archive/ ile değiştirilir)
- `src/contexts/GameContext.jsx` — silinir
- `src/game/` — silinir
- `src/data/clients.js`, `projectTypes.js`, `events.js`, `awards.js` — silinir

**Korunanlar:**
- `src/auth/` — dokunulmaz
- `src/utils/roleUtils.js` — dokunulmaz
- `src/data/departments.js`, `i18n.js` — güncellenir
- `src/contexts/LanguageContext.jsx` — dokunulmaz
- `src/components/admin/` — korunur

---

## i18n — Yeni String'ler

```js
// Nav
nav_archive: { tr: 'Arşiv', en: 'Archive' }
nav_home: { tr: 'Ana Sayfa', en: 'Home' }

// Archive
archive_search_placeholder: { tr: 'Marka, ajans veya kampanya ara...', en: 'Search brand, agency or campaign...' }
archive_filter_all: { tr: 'Tümü', en: 'All' }
archive_results: { tr: 'sonuç', en: 'results' }
archive_no_results: { tr: 'Sonuç bulunamadı', en: 'No results found' }

// Detail modal sections
detail_insight: { tr: 'Insight', en: 'Insight' }
detail_idea: { tr: 'Fikir', en: 'Idea' }
detail_execution: { tr: 'Execution', en: 'Execution' }
detail_result: { tr: 'Sonuç', en: 'Result' }

// Levels
level_grand_prix: { tr: 'Büyük Ödül', en: 'Grand Prix' }
level_gold: { tr: 'Altın', en: 'Gold' }
level_silver: { tr: 'Gümüş', en: 'Silver' }
level_bronze: { tr: 'Bronz', en: 'Bronze' }

// Hero
hero_see: { tr: 'İncele', en: 'Explore' }
hero_all: { tr: 'Tümünü Gör', en: 'See All' }
```

---

## Firestore Güvenlik Kuralları (güncelleme)

`awards` koleksiyonu:
- Okuma: tüm authenticate + allowed domain kullanıcılar
- Yazma: sadece admin / super_admin

---

## Out of Scope (v2)
- Kullanıcı "favoriler" / kaydetme listesi
- Yorum/not ekleme
- İş bazında bildirim
