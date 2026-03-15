import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Decision, DecisionFormData } from '../types/decision'
import { initialFormData } from '../types/decision'
import {
    getAvailableCategories,
    getDecisionStats,
    getFilteredDecisions,
} from '../utils/decisionHelpers'
import {
    createDecision,
    deleteDecision,
    getDecisions,
    updateDecision,
} from '../api/decisions'
import { mapDecisionApiToDecision } from '../utils/decisionMappers'
import type { AuthUser } from '../types/auth'

export function useDecisionJournal(currentUser: AuthUser | null) {
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
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchDecisions() {
            if (!currentUser) {
                setDecisions([])
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const decisionsFromApi = await getDecisions()
                setDecisions(decisionsFromApi.map(mapDecisionApiToDecision))
            } catch (error) {
                console.error('Load decisions error:', error)
                setDecisions([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchDecisions()
    }, [currentUser])

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (
            !formData.title.trim() ||
            !formData.category.trim() ||
            !formData.context.trim() ||
            !formData.expectedOutcome.trim() ||
            !formData.confidence
        ) {
            setErrorMessage('Please complete all required fields.')
            return
        }

        setErrorMessage('')

        try {
            if (editingDecisionId) {
                const existingDecision = decisions.find(
                    (decision) => decision.id === editingDecisionId
                )

                if (!existingDecision) {
                    setErrorMessage('Decision not found.')
                    return
                }

                const response = await updateDecision(Number(editingDecisionId), {
                    title: formData.title.trim(),
                    category: formData.category.trim(),
                    context: formData.context.trim(),
                    expectedOutcome: formData.expectedOutcome.trim(),
                    actualOutcome: existingDecision.actualOutcome || null,
                    reflection: existingDecision.reflection || null,
                    confidence: formData.confidence,
                    status: existingDecision.status,
                })

                const updatedDecision = mapDecisionApiToDecision(response.decision)

                setDecisions((currentDecisions) =>
                    currentDecisions.map((decision) =>
                        decision.id === editingDecisionId ? updatedDecision : decision
                    )
                )

                setEditingDecisionId(null)
            } else {
                const response = await createDecision({
                    title: formData.title.trim(),
                    category: formData.category.trim(),
                    context: formData.context.trim(),
                    expectedOutcome: formData.expectedOutcome.trim(),
                    confidence: formData.confidence,
                })

                const newDecision = mapDecisionApiToDecision(response.decision)

                setDecisions((currentDecisions) => [newDecision, ...currentDecisions])
            }

            setFormData(initialFormData)
        } catch (error) {
            console.error('Submit decision error:', error)
            setErrorMessage(
                error instanceof Error ? error.message : 'Something went wrong'
            )
        }
    }

    const handleDeleteDecision = async (decisionId: string) => {
        try {
            await deleteDecision(Number(decisionId))
            setDecisions((currentDecisions) =>
                currentDecisions.filter((decision) => decision.id !== decisionId)
            )
        } catch (error) {
            console.error('Delete decision error:', error)
            setErrorMessage(
                error instanceof Error ? error.message : 'Something went wrong while deleting the decision'
            )
        }
    }

    const handleStartReview = (decisionId: string) => {
        const decisionToReview = decisions.find((decision) => decision.id === decisionId)

        setErrorMessage('')
        setReviewingDecisionId(decisionId)
        setReviewText(decisionToReview?.actualOutcome ?? '')
        setReflectionText(decisionToReview?.reflection ?? '')
    }

    const handleSaveReview = async (decisionId: string) => {
        const decisionToReview = decisions.find((decision) => decision.id === decisionId)

        if (!decisionToReview || !reviewText.trim()) {
            return
        }

        try {
            const response = await updateDecision(Number(decisionId), {
                title: decisionToReview.title,
                category: decisionToReview.category,
                context: decisionToReview.context,
                expectedOutcome: decisionToReview.expectedOutcome,
                actualOutcome: reviewText.trim(),
                reflection: reflectionText.trim() || null,
                confidence: decisionToReview.confidence,
                status: 'reviewed',
            })

            const updatedDecision = mapDecisionApiToDecision(response.decision)

            setDecisions((currentDecisions) =>
                currentDecisions.map((decision) =>
                    decision.id === decisionId ? updatedDecision : decision
                )
            )

            setReviewingDecisionId(null)
            setReviewText('')
            setReflectionText('')
        } catch (error) {
            console.error('Save review error:', error)
        }
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
    }).toSorted((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
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
        isLoading,
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
        sortOrder,
        setSortOrder,
    }
}