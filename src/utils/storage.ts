import type { Decision } from '../types/decision'

export const DECISIONS_STORAGE_KEY = 'decision-journal-entries'

export const loadDecisions = (): Decision[] => {
  const storedDecisions = localStorage.getItem(DECISIONS_STORAGE_KEY)

  if (!storedDecisions) {
    return []
  }

  try {
    const parsedDecisions = JSON.parse(storedDecisions)

    return parsedDecisions.map((decision: Partial<Decision>) => ({
      ...decision,
      actualOutcome: decision.actualOutcome ?? '',
      reflection: decision.reflection ?? '',
      status: decision.status ?? 'open',
    })) as Decision[]
  } catch (error) {
    console.error('Failed to parse decisions from localStorage:', error)
    return []
  }
}

export const saveDecisions = (decisions: Decision[]) => {
  localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions))
}