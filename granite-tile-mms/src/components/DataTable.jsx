import StatusBadge from './StatusBadge.jsx'

/**
 * columns: [{ key, label, mono?, render? }]
 * rows: [{ ...data }]
 */
export default function DataTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return <div className="table-wrap"><div className="empty-note">No records to display yet — this is placeholder demo data for the MWT project.</div></div>
  }
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map(col => {
                let content = row[col.key]
                if (col.render) content = col.render(row)
                else if (col.key === 'status') content = <StatusBadge status={row.status} />
                return <td key={col.key} className={col.mono ? 'mono' : ''}>{content}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
