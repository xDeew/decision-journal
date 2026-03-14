type DecisionStatsProps = {
  totalDecisions: number
  openDecisions: number
  reviewedDecisions: number
}

function DecisionStats({
  totalDecisions,
  openDecisions,
  reviewedDecisions,
}: DecisionStatsProps) {
  return (
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
  )
}

export default DecisionStats