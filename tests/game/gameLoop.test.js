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
