export type ConfidenceLevel = 'low' | 'medium' | 'high'

export type Decision = {
  id: string
  title: string
  category: string
  context: string
  actualOutcome: string
  expectedOutcome: string
  confidence: ConfidenceLevel
  createdAt: string
  status: 'open' | 'reviewed'
  reflection: string
}

export type DecisionFormData = {
  title: string
  category: string
  context: string
  expectedOutcome: string
  confidence: '' | ConfidenceLevel
}

export const initialFormData: DecisionFormData = {
  title: '',
  category: '',
  context: '',
  expectedOutcome: '',
  confidence: '',
}