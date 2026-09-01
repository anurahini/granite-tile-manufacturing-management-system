import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { products, photoLayerBackground } from '../../data/products.js'
import { IndianRupee, ArrowRight, X, Heart } from 'lucide-react'
import './Catalog.css'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const wishlisted = products.filter((p) => items.includes(p.id))

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Product Catalog', path: '/product-catalog' }, { label: 'Wishlist' }]}
        title="My Wishlist"
        description="Products you've saved for later, stored locally in your browser."
        actions={[
          <Link to="/product-catalog" className="btn btn-outline" key="browse">Continue Browsing</Link>
        ]}
      />

      {wishlisted.length === 0 ? (
        <div className="table-wrap">
          <div className="empty-note">
            <Heart size={24} style={{ marginBottom: 10, opacity: 0.4 }} /><br />
            Your wishlist is empty. Browse the <Link to="/product-catalog">Product Catalog</Link> and tap the heart icon to save items here.
          </div>
        </div>
      ) : (
        <div className="catalog-grid">
          {wishlisted.map((p) => (
            <div key={p.id} className="catalog-card">
              <div className="catalog-card-image" style={{ background: photoLayerBackground(p.category, p.swatch) }}>
                <button className="catalog-wishlist-btn active" onClick={() => removeFromWishlist(p.id)} aria-label="Remove from wishlist">
                  <X size={15} />
                </button>
              </div>
              <Link to={`/product-catalog/${p.id}`} className="catalog-card-body">
                <span className="catalog-code">{p.code}</span>
                <h3>{p.name}</h3>
                <p className="catalog-card-desc">{p.description}</p>
                <div className="catalog-card-footer">
                  <span className="catalog-price"><IndianRupee size={15} />{p.price} <small>/ {p.unit}</small></span>
                  <span className="catalog-view-link">View Details <ArrowRight size={14} /></span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
