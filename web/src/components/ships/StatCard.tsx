interface StatCardProps {
  icon: string
  label: string
  value: number
  suffix: string
  tone: string
}

export function StatCard({ icon, label, value, suffix, tone }: StatCardProps) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}<small>{suffix}</small></strong><em className={tone}>Data terbaru</em></div><span className="stat-arrow">↗</span></div>
}
