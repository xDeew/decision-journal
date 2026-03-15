import { apiRequest } from './api'

export type DecisionApi = {
  Id: number
  UserId: number
  Title: string
  Category: string
  Context: string
  ExpectedOutcome: string
  ActualOutcome: string | null
  Reflection: string | null
  Confidence: string
  Status: string
  CreatedAt: string
}

export function getDecisions() {
  return apiRequest<DecisionApi[]>('/decisions')
}

export function createDecision(payload: {
  title: string
  category: string
  context: string
  expectedOutcome: string
  confidence: string
}) {
  return apiRequest<{ message: string; decision: DecisionApi }>('/decisions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateDecision(
  id: number,
  payload: {
    title: string
    category: string
    context: string
    expectedOutcome: string
    actualOutcome: string | null
    reflection: string | null
    confidence: string
    status: string
  }
) {
  return apiRequest<{ message: string; decision: DecisionApi }>(`/decisions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteDecision(id: number) {
  return apiRequest<{ message: string }>(`/decisions/${id}`, {
    method: 'DELETE',
  })
}