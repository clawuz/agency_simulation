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
