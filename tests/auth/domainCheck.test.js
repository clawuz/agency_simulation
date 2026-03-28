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
