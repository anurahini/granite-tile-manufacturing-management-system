import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Breadcrumb({ trail }) {
  const { t } = useLanguage()
  // trail: [{label, path?}] — last item has no path (current page)
  return (
    <div className="breadcrumb">
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1
        const displayLabel = t(item.label) || item.label
        return (
          <span key={item.label || i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <ChevronRight size={13} className="sep" />}
            {isLast || !item.path ? (
              <span className="current">{displayLabel}</span>
            ) : (
              <Link to={item.path}>{displayLabel}</Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
