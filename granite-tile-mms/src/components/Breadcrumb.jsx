import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ trail }) {
  // trail: [{label, path?}] — last item has no path (current page)
  return (
    <div className="breadcrumb">
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1
        return (
          <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <ChevronRight size={13} className="sep" />}
            {isLast || !item.path ? (
              <span className="current">{item.label}</span>
            ) : (
              <Link to={item.path}>{item.label}</Link>
            )}
          </span>
        )
      })}
    </div>
  )
}
