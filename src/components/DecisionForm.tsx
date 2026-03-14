import type { ChangeEvent, FormEvent } from 'react'
import type { DecisionFormData } from '../types/decision'

type DecisionFormProps = {
  formData: DecisionFormData
  errorMessage: string
  editingDecisionId: string | null
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEditing: () => void
}

function DecisionForm({
  formData,
  errorMessage,
  editingDecisionId,
  onChange,
  onSubmit,
  onCancelEditing,
}: DecisionFormProps) {
  return (
    <div className="panel form-panel">
      <div className="panel-heading">
        <p className="section-label">
          {editingDecisionId ? 'Editing decision' : 'New decision'}
        </p>
        <h2>{editingDecisionId ? 'Edit entry' : 'Add entry'}</h2>
      </div>

      <form className="decision-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Decision title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Should I switch to a new job?"
            value={formData.title}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confidence">Confidence level</label>
          <select
            id="confidence"
            name="confidence"
            value={formData.confidence}
            onChange={onChange}
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
            onClick={onCancelEditing}
          >
            Cancel editing
          </button>
        )}
      </form>
    </div>
  )
}

export default DecisionForm