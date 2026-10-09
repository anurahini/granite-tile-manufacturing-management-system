import { Search, Download, X, RotateCcw } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function FilterBar({
  placeholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters = [],
  dataRows = [],
  selectedFilters = {},
  onFilterChange,
  onResetFilters,
  onExport,
  onAddNew,
  addLabel
}) {
  const { t } = useLanguage()

  // Helper to extract unique options for a filter key from dataRows
  const getFilterOptions = (filterItem) => {
    if (typeof filterItem === 'object' && Array.isArray(filterItem.options)) {
      return filterItem.options
    }

    const key = typeof filterItem === 'object' ? filterItem.key : filterItem
    if (!key || !dataRows || dataRows.length === 0) return []

    // Find row key matching filter key (case insensitive)
    const uniqueVals = new Set()
    dataRows.forEach(row => {
      const rowKey = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase())
      if (rowKey && row[rowKey] !== undefined && row[rowKey] !== null && row[rowKey] !== '') {
        const strVal = String(row[rowKey]).trim()
        if (strVal) uniqueVals.add(strVal)
      }
    })

    return Array.from(uniqueVals).sort()
  }

  const hasActiveFilters = Boolean(searchValue) || Object.values(selectedFilters).some(v => v && v !== 'All' && v !== '')

  return (
    <div className="filter-bar">
      {/* Search Input Box */}
      <div className="search-box">
        <Search size={16} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
        {searchValue && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange && onSearchChange('')}
            title={t('Clear search')}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dynamic Filter Dropdowns */}
      {filters.map((filterItem) => {
        const filterKey = typeof filterItem === 'object' ? filterItem.key : filterItem
        const filterLabel = typeof filterItem === 'object' ? (filterItem.label || filterItem.key) : filterItem
        const options = getFilterOptions(filterItem)
        const currentVal = selectedFilters[filterKey] || ''

        return (
          <select
            className="filter-select"
            key={filterKey}
            value={currentVal}
            onChange={(e) => onFilterChange && onFilterChange(filterKey, e.target.value)}
          >
            <option value="">{t('All')} {t(filterLabel)}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )
      })}

      {/* Reset Filters Action */}
      {hasActiveFilters && onResetFilters && (
        <button className="btn btn-ghost btn-sm" onClick={onResetFilters} style={{ color: 'var(--orange-deep)' }}>
          <RotateCcw size={14} /> {t('Reset Filters')}
        </button>
      )}

      {/* Export to CSV Button */}
      {onExport && (
        <button className="btn btn-ghost btn-sm" onClick={onExport} title={t('Export dataset to CSV')}>
          <Download size={15} /> {t('Export CSV')}
        </button>
      )}

      {/* Optional Add New Record Button */}
      {addLabel && onAddNew && (
        <button className="btn btn-primary btn-sm" onClick={onAddNew}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}
