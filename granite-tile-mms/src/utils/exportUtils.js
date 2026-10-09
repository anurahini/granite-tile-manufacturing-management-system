/**
 * Helper utility to export tabular data to CSV format and trigger browser download.
 * @param {Array} rows - Data objects array
 * @param {Array} columns - Column definition objects array [{ key, label }]
 * @param {string} filename - Desired output filename
 */
export function exportToCSV(rows = [], columns = [], filename = 'report-export.csv') {
  if (!rows || rows.length === 0) return

  // Filter out action columns
  const exportCols = columns.filter(c => c.key !== 'actions' && c.key !== 'select')
  const headers = exportCols.map(c => `"${(c.label || c.key).replace(/"/g, '""')}"`)
  const keys = exportCols.map(c => c.key)

  const csvRows = [headers.join(',')]

  rows.forEach(row => {
    const line = keys.map(key => {
      let val = row[key]
      if (val === null || val === undefined) val = ''
      // Extract text content if object or boolean
      if (typeof val === 'object') {
        val = val.props?.status || val.props?.children || JSON.stringify(val)
      }
      const stringified = String(val).replace(/"/g, '""')
      return `"${stringified}"`
    })
    csvRows.push(line.join(','))
  })

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
