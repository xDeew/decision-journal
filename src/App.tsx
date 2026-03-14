import { ChangeEvent, FormEvent, useState } from 'react'
import './App.css'

type ConfidenceLevel = 'low' | 'medium' | 'high'

type Decision = {
  id: string
  title: string
  category: string
  context: string
  expectedOutcome: string
  confidence: ConfidenceLevel
  createdAt: string
}

type FormData = {
  title: string
  category: string
  context: string
  expectedOutcome: string
  confidence: '' | ConfidenceLevel
}

const initialFormData: FormData = {
  title: '',
  category: '',
  context: '',
  expectedOutcome: '',
  confidence: '',
}

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [decisions, setDecisions] = useState<Decision[]>([])

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
      return
    }

    const newDecision: Decision = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      category: formData.category.trim(),
      context: formData.context.trim(),
      expectedOutcome: formData.expectedOutcome.trim(),
      confidence: formData.confidence,
      createdAt: new Date().toLocaleDateString(),
    }

    setDecisions((currentDecisions) => [newDecision, ...currentDecisions])
    setFormData(initialFormData)
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
                    <span className={`confidence-badge ${decision.confidence}`}>
                      {decision.confidence}
                    </span>
                    <span className="decision-date">{decision.createdAt}</span>
                  </div>

                  <h3>{decision.title}</h3>
                  <p className="decision-category">{decision.category}</p>

                  <div className="decision-section">
                    <h4>Context</h4>
                    <p>{decision.context}</p>
                  </div>

                  <div className="decision-section">
                    <h4>Expected outcome</h4>
                    <p>{decision.expectedOutcome}</p>
                  </div>
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