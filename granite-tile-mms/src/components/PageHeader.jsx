import Breadcrumb from './Breadcrumb.jsx'

export default function PageHeader({ trail, title, description, actions }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <Breadcrumb trail={trail} />
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
      </div>
    </div>
  )
}
