import { useState, useEffect } from 'react'
import PageHeader from './PageHeader.jsx'
import { StatGrid, StatCard } from './StatCard.jsx'
import FilterBar from './FilterBar.jsx'
import DataTable from './DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Plus, X, CheckCircle2, AlertCircle, Edit3, Trash2 } from 'lucide-react'
import { api } from '../api/index.js'
import { exportToCSV } from '../utils/exportUtils.js'

export default function MasterPageTemplate({
  breadcrumbLabel, title, description, translationKey, icon: Icon, stats, columns = [], rows: defaultRows = [], filters = [], addLabel, searchPlaceholder, endpoint
}) {
  const { t } = useLanguage()
  const displayTitle = (translationKey && t(translationKey) !== translationKey ? t(translationKey) : title)
  const displayDesc = (translationKey && t(`${translationKey}Desc`) !== `${translationKey}Desc` ? t(`${translationKey}Desc`) : description)

  const [dataRows, setDataRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (endpoint) {
      fetchData()
    }
  }, [endpoint])

  const fetchData = async () => {
    if (!endpoint) return
    setLoading(true)
    setErrorMsg('')
    const res = await api.get(endpoint)
    if (res && res.success && Array.isArray(res.data)) {
      const mapped = res.data.map(item => ({
        ...item,
        displayId: item.employeeCode || item.customerCode || item.supplierCode || item.vendorCode || item.code || item.poNumber || item.orderNumber || item.batchNumber || item.deliveryNumber || item.invoiceNumber || item.paymentNumber || `ID-${item.id}`
      }))
      setDataRows(mapped)
    } else if (res && res.message) {
      setErrorMsg(res.message)
    }
    setLoading(false)
  }

  const handleOpenAddModal = () => {
    setEditingItem(null)
    setErrorMsg('')
    setStatusMsg('')
    const initial = {}
    columns.forEach(col => {
      if (col.key !== 'id' && col.key !== 'displayId') initial[col.key] = ''
    })
    setFormData(initial)
    setModalOpen(true)
  }

  const handleOpenEditModal = (row) => {
    setEditingItem(row)
    setErrorMsg('')
    setStatusMsg('')
    const initial = { ...row }
    setFormData(initial)
    setModalOpen(true)
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this ${displayTitle.toLowerCase()} record?`)) return
    if (endpoint && row.id) {
      const res = await api.delete(`${endpoint}/${row.id}`)
      if (res && res.success) {
        setStatusMsg('Record deleted successfully.')
        fetchData()
        setTimeout(() => setStatusMsg(''), 2500)
      } else {
        setErrorMsg(res.message || 'Failed to delete record.')
      }
    } else {
      setDataRows(prev => prev.filter(r => r.id !== row.id))
      setStatusMsg('Record removed.')
      setTimeout(() => setStatusMsg(''), 2500)
    }
  }

  const handleFormChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setStatusMsg('')

    if (endpoint) {
      let res;
      if (editingItem && editingItem.id) {
        res = await api.put(`${endpoint}/${editingItem.id}`, formData)
      } else {
        res = await api.post(endpoint, formData)
      }

      if (res && res.success) {
        setStatusMsg(editingItem ? 'Record updated successfully!' : 'Record saved to database successfully!')
        fetchData()
        setTimeout(() => { setStatusMsg(''); setModalOpen(false) }, 1000)
      } else {
        setErrorMsg(res.message || 'Error saving record to database')
      }
    } else {
      if (editingItem) {
        setDataRows(prev => prev.map(r => r.id === editingItem.id ? { ...r, ...formData } : r))
        setStatusMsg('Record updated!')
      } else {
        const newId = `REC-${Math.floor(1000 + Math.random() * 9000)}`
        setDataRows(prev => [{ id: newId, displayId: newId, ...formData, status: formData.status || 'Active' }, ...prev])
        setStatusMsg('Record added!')
      }
      setTimeout(() => { setStatusMsg(''); setModalOpen(false) }, 1000)
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedFilters({})
  }

  const handleExportCSV = () => {
    const filename = `${displayTitle.toLowerCase().replace(/\s+/g, '-')}-records.csv`
    exportToCSV(dataRows, columns, filename)
  }

  // Action column addition for Edit/Delete
  const augmentedColumns = [
    ...columns,
    {
      key: 'actions',
      label: t('Actions'),
      render: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" title={t('Edit')} onClick={() => handleOpenEditModal(row)} style={{ padding: '4px 8px' }}>
            <Edit3 size={14} color="var(--orange-deep)" />
          </button>
          <button className="btn btn-ghost btn-sm" title={t('Delete')} onClick={() => handleDelete(row)} style={{ padding: '4px 8px' }}>
            <Trash2 size={14} color="#d9534f" />
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('masters') }, { label: displayTitle }]}
        title={displayTitle}
        description={displayDesc}
        actions={[
          <button className="btn btn-primary" key="add" onClick={handleOpenAddModal}>
            <Plus size={16} /> {addLabel || `${t('addNew')} ${displayTitle}`}
          </button>
        ]}
      />

      {statusMsg && (
        <div className="auth-success" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="auth-error" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {stats && (
        <StatGrid>
          {stats.map((s, i) => {
            let liveValue = s.value
            const labelLower = (s.label || '').toLowerCase()
            if (labelLower.includes('total')) {
              liveValue = String(dataRows.length)
            } else if (labelLower.includes('active') || labelLower.includes('in stock') || labelLower.includes('operational')) {
              const activeCount = dataRows.filter(r => r.status === 'Active' || r.status === 'In Stock' || r.status === 'Operational').length
              liveValue = String(activeCount)
            }
            return <StatCard key={i} {...s} value={liveValue} label={t(s.label)} />
          })}
        </StatGrid>
      )}

      <FilterBar
        placeholder={searchPlaceholder || `Search ${displayTitle.toLowerCase()}...`}
        searchValue={search}
        onSearchChange={(val) => setSearch(val)}
        filters={filters}
        dataRows={dataRows}
        selectedFilters={selectedFilters}
        onFilterChange={(key, val) => setSelectedFilters(prev => ({ ...prev, [key]: val }))}
        onResetFilters={handleResetFilters}
        onExport={handleExportCSV}
      />

      {loading ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--stone)' }}>
          Loading live records from database...
        </div>
      ) : (
        <DataTable
          columns={augmentedColumns}
          rows={dataRows}
          searchQuery={search}
          activeFilters={selectedFilters}
          pageSize={10}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 540, padding: 24, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 18 }}>{editingItem ? `${t('Edit')} ${displayTitle}` : addLabel || `${t('addNew')} ${displayTitle}`}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>

            {statusMsg && (
              <div className="auth-success" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> {statusMsg}
              </div>
            )}

            {errorMsg && (
              <div className="auth-error" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {columns.filter(c => c.key !== 'id' && c.key !== 'actions' && c.key !== 'displayId').map(col => (
                <div className="field" key={col.key}>
                  <label htmlFor={col.key}>{t(col.label)}</label>
                  <input
                    id={col.key}
                    type="text"
                    placeholder={`Enter ${col.label.toLowerCase()}`}
                    value={formData[col.key] !== undefined ? formData[col.key] : ''}
                    onChange={(e) => handleFormChange(col.key, e.target.value)}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>{t('Cancel')}</button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? t('Update Record') : t('Save to Database')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
