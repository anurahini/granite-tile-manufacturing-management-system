import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import { categories, colorFilters, sizeFilters, materialFilters, priceRangeFilters, ratingFilters, sortOptions, filterProducts, photoLayerBackground } from '../../data/products.js'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useCompare } from '../../context/CompareContext.jsx'
import { Ruler, Palette, IndianRupee, ArrowRight, Heart, Scale, Package, X, Layers, Star, Sparkles, ArrowUpDown } from 'lucide-react'
import './Catalog.css'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || categories[0].key

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeColor, setActiveColor] = useState('')
  const [activeSize, setActiveSize] = useState('')
  const [activeMaterial, setActiveMaterial] = useState('')
  const [activePrice, setActivePrice] = useState('')
  const [activeRating, setActiveRating] = useState('')
  const [activeSort, setActiveSort] = useState('price-asc')

  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { selected, toggleCompare, clearCompare, isSelected, maxCompare } = useCompare()

  const items = useMemo(
    () => filterProducts({
      category: activeCategory,
      color: activeColor || undefined,
      size: activeSize || undefined,
      material: activeMaterial || undefined,
      priceRange: activePrice || undefined,
      minRating: activeRating ? Number(activeRating) : undefined,
      sortBy: activeSort,
    }),
    [activeCategory, activeColor, activeSize, activeMaterial, activePrice, activeRating, activeSort]
  )

  const selectCategory = (key) => {
    setActiveCategory(key)
    setSearchParams(key === categories[0].key ? {} : { category: key })
  }

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog' }]}
        title="Product Catalog & Tile Collection"
        description="Explore our full collection of Granite Slabs, Italian Marbles, Designed Encaustic Tiles, Wooden Finish Planks, and Vitrified Tiles."
        actions={[
          <button className="btn btn-primary btn-sm" key="visualize" onClick={() => navigate('/room-visualizer')}>
            <Sparkles size={15} /> AI Room Visualizer
          </button>
        ]}
      />

      {/* Category Tabs */}
      <div className="tab-row">
        {categories.map((c) => (
          <button
            key={c.key}
            className={`tab-item ${activeCategory === c.key ? 'active' : ''}`}
            onClick={() => selectCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Filter Bar & Sorting Control */}
      <div className="catalog-filter-bar">
        {/* SORTING SELECTOR */}
        <div className="catalog-filter-group" style={{ background: 'var(--orange-subtle)', borderRadius: 8, padding: '6px 12px', border: '1px solid var(--orange)' }}>
          <span className="catalog-filter-label" style={{ color: 'var(--orange-deep)', fontWeight: 800 }}>
            <ArrowUpDown size={14} /> Sort By
          </span>
          <select
            className="tune-select"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            style={{ fontSize: 13, padding: '4px 8px', fontWeight: 700, borderColor: 'var(--orange)' }}
          >
            {sortOptions.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="catalog-filter-group">
          <span className="catalog-filter-label"><Palette size={13} /> Colour</span>
          <div className="catalog-chip-row">
            <button className={`catalog-chip ${!activeColor ? 'active' : ''}`} onClick={() => setActiveColor('')}>All</button>
            {colorFilters.map((c) => (
              <button key={c.key} className={`catalog-chip ${activeColor === c.key ? 'active' : ''}`} onClick={() => setActiveColor(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-filter-group">
          <span className="catalog-filter-label"><Ruler size={13} /> Size</span>
          <div className="catalog-chip-row">
            <button className={`catalog-chip ${!activeSize ? 'active' : ''}`} onClick={() => setActiveSize('')}>All</button>
            {sizeFilters.map((s) => (
              <button key={s.key} className={`catalog-chip ${activeSize === s.key ? 'active' : ''}`} onClick={() => setActiveSize(s.key)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-filter-group">
          <span className="catalog-filter-label"><Layers size={13} /> Material</span>
          <div className="catalog-chip-row">
            <button className={`catalog-chip ${!activeMaterial ? 'active' : ''}`} onClick={() => setActiveMaterial('')}>All</button>
            {materialFilters.map((m) => (
              <button key={m.key} className={`catalog-chip ${activeMaterial === m.key ? 'active' : ''}`} onClick={() => setActiveMaterial(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-filter-group">
          <span className="catalog-filter-label"><IndianRupee size={13} /> Price</span>
          <div className="catalog-chip-row">
            <button className={`catalog-chip ${!activePrice ? 'active' : ''}`} onClick={() => setActivePrice('')}>All</button>
            {priceRangeFilters.map((r) => (
              <button key={r.key} className={`catalog-chip ${activePrice === r.key ? 'active' : ''}`} onClick={() => setActivePrice(r.key)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-filter-group">
          <span className="catalog-filter-label"><Star size={13} /> Rating</span>
          <div className="catalog-chip-row">
            <button className={`catalog-chip ${!activeRating ? 'active' : ''}`} onClick={() => setActiveRating('')}>All</button>
            {ratingFilters.map((r) => (
              <button key={r.key} className={`catalog-chip ${activeRating === r.key ? 'active' : ''}`} onClick={() => setActiveRating(r.key)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="catalog-compare-bar">
          <span><Scale size={15} /> {selected.length} of {maxCompare} products selected for comparison</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={clearCompare}><X size={14} /> Clear</button>
            <button
              className="btn btn-primary btn-sm"
              disabled={selected.length < 2}
              onClick={() => navigate(`/compare?ids=${selected.join(',')}`)}
            >
              Compare Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="table-wrap"><div className="empty-note">No products match this filter combination. Try adjusting a filter.</div></div>
      ) : (
        <div className="catalog-grid">
          {items.map((p) => (
            <div key={p.id} className="catalog-card">
              <div className="catalog-card-image" style={{ background: photoLayerBackground(p.category, p.swatch) }}>
                <button
                  className={`catalog-wishlist-btn ${isWishlisted(p.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(p.id)}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={15} fill={isWishlisted(p.id) ? 'currentColor' : 'none'} />
                </button>
                <span className="catalog-rating-badge"><Star size={11} fill="currentColor" /> {p.rating.toFixed(1)}</span>
              </div>
              <div className="catalog-card-body" onClick={() => navigate(`/product-catalog/${p.id}`)}>
                <div className="catalog-code-row">
                  <span className="catalog-code">{p.code}</span>
                  <span className="pill">{p.material}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="catalog-card-desc">{p.description}</p>
                <div className="catalog-card-meta">
                  <span><Ruler size={13} /> {p.sizes[0]}</span>
                  <span><Package size={13} /> {p.stock.toLocaleString('en-IN')} in stock</span>
                </div>
                <div className="catalog-card-footer">
                  <span className="catalog-price"><IndianRupee size={15} />{p.price} <small>/ {p.unit}</small></span>
                  <span className="catalog-view-link">View Details <ArrowRight size={14} /></span>
                </div>
              </div>
              <label className="catalog-compare-check">
                <input type="checkbox" checked={isSelected(p.id)} onChange={() => toggleCompare(p.id)} />
                Add to compare
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="catalog-footer-links">
        <Link to="/wishlist" className="btn btn-outline btn-sm"><Heart size={14} /> View Wishlist</Link>
        <Link to="/clearance-sale" className="btn btn-outline btn-sm">Clearance Sale <ArrowRight size={14} /></Link>
      </div>
    </>
  )
}
