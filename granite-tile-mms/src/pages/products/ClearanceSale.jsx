import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import { clearanceItems, getDiscountPercent } from '../../data/clearance.js'
import { categories, photoLayerBackground } from '../../data/products.js'
import { IndianRupee, Package, Tag, AlertTriangle, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../../api/index.js'
import './ClearanceSale.css'

const categoryKeyByLabel = Object.fromEntries(categories.map((c) => [c.label, c.key]))

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'

export default function ClearanceSale() {
  const [items, setItems] = useState(clearanceItems)
  const [loading, setLoading] = useState(false)

  // Modal State for Enquiry
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [selectedLot, setSelectedLot] = useState(null)
  const [enquiryForm, setEnquiryForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    requiredQuantity: 10,
    message: ''
  })
  const [enquiryStatus, setEnquiryStatus] = useState('')
  const [enquiryError, setEnquiryError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchClearance()
  }, [])

  const fetchClearance = async () => {
    setLoading(true)
    const res = await api.get('/damaged-products')
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data.map(d => ({
        id: d.id,
        name: d.productName,
        category: 'Granite Slabs',
        swatch: '#5a3d28',
        originalPrice: d.originalPrice,
        discountedPrice: d.clearancePrice,
        unit: 'sq.ft',
        damagePercent: d.damagePercentage,
        stock: d.damagedQuantity,
        note: d.reason,
        damageType: 'Transit Damage',
        image: d.image || DEFAULT_FALLBACK_IMAGE
      }))
      setItems(mapped)
    }
    setLoading(false)
  }

  const handleOpenEnquiry = (item) => {
    setSelectedLot(item)
    setEnquiryForm({
      customerName: '',
      phone: '',
      email: '',
      requiredQuantity: Math.min(item.stock, 10),
      message: `I am interested in acquiring ${item.name} (${item.stock} ${item.unit} lot).`
    })
    setEnquiryStatus('')
    setEnquiryError('')
    setEnquiryModalOpen(true)
  }

  const handleEnquirySubmit = async (e) => {
    e.preventDefault()
    setEnquiryStatus('')
    setEnquiryError('')

    if (!enquiryForm.customerName.trim() || !enquiryForm.phone.trim()) {
      setEnquiryError('Customer Name and Phone Number are required.')
      return
    }

    setSubmitting(true)
    const payload = {
      productLot: selectedLot ? selectedLot.name : 'Clearance Lot',
      customerName: enquiryForm.customerName.trim(),
      phone: enquiryForm.phone.trim(),
      email: enquiryForm.email.trim(),
      quantity: Number(enquiryForm.requiredQuantity || 1),
      message: enquiryForm.message,
      status: 'Pending'
    }

    const res = await api.post('/enquiries', payload)
    setSubmitting(false)

    if (res && res.success) {
      setEnquiryStatus('Enquiry submitted successfully! Our clearance team will contact you shortly.')
      setTimeout(() => {
        setEnquiryModalOpen(false)
        setEnquiryStatus('')
      }, 2000)
    } else {
      setEnquiryError(res.message || 'Failed to submit enquiry to database.')
    }
  }

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: 'Clearance Sale' }]}
        title="Damaged / Clearance Sale"
        description="Discounted stock from batch overruns and minor transit damage — stored separately with custom clearance pricing."
      />

      {loading ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--stone)' }}>
          Loading clearance stock from database...
        </div>
      ) : (
        <div className="clearance-grid">
          {items.map((item) => {
            const discount = getDiscountPercent(item) || item.damagePercent || 15
            const imageUrl = item.image || DEFAULT_FALLBACK_IMAGE

            return (
              <div className="clearance-card" key={item.id}>
                <div
                  className="clearance-image"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%), url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 180,
                    position: 'relative'
                  }}
                >
                  {discount > 0 && <span className="clearance-badge">{discount}% OFF</span>}
                </div>
                <div className="clearance-body">
                  <span className="pill" style={{ marginBottom: 10 }}>{item.category}</span>
                  {item.damageType && <span className="pill clearance-damage-type">{item.damageType}</span>}
                  <h3>{item.name}</h3>
                  <p className="clearance-note"><AlertTriangle size={13} /> {item.note}</p>

                  <div className="clearance-price-row">
                    {item.originalPrice !== item.discountedPrice && (
                      <span className="clearance-original"><IndianRupee size={13} />{item.originalPrice}</span>
                    )}
                    <span className="clearance-discounted"><IndianRupee size={17} />{item.discountedPrice}<small> / {item.unit}</small></span>
                  </div>

                  <div className="clearance-meta-row">
                    <span><Tag size={13} /> Damage: {item.damagePercent}%</span>
                    <span><Package size={13} /> {item.stock.toLocaleString('en-IN')} {item.unit} left</span>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                    onClick={() => handleOpenEnquiry(item)}
                  >
                    Enquire About This Lot
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ---------- Enquiry Modal ---------- */}
      {enquiryModalOpen && selectedLot && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 500, padding: 24, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18 }}>Enquire About Clearance Lot</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setEnquiryModalOpen(false)}><X size={18} /></button>
            </div>

            {enquiryStatus && (
              <div className="auth-success" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> {enquiryStatus}
              </div>
            )}

            {enquiryError && (
              <div className="auth-error" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {enquiryError}
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label>Product / Clearance Lot</label>
                <input type="text" value={selectedLot.name} readOnly style={{ background: 'var(--cream-light)', fontWeight: 600 }} />
              </div>

              <div className="field">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  required
                  value={enquiryForm.customerName}
                  onChange={(e) => setEnquiryForm(f => ({ ...f, customerName: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98xxx xxxxx"
                    required
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Required Quantity ({selectedLot.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedLot.stock}
                  value={enquiryForm.requiredQuantity}
                  onChange={(e) => setEnquiryForm(f => ({ ...f, requiredQuantity: e.target.value }))}
                />
              </div>

              <div className="field">
                <label>Message</label>
                <textarea
                  rows={3}
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEnquiryModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Enquiry to MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
