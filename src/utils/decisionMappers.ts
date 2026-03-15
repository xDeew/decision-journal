import type { Decision } from '../types/decision'
import type { DecisionApi } from '../api/decisions'

export function mapDecisionApiToDecision(decision: DecisionApi): Decision {
  return {
    id: String(decision.Id),
    title: decision.Title,
    category: decision.Category,
    context: decision.Context,
    actualOutcome: decision.ActualOutcome ?? '',
    expectedOutcome: decision.ExpectedOutcome,
    confidence: decision.Confidence as Decision['confidence'],
    createdAt: decision.CreatedAt,
    status: decision.Status as Decision['status'],
    reflection: decision.Reflection ?? '',
  }
}