import { useState, useMemo, useEffect } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SearchX } from 'lucide-react'

/**
 * Enhanced DataTable component with sorting, pagination, searching, and filtering.
 * 
 * Props:
 * - columns: [{ key, label, mono?, render?, sortable? }]
 * - rows: [{ ...data }]
 * - searchQuery: string (optional)
 * - activeFilters: object or array (optional)
 * - pageSize: number (default 10)
 * - showPagination: boolean (default true)
 * - onResetFilters: function (optional)
 */
export default function DataTable({
  columns = [],
  rows = [],
  searchQuery = '',
  activeFilters = {},
  pageSize = 10,
  showPagination = true,
  onResetFilters
}) {
  const { t } = useLanguage()

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(pageSize)

  // Sync perPage when prop pageSize changes
  useEffect(() => {
    setPerPage(pageSize)
  }, [pageSize])

  // Filter rows based on searchQuery and activeFilters
  const filteredRows = useMemo(() => {
    let result = Array.isArray(rows) ? [...rows] : []

    // 1. Search Query filtering
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return false; // skip react elements
          return String(val).toLowerCase().includes(q)
        })
      })
    }

    // 2. Filter criteria filtering
    if (activeFilters && typeof activeFilters === 'object') {
      Object.entries(activeFilters).forEach(([filterKey, filterVal]) => {
        if (!filterVal || filterVal === 'All' || filterVal === '') return
        
        result = result.filter(row => {
          // Find row key matching filterKey (case-insensitive)
          const targetKey = Object.keys(row).find(k => k.toLowerCase() === filterKey.toLowerCase())
          if (!targetKey) return true
          
          const val = row[targetKey]
          if (val === null || val === undefined) return false
          return String(val).toLowerCase() === String(filterVal).toLowerCase()
        })
      })
    }

    return result
  }, [rows, searchQuery, activeFilters])

  // Sort filtered rows
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows

    return [...filteredRows].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]

      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''

      // Clean numbers, currency, and percentages for numeric sorting
      const parseNum = (val) => {
        if (typeof val === 'number') return val
        const str = String(val).trim()
        const parsed = parseFloat(str.replace(/[₹,%\s]|Units|Pcs|sq\.ft/gi, ''))
        return isNaN(parsed) ? str.toLowerCase() : parsed
      }

      const numA = parseNum(aVal)
      const numB = parseNum(bVal)

      if (typeof numA === 'number' && typeof numB === 'number') {
        return sortConfig.direction === 'asc' ? numA - numB : numB - numA
      }

      const strA = String(aVal).toLowerCase()
      const strB = String(bVal).toLowerCase()

      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredRows, sortConfig])

  // Total pages calculation
  const effectivePerPage = perPage === 'All' ? sortedRows.length || 1 : Number(perPage)
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / effectivePerPage))

  // Auto adjust currentPage if out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  // Reset page to 1 whenever search, filters, or sorting changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeFilters, sortConfig])

  // Paginated rows slice
  const paginatedRows = useMemo(() => {
    if (perPage === 'All') return sortedRows
    const start = (currentPage - 1) * effectivePerPage
    return sortedRows.slice(start, start + effectivePerPage)
  }, [sortedRows, currentPage, effectivePerPage, perPage])

  // Handle Sort Header Toggle
  const handleSort = (key) => {
    if (key === 'actions' || key === 'select') return // ignore non-sortable action columns
    
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' }
        if (prev.direction === 'desc') return { key: null, direction: 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  // Calculate pagination label bounds
  const startItem = sortedRows.length === 0 ? 0 : (currentPage - 1) * effectivePerPage + 1
  const endItem = perPage === 'All' ? sortedRows.length : Math.min(currentPage * effectivePerPage, sortedRows.length)

  // Empty state handling
  if (!rows || rows.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-note">{t('No records to display yet')}</div>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => {
              const isSortable = col.key !== 'actions' && col.key !== 'select' && col.sortable !== false
              const isCurrentSort = sortConfig.key === col.key
              
              return (
                <th
                  key={col.key}
                  className={isSortable ? `th-sortable ${isCurrentSort ? 'th-active' : ''}` : ''}
                  onClick={() => isSortable && handleSort(col.key)}
                  title={isSortable ? `${t('Click to sort by')} ${col.label}` : ''}
                >
                  <div className="th-content">
                    <span>{t(col.label)}</span>
                    {isSortable && (
                      <span className="sort-icon">
                        {isCurrentSort ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )
                        ) : (
                          <ArrowUpDown size={13} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px 18px', color: 'var(--stone)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <SearchX size={28} color="var(--stone)" />
                  <span>{t('No matching records found for your search/filter criteria.')}</span>
                  {onResetFilters && (
                    <button className="btn btn-ghost btn-sm" onClick={onResetFilters} style={{ marginTop: 6 }}>
                      {t('Reset Filters')}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            paginatedRows.map((row, i) => (
              <tr key={row.id || row.code || i}>
                {columns.map(col => {
                  let content = row[col.key]
                  if (col.render) content = col.render(row)
                  else if (col.key === 'status') content = <StatusBadge status={row.status} />
                  return <td key={col.key} className={col.mono ? 'mono' : ''}>{content}</td>
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Footer Controls */}
      {showPagination && sortedRows.length > 0 && (
        <div className="table-pagination">
          <div className="pagination-info">
            <span>
              {t('Showing')} <b>{startItem}</b>–<b>{endItem}</b> {t('of')} <b>{sortedRows.length}</b> {t('entries')}
              {filteredRows.length !== rows.length && (
                <small style={{ marginLeft: 6, color: 'var(--stone)' }}>
                  ({t('filtered from')} {rows.length} {t('total')})
                </small>
              )}
            </span>

            <div className="page-size-selector">
              <label htmlFor="per-page-select">{t('Rows per page:')}</label>
              <select
                id="per-page-select"
                className="page-size-select"
                value={perPage}
                onChange={(e) => {
                  const val = e.target.value === 'All' ? 'All' : Number(e.target.value)
                  setPerPage(val)
                  setCurrentPage(1)
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="All">{t('All')}</option>
              </select>
            </div>
          </div>

          {perPage !== 'All' && totalPages > 1 && (
            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title={t('First Page')}
              >
                <ChevronsLeft size={15} />
              </button>
              
              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                title={t('Previous Page')}
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first, last, and immediate neighbors
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  )
                })
                .map((page, index, array) => {
                  const prevPage = array[index - 1]
                  const showEllipsis = prevPage && page - prevPage > 1

                  return (
                    <span key={page} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      {showEllipsis && <span style={{ padding: '0 4px', color: 'var(--stone)' }}>…</span>}
                      <button
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </span>
                  )
                })}

              <button
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                title={t('Next Page')}
              >
                <ChevronRight size={15} />
              </button>

              <button
                className="page-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                title={t('Last Page')}
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
