import { useEffect, useState } from 'react'
import type {
  ConfidenceLevel,
  Decision,
  DecisionFormData,
} from '../types/decision'
import { initialFormData } from '../types/decision'
import { loadDecisions, saveDecisions } from '../utils/storage'
import {
  getAvailableCategories,
  getDecisionStats,
  getFilteredDecisions,
} from '../utils/decisionHelpers'

export function useDecisionJournal() {
  const [formData, setFormData] = useState<DecisionFormData>(initialFormData)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [reviewingDecisionId, setReviewingDecisionId] = useState<string | null>(null)
  const [reviewText, setReviewText] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'reviewed'>('all')
  const [reflectionText, setReflectionText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingDecisionId, setEditingDecisionId] = useState<string | null>(null)

  useEffect(() => {
    setDecisions(loadDecisions())
  }, [])

  useEffect(() => {
    saveDecisions(decisions)
  }, [decisions])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.context.trim() ||
      !formData.expectedOutcome.trim() ||
      !formData.confidence
    ) {
      setErrorMessage('Please complete all fields before saving the decision.')
      return
    }

    setErrorMessage('')
    const confidence: ConfidenceLevel = formData.confidence

    if (editingDecisionId) {
      setDecisions((currentDecisions) =>
        currentDecisions.map((decision) =>
          decision.id === editingDecisionId
            ? {
                ...decision,
                title: formData.title.trim(),
                category: formData.category.trim(),
                context: formData.context.trim(),
                expectedOutcome: formData.expectedOutcome.trim(),
                confidence,
              }
            : decision
        )
      )

      setEditingDecisionId(null)
    } else {
      const newDecision: Decision = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        category: formData.category.trim(),
        context: formData.context.trim(),
        actualOutcome: '',
        expectedOutcome: formData.expectedOutcome.trim(),
        confidence,
        createdAt: new Date().toLocaleDateString(),
        status: 'open',
        reflection: '',
      }

      setDecisions((currentDecisions) => [newDecision, ...currentDecisions])
    }

    setFormData(initialFormData)
    setErrorMessage('')
  }

  const handleDeleteDecision = (decisionId: string) => {
    setDecisions((currentDecisions) =>
      currentDecisions.filter((decision) => decision.id !== decisionId)
    )
  }

  const handleStartReview = (decisionId: string) => {
    const decisionToReview = decisions.find((decision) => decision.id === decisionId)

    setReviewingDecisionId(decisionId)
    setReviewText(decisionToReview?.actualOutcome ?? '')
    setReflectionText(decisionToReview?.reflection ?? '')
  }

  const handleSaveReview = (decisionId: string) => {
    if (!reviewText.trim()) {
      return
    }

    setDecisions((currentDecisions) =>
      currentDecisions.map((decision) =>
        decision.id === decisionId
          ? {
              ...decision,
              actualOutcome: reviewText.trim(),
              reflection: reflectionText.trim(),
              status: 'reviewed',
            }
          : decision
      )
    )

    setReviewingDecisionId(null)
    setReviewText('')
    setReflectionText('')
  }

  const handleEditDecision = (decisionId: string) => {
    const decisionToEdit = decisions.find((decision) => decision.id === decisionId)

    if (!decisionToEdit) {
      return
    }

    setFormData({
      title: decisionToEdit.title,
      category: decisionToEdit.category,
      context: decisionToEdit.context,
      expectedOutcome: decisionToEdit.expectedOutcome,
      confidence: decisionToEdit.confidence,
    })

    setEditingDecisionId(decisionId)
    setErrorMessage('')
  }

  const cancelEditing = () => {
    setEditingDecisionId(null)
    setFormData(initialFormData)
    setErrorMessage('')
  }

  const cancelReview = () => {
    setReviewingDecisionId(null)
    setReviewText('')
    setReflectionText('')
  }

  const filteredDecisions = getFilteredDecisions({
    decisions,
    statusFilter,
    selectedCategory,
    searchTerm,
  })

  const { totalDecisions, openDecisions, reviewedDecisions } =
    getDecisionStats(decisions)

  const availableCategories = getAvailableCategories(decisions)
  const hasDecisions = decisions.length > 0

  return {
    formData,
    errorMessage,
    editingDecisionId,
    reviewingDecisionId,
    reviewText,
    reflectionText,
    statusFilter,
    searchTerm,
    selectedCategory,
    filteredDecisions,
    totalDecisions,
    openDecisions,
    reviewedDecisions,
    availableCategories,
    hasDecisions,
    setStatusFilter,
    setSearchTerm,
    setSelectedCategory,
    setReviewText,
    setReflectionText,
    handleChange,
    handleSubmit,
    handleDeleteDecision,
    handleStartReview,
    handleSaveReview,
    handleEditDecision,
    cancelEditing,
    cancelReview,
  }
}