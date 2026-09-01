import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import { getProductById, photoLayerBackground } from '../../data/products.js'
import { useWishlist } from '../../context/WishlistContext.jsx'
import {
  IndianRupee, Calculator, ShoppingCart, ArrowLeft, Check, Heart,
  FileText, Download, X, CheckCircle2, Star
} from 'lucide-react'
import './ProductDetails.css'

// Parses a "600x600mm" style size string into a tile area in sq.ft.
// Falls back to a 2x2 ft (4 sq.ft) tile if the format doesn't match
// (e.g. granite slabs quoted as "8x4 ft / 18mm").
function tileAreaSqFt(sizeStr) {
  const mmMatch = sizeStr.match(/(\d+)x(\d+)mm/)
  if (mmMatch) {
    const wFt = Number(mmMatch[1]) / 304.8
    const hFt = Number(mmMatch[2]) / 304.8
    return wFt * hFt
  }
  const ftMatch = sizeStr.match(/(\d+)x(\d+)\s*ft/)
  if (ftMatch) return Number(ftMatch[1]) * Number(ftMatch[2])
  return 4
}

function downloadBrochure(product, color, size, finish) {
  const content = `GRANITE & TILE MANUFACTURING MANAGEMENT SYSTEM
Product Brochure
================================

Product Name : ${product.name}
Product Code : ${product.code}
Category     : ${product.category}
Selected Color  : ${color}
Selected Size   : ${size}
Selected Finish : ${finish}
Thickness    : ${product.thickness}
Price        : Rs. ${product.price} per ${product.unit}
Stock Available : ${product.stock} ${product.unit}

Description
-----------
${product.description}

All Available Colors: ${product.colors.map((c) => c.name).join(', ')}
All Available Sizes : ${product.sizes.join(', ')}
All Available Finishes: ${product.finishes.join(', ')}

--------------------------------
This is a demo brochure generated on the client side for this project.
No real PDF/print pipeline is connected — contact our sales team for
an official quotation and specification sheet.
`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${product.code}-brochure.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product?.colors?.[0]?.name)
  const [size, setSize] = useState(product?.sizes?.[0])
  const [finish, setFinish] = useState(product?.finishes?.[0])

  const [length, setLength] = useState(10)
  const [width, setWidth] = useState(10)

  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteSent, setQuoteSent] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', message: '' })

  if (!product) {
    return (
      <>
        <PageHeader
          trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: 'Not Found' }]}
          title="Product Not Found"
          description="We couldn't find that product in the catalog."
        />
        <Link to="/product-catalog" className="btn btn-primary"><ArrowLeft size={16} /> Back to Catalog</Link>
      </>
    )
  }

  // Four gallery "shots" of the same real category photo, each with a
  // different strength of the product's own colour-swatch overlay — gives
  // a sense of multiple angles while only needing one licensed photo.
  const galleryOpacities = ['80', '5C', '38', '1A']
  const gallery = galleryOpacities.map((op) => photoLayerBackground(product.category, product.swatch, op))
  const area = Number(length || 0) * Number(width || 0)
  const totalPrice = (product.price * area).toLocaleString('en-IN', { maximumFractionDigits: 0 })
  const requiredTiles = Math.ceil(area / tileAreaSqFt(size || product.sizes[0])) || 0

  const submitQuote = (e) => {
    e.preventDefault()
    setQuoteSent(true)
  }

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: product.name }]}
        title={product.name}
        description={product.description}
        actions={[
          <button className="btn btn-outline" key="back" onClick={() => navigate('/product-catalog')}>
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        ]}
      />

      <div className="grid-2">
        {/* ---------- Gallery ---------- */}
        <div>
          <div className="pd-hero-wrap">
            <div
              className="pd-hero-image"
              style={{ background: gallery[activeImage] }}
            />
            <button
              className={`pd-wishlist-btn ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
            >
              <Heart size={17} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="pd-thumb-row">
            {gallery.map((bg, i) => (
              <button
                key={i}
                className={`pd-thumb ${activeImage === i ? 'active' : ''}`}
                style={{ background: bg }}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>

          <div className="pd-specs-card">
            <div><span>Product Code</span><b className="mono">{product.code}</b></div>
            <div><span>Thickness</span><b>{product.thickness}</b></div>
            <div><span>Stock Available</span><b>{product.stock.toLocaleString('en-IN')} {product.unit}</b></div>
          </div>

          <div className="pd-action-row">
            <button className="btn btn-outline" onClick={() => downloadBrochure(product, color, size, finish)}>
              <Download size={16} /> Download Brochure
            </button>
            <button className="btn btn-dark" onClick={() => { setQuoteOpen(true); setQuoteSent(false) }}>
              <FileText size={16} /> Request Quotation
            </button>
          </div>
        </div>

        {/* ---------- Details & selectors ---------- */}
        <div className="card pd-details-card">
          <div className="pd-price-row">
            <span className="pd-price"><IndianRupee size={20} />{product.price}</span>
            <span className="pd-price-unit">per {product.unit}</span>
            <span className="pd-rating-chip"><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)} / 5</span>
          </div>

          <div className="pd-section">
            <label>Color</label>
            <div className="pd-color-row">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  className={`pd-color-swatch ${color === c.name ? 'active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                >
                  {color === c.name && <Check size={14} color={c.hex === '#f6f3ec' || c.hex === '#efe6d3' ? '#332c26' : '#fff'} />}
                </button>
              ))}
            </div>
            <span className="pd-selected-label">{color}</span>
          </div>

          <div className="pd-section">
            <label>Size</label>
            <div className="pd-pill-row">
              {product.sizes.map((s) => (
                <button key={s} className={`pd-pill ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="pd-section">
            <label>Finish</label>
            <div className="pd-pill-row">
              {product.finishes.map((f) => (
                <button key={f} className={`pd-pill ${finish === f ? 'active' : ''}`} onClick={() => setFinish(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="pd-section">
            <label><Calculator size={14} style={{ verticalAlign: -2, marginRight: 6 }} /> Area Calculator</label>
            <div className="pd-calc-dims">
              <div className="field">
                <label>Length (ft)</label>
                <input type="number" min="0" value={length} onChange={(e) => setLength(e.target.value)} />
              </div>
              <div className="field">
                <label>Width (ft)</label>
                <input type="number" min="0" value={width} onChange={(e) => setWidth(e.target.value)} />
              </div>
            </div>
            <div className="pd-calc-results">
              <div><span>Total Area</span><b>{area.toLocaleString('en-IN')} sq.ft</b></div>
              <div><span>Tiles Required</span><b>{requiredTiles.toLocaleString('en-IN')} pcs</b></div>
              <div className="pd-calc-highlight"><span>Estimated Cost</span><b><IndianRupee size={16} style={{ verticalAlign: -2 }} />{totalPrice}</b></div>
            </div>
          </div>

          <button className="btn btn-primary auth-submit" style={{ marginTop: 18 }}>
            <ShoppingCart size={16} /> Add to Sales Order
          </button>
        </div>
      </div>

      {/* ---------- Request Quotation modal ---------- */}
      {quoteOpen && (
        <div className="pd-modal-backdrop" onClick={() => setQuoteOpen(false)}>
          <div className="pd-modal card" onClick={(e) => e.stopPropagation()}>
            <button className="pd-modal-close" onClick={() => setQuoteOpen(false)} aria-label="Close"><X size={18} /></button>
            {quoteSent ? (
              <div className="pd-modal-success">
                <CheckCircle2 size={40} color="var(--success)" />
                <h3>Quotation Requested</h3>
                <p>Thanks! Our sales team will reach out about <b>{product.name}</b> shortly. (Demo only — no request is actually sent.)</p>
                <button className="btn btn-primary" onClick={() => setQuoteOpen(false)}>Close</button>
              </div>
            ) : (
              <form onSubmit={submitQuote}>
                <h3 style={{ marginBottom: 4 }}>Request a Quotation</h3>
                <p style={{ color: 'var(--stone)', fontSize: 13.5, marginBottom: 18 }}>for {product.name} — {color}, {size}, {finish}</p>
                <div className="field" style={{ marginBottom: 14 }}>
                  <label>Your Name</label>
                  <input required value={quoteForm.name} onChange={(e) => setQuoteForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
                </div>
                <div className="field" style={{ marginBottom: 14 }}>
                  <label>Phone Number</label>
                  <input required value={quoteForm.phone} onChange={(e) => setQuoteForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxx xxxxx" />
                </div>
                <div className="field" style={{ marginBottom: 18 }}>
                  <label>Message (optional)</label>
                  <textarea rows={3} value={quoteForm.message} onChange={(e) => setQuoteForm((f) => ({ ...f, message: e.target.value }))} placeholder="Quantity needed, project location, timeline..." />
                </div>
                <button type="submit" className="btn btn-primary auth-submit">Submit Request</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
