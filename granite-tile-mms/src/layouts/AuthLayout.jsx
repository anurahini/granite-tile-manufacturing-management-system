import { Link } from 'react-router-dom'
import { Gem, ShieldCheck, Factory, Award } from 'lucide-react'
import './AuthLayout.css'

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand-panel">
        <div className="auth-brand-texture" />
        <div className="auth-brand-content">
          <Link to="/" className="auth-brand-logo">
            <div className="brand-mark"><Gem size={20} /></div>
            <span>Granite&nbsp;&amp;&nbsp;Tile&nbsp;MMS</span>
          </Link>

          <div className="auth-brand-copy">
            <span className="eyebrow" style={{ color: 'var(--orange-soft)' }}>Quarry to Showroom</span>
            <h1>Manufacturing Management System</h1>
            <p>
              One login for masters, production, sales and reporting across every
              granite and tile facility in the plant network.
            </p>
          </div>

          <div className="auth-brand-features">
            <div className="auth-feature">
              <Factory size={18} />
              <span>Live production &amp; inventory tracking</span>
            </div>
            <div className="auth-feature">
              <ShieldCheck size={18} />
              <span>Role-based, secure access for every user</span>
            </div>
            <div className="auth-feature">
              <Award size={18} />
              <span>27+ years of manufacturing discipline</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="auth-form-footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
