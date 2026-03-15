import type { Decision } from '../types/decision'

export const getFilteredDecisions = ({
  decisions,
  statusFilter,
  selectedCategory,
  searchTerm,
}: {
  decisions: Decision[]
  statusFilter: 'all' | 'open' | 'reviewed'
  selectedCategory: string
  searchTerm: string
}) => {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return decisions.filter((decision) => {
    const matchesStatus =
      statusFilter === 'all' ? true : decision.status === statusFilter

    const matchesCategory =
      selectedCategory === 'all' ? true : decision.category === selectedCategory

    const matchesSearch =
      normalizedSearch === ''
        ? true
        : decision.title.toLowerCase().includes(normalizedSearch) ||
          decision.category.toLowerCase().includes(normalizedSearch) ||
          decision.context.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesCategory && matchesSearch
  })
}

export const getAvailableCategories = (decisions: Decision[]) =>
  Array.from(new Set(decisions.map((decision) => decision.category))).sort()

export const getDecisionStats = (decisions: Decision[]) => ({
  totalDecisions: decisions.length,
  openDecisions: decisions.filter((decision) => decision.status === 'open').length,
  reviewedDecisions: decisions.filter((decision) => decision.status === 'reviewed').length,
})