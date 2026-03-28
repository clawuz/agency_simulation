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
