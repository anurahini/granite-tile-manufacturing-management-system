import PageHeader from './PageHeader.jsx'
import DataTable from './DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { FileText, Save, RotateCcw } from 'lucide-react'

export default function TransactionPageTemplate({
  breadcrumbLabel, title, description, translationKey, formFields, summary, columns, rows
}) {
  const { t } = useLanguage()
  const displayTitle = (translationKey && t(translationKey) !== translationKey ? t(translationKey) : title)
  const displayDesc = (translationKey && t(`${translationKey}Desc`) !== `${translationKey}Desc` ? t(`${translationKey}Desc`) : description)

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('transactions') }, { label: displayTitle }]}
        title={displayTitle}
        description={displayDesc}
      />

      <div className="grid-2">
        <div className="card facet-corner" style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <FileText size={18} color="var(--orange-deep)" />
            <h3 style={{ fontSize: 17, fontFamily: 'var(--font-display)' }}>{displayTitle} Details</h3>
          </div>
          <div className="form-grid">
            {formFields.map((f) => (
              <div className="field" key={f.label}>
                <label>{f.label}</label>
                {f.type === 'select' ? (
                  <select defaultValue="">
                    <option value="" disabled>Select {f.label.toLowerCase()}</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea rows={3} placeholder={f.placeholder || ''} />
                ) : (
                  <input type={f.type || 'text'} placeholder={f.placeholder || ''} />
                )}
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary"><Save size={16} /> Save {displayTitle}</button>
            <button className="btn btn-outline"><RotateCcw size={16} /> Reset Form</button>
          </div>
        </div>

        <div className="card" style={{ padding: 26 }}>
          <h3 style={{ fontSize: 17, marginBottom: 18, fontFamily: 'var(--font-display)' }}>Summary</h3>
          {summary.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: i < summary.length - 1 ? '1px solid var(--cream-line)' : 'none',
              fontWeight: row.strong ? 700 : 500, color: row.strong ? 'var(--charcoal)' : 'var(--stone-dark)',
              fontSize: row.strong ? 15.5 : 14,
            }}>
              <span>{row.label}</span>
              <span style={row.strong ? { color: 'var(--orange-deep)', fontFamily: 'var(--font-mono)' } : { fontFamily: 'var(--font-mono)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <h3 style={{ fontSize: 18, marginBottom: 14 }}>Recent {displayTitle} Records</h3>
      <DataTable columns={columns} rows={rows} />
    </>
  )
}
