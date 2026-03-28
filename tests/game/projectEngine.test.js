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
  })

  it('returns false when progress < 100', () => {
    expect(isProjectComplete({ progress: 50 })).toBe(false)
  })
})
