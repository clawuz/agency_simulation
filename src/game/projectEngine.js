export function advanceProject(project) {
  const productivitySum = project.assignedEmployees.reduce(
    (sum, emp) => sum + (emp.productivity ?? 1),
    0
  )
  const progressPerDay = (productivitySum / project.durationDays) * 100
  const newProgress = Math.min(100, project.progress + progressPerDay)
  return { ...project, progress: newProgress }
}

export function isProjectComplete(project) {
  return project.progress >= 100
}

export function generateProject(clients, projectTypes, billingStructures, nextId) {
  const client = clients[Math.floor(Math.random() * clients.length)]
  const type = projectTypes[Math.floor(Math.random() * projectTypes.length)]
  const billing = billingStructures[Math.floor(Math.random() * billingStructures.length)]
  const budgetVariance = 0.7 + Math.random() * 0.6
  return {
    id: nextId,
    client,
    type: type.id,
    typeLabel: type.label,
    budget: Math.round(type.baseBudget * budgetVariance),
    durationDays: type.baseDays + Math.floor(Math.random() * 15),
    billing,
    status: 'available',
    progress: 0,
    assignedEmployees: [],
    installments: billing.installments.map(inst => ({ ...inst, paid: false })),
  }
}
