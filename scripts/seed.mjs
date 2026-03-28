/**
 * Tribal Istanbul Agency Simulation — Firestore Seed Script
 * Run: node scripts/seed.mjs
 */

import { initializeApp, cert, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Use application default credentials (Firebase CLI credentials)
process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: 'agency-planing' })

let app
try {
  app = getApp()
} catch {
  const { applicationDefault } = await import('firebase-admin/app')
  const { initializeApp: init } = await import('firebase-admin/app')
  app = init({ credential: applicationDefault(), projectId: 'agency-planing' })
}

const db = getFirestore(app)

// ─── Education Cases ───────────────────────────────────────────────────────────
const cases = [
  {
    id: 'case_1',
    title: 'Turkcell — Loneliness Can Be Shared',
    award: 'Cannes Lions Silver',
    awardIcon: '🥈',
    insight: 'Yalnızlık modern toplumun görünmeyen salgını haline geldi. Türkiye\'de milyonlarca insan sosyal izolasyon yaşıyor.',
    idea: 'Turkcell, yalnız yaşayan kişilerin birbirleriyle bağlantı kurmasını sağlayan ve onları topluluk etkinliklerine yönlendiren bir dijital platform yarattı.',
    result: '3 milyondan fazla kişi platforma katıldı. Marka bilinirliği %18 arttı. Cannes Lions Silver kazandı.',
    quiz: [
      {
        question: 'Kampanyanın temel insight\'ı nedir?',
        options: ['Fiyat rekabeti', 'Yalnızlık salgını', '5G teknolojisi', 'Müzik streaming'],
        correct: 1,
      },
      {
        question: 'Kampanya hangi ödülü kazandı?',
        options: ['Effie Gold', 'Cannes Lions Silver', 'Kristal Elma', 'Felis Grand Prix'],
        correct: 1,
      },
      {
        question: 'Platformun temel amacı nedir?',
        options: ['İnternet satışı', 'Sosyal bağlantı kurma', 'Müzik paylaşımı', 'Video konferans'],
        correct: 1,
      },
    ],
  },
  {
    id: 'case_2',
    title: 'Algida — I Heart',
    award: 'Effie Bronze',
    awardIcon: '🥉',
    insight: 'Dondurma sadece serinlemek için değil, mutluluk anlarının simgesidir. Algida\'nın kalp logosu bunu temsil eder.',
    idea: 'Algida\'nın ikonik kalp logosu, insanların sevdikleriyle paylaştığı mutluluk anlarının merkezi haline getirildi. Kullanıcılar kendi "kalp anlarını" sosyal medyada paylaştı.',
    result: 'Marka tercih skoru rekabette %12 puan öne geçti. Sosyal medyada 500K+ organik paylaşım elde edildi.',
    quiz: [
      {
        question: 'Kampanyanın duygusal çekirdeği nedir?',
        options: ['Sağlıklı yaşam', 'Mutluluk anları', 'Fiyat avantajı', 'Teknoloji'],
        correct: 1,
      },
      {
        question: 'Kampanya hangi ödülü aldı?',
        options: ['Cannes Grand Prix', 'Kristal Elma Gold', 'Effie Bronze', 'Felis Shortlist'],
        correct: 2,
      },
    ],
  },
  {
    id: 'case_3',
    title: 'Turkish Airlines — Widen Your World',
    award: 'Cannes Lions Grand Prix',
    awardIcon: '🏆',
    insight: 'İnsanlar yeni kültürleri ve deneyimleri keşfetmek ister ama günlük hayatın sınırları bunu engeller.',
    idea: 'Turkish Airlines, dünyanın en çok ülkeye uçan havayolu olma özelliğini yaratıcı bir şekilde kullanarak "Dünyayı Genişlet" mesajıyla küresel bir kampanya yarattı.',
    result: 'Global bilinirlik %34 arttı. Uçuş rezervasyonları kampanya döneminde %22 yükseldi. Cannes Lions Grand Prix kazandı.',
    quiz: [
      {
        question: 'Kampanyanın ana mesajı nedir?',
        options: ['En ucuz bilet', 'Dünyayı genişlet / keşfet', 'En hızlı uçuş', 'Business class avantajı'],
        correct: 1,
      },
      {
        question: 'Turkish Airlines\'ın rekabetçi üstünlüğü nedir?',
        options: ['En büyük uçak filosu', 'En çok ülkeye uçan havayolu', 'En eski havayolu', 'En ucuz bilet'],
        correct: 1,
      },
      {
        question: 'Kampanya hangi ödülü kazandı?',
        options: ['Effie Silver', 'Kristal Elma Grand Prix', 'Cannes Lions Grand Prix', 'Felis Yılın Ajansı'],
        correct: 2,
      },
    ],
  },
  {
    id: 'case_4',
    title: 'Dove — Real Beauty Sketches',
    award: 'Cannes Lions Titanium Grand Prix',
    awardIcon: '🏆',
    insight: 'Kadınlar kendilerini gerçekte olduklarından çok daha az güzel algılıyor. Yalnızca %4\'ü kendini güzel buluyor.',
    idea: 'Bir FBI sanatçısı, kadınları hem kendi tanımlamalarına hem de yabancıların tanımlamalarına göre çizdi. İki tasvir arasındaki dramatik fark, "güzellik baktığın yerden çok daha büyük" mesajını ortaya koydu.',
    result: '114 ülkede yayınlandı. 114 milyon izlenme. O zamana kadar tarihin en çok paylaşılan reklamı oldu.',
    quiz: [
      {
        question: 'Kampanyanın merkezi insight\'ı nedir?',
        options: [
          'Kadınlar makyaj olmadan güzel görünmez',
          'Kadınlar kendilerini başkalarından daha az güzel algılar',
          'Güzellik ürünleri pahalıdır',
          'Sosyal medya güzellik algısını bozar',
        ],
        correct: 1,
      },
      {
        question: 'Kampanyada kullanılan yöntem nedir?',
        options: ['Röportaj serisi', 'FBI sanatçısı çizim deneyi', 'Sokak anketi', 'Fotoğraf yarışması'],
        correct: 1,
      },
    ],
  },
  {
    id: 'case_5',
    title: 'ING — Do Your Thing',
    award: 'Effie Gold',
    awardIcon: '🥇',
    insight: 'Finansal hizmetler insanları strese sokar ve onları olduklarından farklı olmaya zorlar. İnsanlar sadece "kendileri olmak" ister.',
    idea: 'ING, "Banka ol, kendin ol" mesajıyla finansal hizmetleri kişisel özgürlüğün aracı olarak konumlandırdı. Kullanıcılar kendi finansal hedeflerini belirleyip takip edebildi.',
    result: 'Yeni müşteri edinimi %28 arttı. NPS skoru sektör ortalamasının 15 puan üzerine çıktı. Effie Gold kazandı.',
    quiz: [
      {
        question: 'ING kampanyasının temel değer önerisi nedir?',
        options: ['En düşük faiz', 'Finansal özgürlük ve kendin olmak', 'Dijital bankacılık kolaylığı', 'Kredi kartı avantajları'],
        correct: 1,
      },
      {
        question: 'Kampanyanın sonucunda ne ölçüldü?',
        options: ['Marka bilinirliği', 'Yeni müşteri edinimi ve NPS', 'Sosyal medya takipçisi', 'Reklam görüntüleme'],
        correct: 1,
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Seeding education cases...')
  await db.collection('education').doc('cases').set({ items: cases })
  console.log(`✅ Added ${cases.length} case studies to Firestore`)
  console.log('\n📋 Cases added:')
  cases.forEach(c => console.log(`  - ${c.awardIcon} ${c.title} (${c.award})`))
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
