import './App.css'
import DecisionCard from './components/DecisionCard'
import DecisionForm from './components/DecisionForm'
import DecisionToolbar from './components/DecisionToolbar'
import DecisionStats from './components/DecisionStats'
import { useDecisionJournal } from './hooks/useDecisionJournal'
import {
  suggestedCategories,
} from './types/decision'

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
  } = useDecisionJournal()

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