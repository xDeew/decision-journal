import type { Decision } from '../types/decision'

type DecisionCardProps = {
  decision: Decision
  reviewingDecisionId: string | null
  reviewText: string
  reflectionText: string
  onEdit: (decisionId: string) => void
  onDelete: (decisionId: string) => void
  onStartReview: (decisionId: string) => void
  onSaveReview: (decisionId: string) => void
  onReviewTextChange: (value: string) => void
  onReflectionTextChange: (value: string) => void
  onCancelReview: () => void
}

function DecisionCard({
  decision,
  reviewingDecisionId,
  reviewText,
  reflectionText,
  onEdit,
  onDelete,
  onStartReview,
  onSaveReview,
  onReviewTextChange,
  onReflectionTextChange,
  onCancelReview,
}: DecisionCardProps) {
  return (
    <article className="decision-card">
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
            onClick={() => onEdit(decision.id)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(decision.id)}
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
            onClick={() => onStartReview(decision.id)}
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
            onChange={(event) => onReviewTextChange(event.target.value)}
            placeholder="What actually happened after making this decision?"
          />

          <label htmlFor={`reflection-${decision.id}`}>Reflection</label>
          <textarea
            id={`reflection-${decision.id}`}
            rows={4}
            value={reflectionText}
            onChange={(event) => onReflectionTextChange(event.target.value)}
            placeholder="What did you learn from this decision? Would you do anything differently next time?"
          />

          <div className="review-box-actions">
            <button
              type="button"
              className="save-review-button"
              onClick={() => onSaveReview(decision.id)}
            >
              Save review
            </button>

            <button
              type="button"
              className="cancel-review-button"
              onClick={onCancelReview}
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
  )
}

export default DecisionCard