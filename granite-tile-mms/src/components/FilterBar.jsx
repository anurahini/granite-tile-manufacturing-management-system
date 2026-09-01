import { Search, SlidersHorizontal, Download } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function FilterBar({ placeholder = 'Search...', filters = [], onAddNew, addLabel }) {
  const { t } = useLanguage()
  return (
    <div className="filter-bar">
      <div className="search-box">
        <Search size={16} />
        <input type="text" placeholder={placeholder} />
      </div>
      {filters.map((f) => (
        <select className="filter-select" key={f} defaultValue="">
          <option value="" disabled>{f}</option>
        </select>
      ))}
      <button className="btn btn-ghost btn-sm"><SlidersHorizontal size={15} /> {t('filtersLabel')}</button>
      <button className="btn btn-ghost btn-sm"><Download size={15} /> {t('exportLabel')}</button>
      {addLabel && (
        <button className="btn btn-primary btn-sm" onClick={onAddNew}>+ {addLabel}</button>
      )}
    </div>
  )
}
