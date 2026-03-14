import './App.css'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Decision Journal</p>
          <h1>Capture important decisions before life edits the story.</h1>
          <p className="subtitle">
            A simple app for recording decisions, the reasoning behind them,
            and the outcome later on. The goal is to think more clearly,
            decide with intention, and learn from real results.
          </p>
        </div>
      </section>

      <section className="content">
        <div className="panel form-panel">
          <div className="panel-heading">
            <p className="section-label">New Entry</p>
            <h2>Add a decision</h2>
            <p>
              Start by writing down the decision, the context, and what you
              expect to happen.
            </p>
          </div>

          <form className="decision-form">
            <div className="form-group">
              <label htmlFor="title">Decision title</label>
              <input
                id="title"
                type="text"
                placeholder="Example: Should I switch to a new job?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="Career, finance, relationships, health..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="context">Context</label>
              <textarea
                id="context"
                rows={4}
                placeholder="What is happening? Why is this decision relevant right now?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectedOutcome">Expected outcome</label>
              <textarea
                id="expectedOutcome"
                rows={4}
                placeholder="What do you think will happen if you choose this path?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confidence">Confidence level</label>
              <select id="confidence" defaultValue="">
                <option value="" disabled>
                  Select confidence
                </option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
            <h2>Your decisions</h2>
            <p>
              Once you start adding entries, they will appear here so you can
              review them over time.
            </p>
          </div>

          <div className="empty-state">
            <h3>No decisions yet</h3>
            <p>
              Your first saved decision will appear here. Start with something
              meaningful, not necessarily dramatic.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App