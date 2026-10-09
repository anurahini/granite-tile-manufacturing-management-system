import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from './PageHeader.jsx'
import FilterBar from './FilterBar.jsx'
import DataTable from './DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { FileText, Save, RotateCcw, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react'
import { api } from '../api/index.js'
import { exportToCSV } from '../utils/exportUtils.js'

export default function TransactionPageTemplate({
  breadcrumbLabel, title, description, translationKey, formFields, summary, columns = [], rows: defaultRows = [], filters = ['Status'], endpoint
}) {
  const { t } = useLanguage()
  const location = useLocation()
  const displayTitle = (translationKey && t(translationKey) !== translationKey ? t(translationKey) : title)
  const displayDesc = (translationKey && t(`${translationKey}Desc`) !== `${translationKey}Desc` ? t(`${translationKey}Desc`) : description)

  const [dataRows, setDataRows] = useState([])
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Search & Filtering state for transactions table
  const [search, setSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})

  useEffect(() => {
    if (location.state && location.state.fromCatalog) {
      setFormData(prev => ({
        ...prev,
        'Product': location.state.product || prev['Product'],
        'Quantity': location.state.quantity || prev['Quantity'],
        'Rate per Unit': location.state.price || prev['Rate per Unit']
      }))
      setStatusMsg(`Product '${location.state.product}' (${location.state.quantity} pcs) added from catalog! Select customer to finalize order.`)
    }
  }, [location.state])

  useEffect(() => {
    if (endpoint) {
      fetchRecords()
    }
  }, [endpoint])

  const fetchRecords = async () => {
    if (!endpoint) return
    setLoading(true)
    setErrorMsg('')
    const res = await api.get(endpoint)
    if (res && res.success && Array.isArray(res.data)) {
      const mapped = res.data.map(item => ({
        ...item,
        id: item.poNumber || item.orderNumber || item.deliveryNumber || item.invoiceNumber || item.paymentNumber || item.batchNumber || `REC-${item.id}`,
        dbId: item.id,
        supplier: item.supplierName || item.supplier || 'N/A',
        customer: item.customerName || item.customer || 'N/A',
        material: item.productName || item.material || 'N/A',
        product: item.productName || item.product || 'N/A',
        qty: item.quantity ? `${item.quantity} Units` : item.qty || 'N/A',
        amount: item.totalAmount ? `₹${item.totalAmount.toLocaleString('en-IN')}` : item.amount || 'N/A',
        status: item.status || 'Active'
      }))
      setDataRows(mapped)
    } else if (res && res.message) {
      setErrorMsg(res.message)
    }
    setLoading(false)
  }

  const handleInputChange = (label, val) => {
    setFormData(prev => ({ ...prev, [label]: val }))
  }

  const handleReset = () => {
    setFormData({})
    setStatusMsg('')
    setErrorMsg('')
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete this transaction record?`)) return
    if (endpoint && row.dbId) {
      const res = await api.delete(`${endpoint}/${row.dbId}`)
      if (res && res.success) {
        setStatusMsg('Transaction record deleted.')
        fetchRecords()
        setTimeout(() => setStatusMsg(''), 2500)
      } else {
        setErrorMsg(res.message || 'Failed to delete transaction.')
      }
    } else {
      setDataRows(prev => prev.filter(r => r.id !== row.id))
      setStatusMsg('Record removed.')
      setTimeout(() => setStatusMsg(''), 2500)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setErrorMsg('')

    if (endpoint) {
      const payload = {
        supplierName: formData['Supplier'] || formData['Supplier Name'] || 'Granite Craft Mining Co.',
        customerName: formData['Customer'] || formData['Customer Name'] || 'Sri Lakshmi Builders',
        productName: formData['Material'] || formData['Product'] || formData['Product / Material'] || formData['Product Name'] || 'Tan Brown Granite',
        quantity: Number(formData['Quantity'] || formData['Batch Quantity'] || formData['Qty'] || 10),
        unitPrice: Number(formData['Rate per Unit'] || formData['Unit Price'] || formData['Price'] || 185),
        price: Number(formData['Rate per Unit'] || formData['Price'] || formData['Unit Price'] || 185),
        gst: Number(formData['GST %'] || 18),
        discount: Number(formData['Discount %'] || 0),
        paymentMethod: formData['Payment Terms'] || formData['Payment Mode'] || formData['Payment Method'] || 'Bank Transfer',
        destination: formData['Destination'] || 'Site Delivery',
        invoiceNumber: formData['Invoice Ref.'] || formData['Invoice No.'] || formData['Invoice Number']
      }

      const res = await api.post(endpoint, payload)
      if (res && res.success) {
        setStatusMsg('Transaction saved to MySQL database successfully! Inventory & linked records updated.')
        fetchRecords()
        setFormData({})
        setTimeout(() => setStatusMsg(''), 3000)
      } else {
        setErrorMsg(res.message || 'Error saving transaction')
      }
    } else {
      const newRec = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier: formData['Supplier'] || 'Kanchi Quarries Pvt Ltd',
        material: formData['Material'] || 'Raw Granite Blocks',
        qty: formData['Quantity'] ? `${formData['Quantity']} Pcs` : '10 Pcs',
        amount: '₹4,50,000',
        status: 'Approved'
      }
      setDataRows(prev => [newRec, ...prev])
      setStatusMsg('Transaction saved successfully!')
      setFormData({})
      setTimeout(() => setStatusMsg(''), 3000)
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedFilters({})
  }

  const handleExportCSV = () => {
    const filename = `${displayTitle.toLowerCase().replace(/\s+/g, '-')}-transactions.csv`
    exportToCSV(dataRows, columns, filename)
  }

  const augmentedColumns = [
    ...columns,
    {
      key: 'actions',
      label: t('Actions'),
      render: (row) => (
        <button className="btn btn-ghost btn-sm" title={t('Delete')} onClick={() => handleDelete(row)} style={{ padding: '4px 8px' }}>
          <Trash2 size={14} color="#d9534f" />
        </button>
      )
    }
  ]

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('transactions') }, { label: displayTitle }]}
        title={displayTitle}
        description={displayDesc}
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

      <div className="grid-2">
        <form onSubmit={handleSubmit} className="card facet-corner" style={{ padding: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <FileText size={18} color="var(--orange-deep)" />
            <h3 style={{ fontSize: 17, fontFamily: 'var(--font-display)' }}>{displayTitle} {t('Details') || 'Details'}</h3>
          </div>

          <div className="form-grid">
            {formFields.map((f) => (
              <div className="field" key={f.label}>
                <label>{t(f.label)}</label>
                {f.type === 'select' ? (
                  <select
                    value={formData[f.label] || ''}
                    onChange={(e) => handleInputChange(f.label, e.target.value)}
                  >
                    <option value="" disabled>Select {f.label.toLowerCase()}</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder={f.placeholder || ''}
                    value={formData[f.label] || ''}
                    onChange={(e) => handleInputChange(f.label, e.target.value)}
                  />
                ) : (
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder || ''}
                    value={formData[f.label] || ''}
                    onChange={(e) => handleInputChange(f.label, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary"><Save size={16} /> {t('Save')} {displayTitle}</button>
            <button type="button" className="btn btn-outline" onClick={handleReset}><RotateCcw size={16} /> {t('Reset Form')}</button>
          </div>
        </form>

        <div className="card" style={{ padding: 26 }}>
          <h3 style={{ fontSize: 17, marginBottom: 18, fontFamily: 'var(--font-display)' }}>{t('Summary') || 'Summary'}</h3>
          {summary.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: i < summary.length - 1 ? '1px solid var(--cream-line)' : 'none',
              fontWeight: row.strong ? 700 : 500, color: row.strong ? 'var(--charcoal)' : 'var(--stone-dark)',
              fontSize: row.strong ? 15.5 : 14,
            }}>
              <span>{t(row.label)}</span>
              <span style={row.strong ? { color: 'var(--orange-deep)', fontFamily: 'var(--font-mono)' } : { fontFamily: 'var(--font-mono)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>{displayTitle} {t('History')}</h3>
      </div>

      <FilterBar
        placeholder={`Search ${displayTitle.toLowerCase()}...`}
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
        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--stone)' }}>
          Loading transaction records from database...
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
    </>
  )
}
