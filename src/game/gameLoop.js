export const INITIAL_GAME_STATE = {
  budget: 1000000,
  resourcePoints: 1000,
  reputation: 10,
  officeLevel: 1,
  currentTotalDays: 1,
  employees: [],
  projects: [],
  projectOpportunities: [],
  awards: [],
  eventLog: [],
  nextProjectId: 1,
  nextEmployeeId: 1,
}

const DAYS_PER_MONTH = 30

export function tickDay(state) {
  const dailySalaryCost = state.employees.reduce(
    (sum, emp) => sum + Math.round(emp.salary / DAYS_PER_MONTH),
    0
  )

  return {
    ...state,
    currentTotalDays: state.currentTotalDays + 1,
    budget: state.budget - dailySalaryCost,
  }
}

export function getFormattedDate(totalDays) {
  const year = Math.floor((totalDays - 1) / (DAYS_PER_MONTH * 12)) + 1
  const month = Math.floor(((totalDays - 1) % (DAYS_PER_MONTH * 12)) / DAYS_PER_MONTH) + 1
  const day = ((totalDays - 1) % DAYS_PER_MONTH) + 1
  return { year, month, day }
}
