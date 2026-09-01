import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import { products, categories } from '../../data/products.js'
import { Scale, IndianRupee, Star, X } from 'lucide-react'
import './Compare.css'

const categoryLabel = (key) => categories.find((c) => c.key === key)?.label || key
const MAX_SLOTS = 4

function mockAttr(id, options) {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) % 997
  return options[hash % options.length]
}

function buildSpecRows(items) {
  const waterOptions = ['Excellent', 'Very Good', 'Good', 'Moderate']
  const usageOptions = ['Indoor & Outdoor', 'Indoor Only', 'Wet Areas', 'High-Traffic Zones']

  const rowDefs = [
    { label: 'Price / sq.ft', get: (p) => `₹${p.price}` },
    { label: 'Size', get: (p) => p.sizes[0] },
    { label: 'Thickness', get: (p) => p.thickness },
    { label: 'Material', get: (p) => p.material },
    { label: 'Category', get: (p) => categoryLabel(p.category) },
    { label: 'Colour', get: (p) => p.colors[0].name },
    { label: 'Finish', get: (p) => p.finishes.join(', ') },
    { label: 'Rating', get: (p) => `${p.rating.toFixed(1)} / 5` },
    { label: 'Stock Available', get: (p) => `${p.stock.toLocaleString('en-IN')} sq.ft` },
    { label: 'Water Resistance', get: (p) => mockAttr(p.id + 'w', waterOptions) },
    { label: 'Recommended Usage', get: (p) => mockAttr(p.id + 'u', usageOptions) },
  ]
  return rowDefs.map((row) => ({ label: row.label, values: items.map(row.get) }))
}

function ProductPicker({ label, value, onChange, excludeIds }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">None selected</option>
        {products.filter((p) => !excludeIds.includes(p.id)).map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  )
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams()

  const ids = useMemo(() => {
    const fromMulti = searchParams.get('ids')
    if (fromMulti) return fromMulti.split(',').filter(Boolean).slice(0, MAX_SLOTS)
    const a = searchParams.get('a')
    const b = searchParams.get('b')
    return [a, b].filter(Boolean)
  }, [searchParams])

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => ids[i] || '')

  const setSlot = (index, id) => {
    const next = [...slots]
    next[index] = id
    setSearchParams({ ids: next.filter(Boolean).join(',') })
  }

  const selectedProducts = slots.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const rows = useMemo(() => (selectedProducts.length >= 2 ? buildSpecRows(selectedProducts) : []), [selectedProducts])

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: 'Compare Products' }]}
        title="Compare Products"
        description="Select 2 to 4 tiles or granite slabs to compare price, size, material, rating and performance side by side."
      />

      <div className="card compare-picker-card">
        <div className="form-grid">
          {slots.map((val, i) => (
            <ProductPicker
              key={i}
              label={`Product ${String.fromCharCode(65 + i)}`}
              value={val}
              onChange={(id) => setSlot(i, id)}
              excludeIds={slots.filter((_, j) => j !== i)}
            />
          ))}
        </div>
      </div>

      {selectedProducts.length >= 2 ? (
        <div className="compare-table-scroll">
          <div className="compare-table-wrap" style={{ minWidth: 180 + selectedProducts.length * 220 }}>
            <div className="compare-head-row" style={{ gridTemplateColumns: `180px repeat(${selectedProducts.length}, 1fr)` }}>
              <div className="compare-head-label"><Scale size={16} /> Specification</div>
              {selectedProducts.map((p) => (
                <div className="compare-head-product" key={p.id}>
                  <div className="compare-swatch" style={{ background: `linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})` }} />
                  <div>
                    <div className="compare-product-name">{p.name}</div>
                    <div className="compare-product-price"><IndianRupee size={13} />{p.price} / {p.unit}</div>
                    <div className="compare-product-rating"><Star size={12} fill="currentColor" /> {p.rating.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
            {rows.map((row) => (
              <div className="compare-row" key={row.label} style={{ gridTemplateColumns: `180px repeat(${selectedProducts.length}, 1fr)` }}>
                <div className="compare-row-label">{row.label}</div>
                {row.values.map((v, i) => <div className="compare-row-value" key={i}>{v}</div>)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="table-wrap"><div className="empty-note">Select at least 2 products above to see a full side-by-side comparison.</div></div>
      )}
    </>
  )
}
