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
