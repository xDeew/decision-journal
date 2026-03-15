import { useEffect, useState } from 'react'
import './App.css'
import AuthForm from './components/AuthForm'
import DecisionCard from './components/DecisionCard'
import DecisionForm from './components/DecisionForm'
import DecisionStats from './components/DecisionStats'
import DecisionToolbar from './components/DecisionToolbar'
import { useDecisionJournal } from './hooks/useDecisionJournal'
import type { AuthUser } from './types/auth'
import { suggestedCategories } from './types/decision'

function App() {
  const {
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
    sortOrder,
    setSortOrder,
    isLoading,
  } = useDecisionJournal(currentUser)

  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setCurrentUser(null)
  }

  if (!token || !currentUser) {
    return (
      <main className="app-shell">
        <header className="topbar">
          <div>
            <p className="app-kicker">Decision Journal</p>
            <h1 className="app-title">Think clearly. Record the choice.</h1>
          </div>

          <div className="topbar-badge">V1</div>
        </header>

        <section className="workspace">
          <AuthForm
            onLoginSuccess={(newToken, user) => {
              setToken(newToken)
              setCurrentUser(user)
            }}
          />
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="app-kicker">Decision Journal</p>
          <h1 className="app-title">Think clearly. Record the choice.</h1>
        </div>

        <div className="topbar-actions">
          <div className="topbar-badge">{currentUser.username}</div>

          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="intro-card">
        <p>
          A decision journal for capturing important choices, the reasoning
          behind them, and the outcome later on. Built to make reflection more
          intentional and learning more concrete.
        </p>
      </section>

      <DecisionStats
        totalDecisions={totalDecisions}
        openDecisions={openDecisions}
        reviewedDecisions={reviewedDecisions}
      />

      <section className="workspace">
        <DecisionForm
          formData={formData}
          errorMessage={errorMessage}
          editingDecisionId={editingDecisionId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancelEditing={cancelEditing}
          categoryOptions={[...new Set([...suggestedCategories, ...availableCategories])]}
        />

        <div className="panel list-panel">
          <div className="panel-heading">
            <p className="section-label">Entries</p>
            <h2>Decision log</h2>
          </div>

          <DecisionToolbar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            availableCategories={availableCategories}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {isLoading ? (
            <div className="empty-state">
              <div>
                <h3>Loading decisions...</h3>
                <p>Please wait while your journal entries are loaded.</p>
              </div>
            </div>
          ) : filteredDecisions.length === 0 ? (
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
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  reviewingDecisionId={reviewingDecisionId}
                  reviewText={reviewText}
                  reflectionText={reflectionText}
                  onEdit={handleEditDecision}
                  onDelete={handleDeleteDecision}
                  onStartReview={handleStartReview}
                  onSaveReview={handleSaveReview}
                  onReviewTextChange={setReviewText}
                  onReflectionTextChange={setReflectionText}
                  onCancelReview={cancelReview}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App