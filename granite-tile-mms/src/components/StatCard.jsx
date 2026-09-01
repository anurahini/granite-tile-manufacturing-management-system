import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const tones = {
  orange: { bg: '#fbe7d8', fg: '#c2560f' },
  charcoal: { bg: '#e7e3df', fg: '#332c26' },
  success: { bg: '#e6f1e6', fg: '#3f8556' },
  info: { bg: '#e3efec', fg: '#3e7a73' },
  warning: { bg: '#faf0dc', fg: '#c8891e' },
  danger: { bg: '#f9e6e0', fg: '#c2452d' },
}

export function StatCard({ icon: Icon, label, value, delta, deltaDir, tone = 'orange' }) {
  const t = tones[tone] || tones.orange
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {delta && (
          <div className={`stat-delta ${deltaDir}`}>
            {deltaDir === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {delta}
          </div>
        )}
      </div>
      <div className="stat-icon" style={{ background: t.bg, color: t.fg }}>
        <Icon size={22} />
      </div>
    </div>
  )
}

export function StatGrid({ children }) {
  return <div className="stat-grid">{children}</div>
}
