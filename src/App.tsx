import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

type ConfidenceLevel = 'low' | 'medium' | 'high'

type Decision = {
  id: string
  title: string
  category: string
  context: string
  actualOutcome: string
  expectedOutcome: string
  confidence: ConfidenceLevel
  createdAt: string
  status: 'open' | 'reviewed'

}

type DecisionFormData = {
  title: string
  category: string
  context: string
  expectedOutcome: string
  confidence: '' | ConfidenceLevel
}

const initialFormData: DecisionFormData = {
  title: '',
  category: '',
  context: '',
  expectedOutcome: '',
  confidence: '',
}

const DECISIONS_STORAGE_KEY = 'decision-journal-entries'

function App() {
  const [formData, setFormData] = useState<DecisionFormData>(initialFormData)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [reviewingDecisionId, setReviewingDecisionId] = useState<string | null>(null)
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    const storedDecisions = localStorage.getItem(DECISIONS_STORAGE_KEY)

    if (!storedDecisions) {
      return
    }

    try {
      const parsedDecisions = JSON.parse(storedDecisions)

      const normalizedDecisions: Decision[] = parsedDecisions.map((decision: Partial<Decision>) => ({
        ...decision,
        actualOutcome: decision.actualOutcome ?? '',
        status: decision.status ?? 'open',
      })) as Decision[]

      setDecisions(normalizedDecisions)
    } catch (error) {
      console.error('Failed to parse decisions from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions))
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
    }

    setDecisions((currentDecisions) => [newDecision, ...currentDecisions])
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
            status: 'reviewed',
          }
          : decision
      )
    )

    setReviewingDecisionId(null)
    setReviewText('')
  }

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

      <section className="workspace">
        <div className="panel form-panel">
          <div className="panel-heading">
            <p className="section-label">New decision</p>
            <h2>Add entry</h2>
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
              <label htmlFor="confidence">Confidence</label>
              <select
                id="confidence"
                name="confidence"
                value={formData.confidence}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select confidence
                </option>
                <option value="low">Low confidence</option>
                <option value="medium">Medium confidence</option>
                <option value="high">High confidence</option>
              </select>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <button type="submit" className="primary-button">
              Save decision
            </button>

          </form>
        </div>

        <div className="panel list-panel">
          <div className="panel-heading">
            <p className="section-label">Entries</p>
            <h2>Decision log</h2>
          </div>

          {decisions.length === 0 ? (
            <div className="empty-state">
              <div>
                <h3>No decisions yet</h3>
                <p>
                  Your saved entries will appear here. Start with one real
                  decision and build the journal from there.
                </p>
              </div>
            </div>
          ) : (
            <div className="decision-list">
              {decisions.map((decision) => (
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

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteDecision(decision.id)}
                    >
                      Delete
                    </button>
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