import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'
import {
  initialFormData,
  type ConfidenceLevel,
  type Decision,
  type DecisionFormData,
} from './types/decision'
import { loadDecisions, saveDecisions } from './utils/storage'

function App() {
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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
        confidence: formData.confidence,
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

  const filteredDecisions = decisions.filter((decision) => {
    const matchesStatus =
      statusFilter === 'all' ? true : decision.status === statusFilter

    const matchesCategory =
      selectedCategory === 'all' ? true : decision.category === selectedCategory

    const normalizedSearch = searchTerm.trim().toLowerCase()

    const matchesSearch =
      normalizedSearch === ''
        ? true
        : decision.title.toLowerCase().includes(normalizedSearch) ||
        decision.category.toLowerCase().includes(normalizedSearch) ||
        decision.context.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesCategory && matchesSearch
  })

  const totalDecisions = decisions.length
  const openDecisions = decisions.filter((decision) => decision.status === 'open').length
  const reviewedDecisions = decisions.filter((decision) => decision.status === 'reviewed').length


  const availableCategories = Array.from(
    new Set(decisions.map((decision) => decision.category))
  ).sort()


  const hasDecisions = decisions.length > 0

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="app-kicker">Decision Journal</p>
          <h1 className="app-title">Think clearly. Record the choice.</h1>
        </div>

        <div className="topbar-badge">V1</div>
      </header>

      <section className="intro-card">
        <p>
          A decision journal for capturing important choices, the reasoning
          behind them, and the outcome later on. Built to make reflection more
          intentional and learning more concrete.
        </p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="stat-label">Total</p>
          <strong className="stat-value">{totalDecisions}</strong>
        </article>

        <article className="stat-card">
          <p className="stat-label">Open</p>
          <strong className="stat-value">{openDecisions}</strong>
        </article>

        <article className="stat-card">
          <p className="stat-label">Reviewed</p>
          <strong className="stat-value">{reviewedDecisions}</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="panel form-panel">
          <div className="panel-heading">
            <p className="section-label">
              {editingDecisionId ? 'Editing decision' : 'New decision'}
            </p>
            <h2>{editingDecisionId ? 'Edit entry' : 'Add entry'}</h2>
          </div>

          <form className="decision-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Decision title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Should I switch to a new job?"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                placeholder="Career, finance, health..."
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="context">Context</label>
              <textarea
                id="context"
                name="context"
                rows={4}
                placeholder="What is happening, and why does this matter now?"
                value={formData.context}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectedOutcome">Expected outcome</label>
              <textarea
                id="expectedOutcome"
                name="expectedOutcome"
                rows={4}
                placeholder="What do you expect to happen if you choose this path?"
                value={formData.expectedOutcome}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confidence">Confidence level</label>
              <select
                id="confidence"
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Select confidence
                </option>
                <option value="low">Low confidence</option>
                <option value="medium">Medium confidence</option>
                <option value="high">High confidence</option>
              </select>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <button type="submit" className="primary-button">
              {editingDecisionId ? 'Update decision' : 'Save decision'}
            </button>

            {editingDecisionId && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingDecisionId(null)
                  setFormData(initialFormData)
                  setErrorMessage('')
                }}
              >
                Cancel editing
              </button>
            )}

          </form>
        </div>

        <div className="panel list-panel">
          <div className="panel-heading">
            <p className="section-label">Entries</p>
            <h2>Decision log</h2>
          </div>

          <div className="filter-tabs">
            <button
              type="button"
              className={statusFilter === 'all' ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={statusFilter === 'open' ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setStatusFilter('open')}
            >
              Open
            </button>

            <button
              type="button"
              className={statusFilter === 'reviewed' ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setStatusFilter('reviewed')}
            >
              Reviewed
            </button>
          </div>

          <div className="toolbar">
            <div className="toolbar-search">
              <label htmlFor="search-decisions">Search</label>
              <input
                id="search-decisions"
                type="text"
                placeholder="Search by title, category or context..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="toolbar-category">
              <label htmlFor="category-filter">Category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredDecisions.length === 0 ? (
            <div className="empty-state">
              <div>
                <h3>{hasDecisions ? 'No matching decisions' : 'No decisions yet'}</h3>
                <p>
                  {hasDecisions
                    ? 'Try changing the status, category, or search filters.'
                    : 'Your saved entries will appear here. Start with one real decision and build the journal from there.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="decision-list">
              {filteredDecisions.map((decision) => (
                <article key={decision.id} className="decision-card">
                  <div className="decision-card-top">
                    <div className="decision-meta">
                      <span className={`confidence-badge ${decision.confidence}`}>
                        {decision.confidence}
                      </span>
                      <span className={`status-badge ${decision.status}`}>
                        {decision.status}
                      </span>
                      <span className="decision-date">{decision.createdAt}</span>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEditDecision(decision.id)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteDecision(decision.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h3>{decision.title}</h3>
                  <p className="decision-category">{decision.category}</p>
                  <div className="decision-actions">
                    {decision.status === 'open' ? (
                      <button
                        type="button"
                        className="review-button"
                        onClick={() => handleStartReview(decision.id)}
                      >
                        Add review
                      </button>
                    ) : (
                      <span className="reviewed-label">Reviewed</span>
                    )}
                  </div>

                  <div className="decision-section">
                    <h4>Context</h4>
                    <p>{decision.context}</p>
                  </div>

                  <div className="decision-section">
                    <h4>Expected outcome</h4>
                    <p>{decision.expectedOutcome}</p>
                  </div>

                  {reviewingDecisionId === decision.id && (
                    <div className="review-box">
                      <label htmlFor={`review-${decision.id}`}>Actual outcome</label>
                      <textarea
                        id={`review-${decision.id}`}
                        rows={4}
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        placeholder="What actually happened after making this decision?"
                      />

                      <label htmlFor={`reflection-${decision.id}`}>Reflection</label>
                      <textarea
                        id={`reflection-${decision.id}`}
                        rows={4}
                        value={reflectionText}
                        onChange={(event) => setReflectionText(event.target.value)}
                        placeholder="What did you learn from this decision? Would you do anything differently next time?"
                      />
                      <div className="review-box-actions">
                        <button
                          type="button"
                          className="save-review-button"
                          onClick={() => handleSaveReview(decision.id)}
                        >
                          Save review
                        </button>

                        <button
                          type="button"
                          className="cancel-review-button"
                          onClick={() => {
                            setReviewingDecisionId(null)
                            setReviewText('')
                            setReflectionText('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {decision.actualOutcome && (
                    <div className="decision-section">
                      <h4>Actual outcome</h4>
                      <p>{decision.actualOutcome}</p>
                    </div>
                  )}

                  {decision.reflection && (
                    <div className="decision-section">
                      <h4>Reflection</h4>
                      <p>{decision.reflection}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App