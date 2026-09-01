import PageHeader from '../../components/PageHeader.jsx'
import { clearanceItems, getDiscountPercent } from '../../data/clearance.js'
import { categories, photoLayerBackground } from '../../data/products.js'
import { IndianRupee, Package, Tag, AlertTriangle } from 'lucide-react'
import './ClearanceSale.css'

const categoryKeyByLabel = Object.fromEntries(categories.map((c) => [c.label, c.key]))

export default function ClearanceSale() {
  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: 'Clearance Sale' }]}
        title="Damaged / Clearance Sale"
        description="Discounted stock from batch overruns and minor transit damage — while supplies last."
      />

      <div className="clearance-grid">
        {clearanceItems.map((item) => {
          const discount = getDiscountPercent(item)
          return (
            <div className="clearance-card" key={item.id}>
              <div className="clearance-image" style={{ background: photoLayerBackground(categoryKeyByLabel[item.category], item.swatch) }}>
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

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
                  Enquire About This Lot
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
