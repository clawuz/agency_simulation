export const RANDOM_EVENTS = [
  {
    id: 'cannes_shortlist',
    message: { tr: "Cannes Lions shortlist'e girdiniz! 🦁", en: 'You made the Cannes Lions shortlist! 🦁' },
    type: 'money_gain',
    reputationDelta: 20,
    budgetDelta: 0,
  },
  {
    id: 'brief_changed',
    message: { tr: "Müşteri brief'i değiştirdi, baştan başlıyoruz.", en: 'Client changed the brief — starting over.' },
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

export const EVENT_CHANCE_PER_DAY = 0.05
