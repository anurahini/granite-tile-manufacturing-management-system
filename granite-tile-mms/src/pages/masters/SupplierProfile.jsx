import { useParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getSupplierById } from '../../data/suppliers.js'
import {
  ArrowLeft, Phone, Mail, MapPin, Star, Truck, Calendar,
  ClipboardList, Gauge, BadgeCheck
} from 'lucide-react'
import './SupplierProfile.css'

export default function SupplierProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const supplier = getSupplierById(id)

  if (!supplier) {
    return (
      <>
        <PageHeader
          trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Masters' }, { label: 'Supplier Master', path: '/supplier-master' }, { label: 'Not Found' }]}
          title="Supplier Not Found"
          description="We couldn't find that supplier record."
        />
        <Link to="/supplier-master" className="btn btn-primary"><ArrowLeft size={16} /> Back to Supplier Master</Link>
      </>
    )
  }

  const initials = supplier.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Masters' }, { label: 'Supplier Master', path: '/supplier-master' }, { label: supplier.name }]}
        title="Supplier Profile"
        description="Full contact, GST and performance details for this supplier."
        actions={[
          <button className="btn btn-outline" key="back" onClick={() => navigate('/supplier-master')}>
            <ArrowLeft size={16} /> Back to Supplier Master
          </button>
        ]}
      />

      <div className="grid-2">
        <div className="card supplier-profile-card">
          <div className="supplier-photo-block">
            <div className="supplier-photo">{initials}</div>
            <div className="supplier-logo-badge"><BadgeCheck size={13} /> Verified Supplier</div>
          </div>
          <h2 style={{ marginTop: 16, fontSize: 21 }}>{supplier.name}</h2>
          <div className="supplier-rating-row">
            <Star size={15} fill="currentColor" color="#e0a83f" /> {supplier.rating.toFixed(1)} / 5
            <span className="pill" style={{ marginLeft: 10 }}>{supplier.material}</span>
          </div>
          <StatusBadge status={supplier.status} />

          <div className="divider" />

          <div className="supplier-contact-list">
            <div><Phone size={15} /> {supplier.phone}</div>
            <div><Mail size={15} /> {supplier.email}</div>
            <div><MapPin size={15} /> {supplier.address}</div>
            <div><Calendar size={15} /> Supplier since {supplier.since}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Delivery Performance</h3>
            <div className="supplier-perf-bar-wrap">
              <div className="supplier-perf-bar" style={{ width: `${supplier.deliveryPerformance}%` }} />
            </div>
            <div className="supplier-perf-label">
              <Gauge size={14} /> {supplier.deliveryPerformance}% on-time delivery rate
            </div>
          </div>

          <div className="stat-grid" style={{ marginBottom: 0 }}>
            <div className="stat-card">
              <div>
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{supplier.totalOrders}</div>
              </div>
              <div className="stat-icon" style={{ background: '#fbe7d8', color: '#c2560f' }}><ClipboardList size={22} /></div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-label">GST Number</div>
                <div className="stat-value" style={{ fontSize: 16, fontFamily: 'var(--font-mono)' }}>{supplier.gst}</div>
              </div>
              <div className="stat-icon" style={{ background: '#e3efec', color: '#3e7a73' }}><Truck size={22} /></div>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Primary Contact</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar" style={{ borderRadius: 10 }}>
                {supplier.contactPerson.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{supplier.contactPerson}</div>
                <div style={{ color: 'var(--stone)', fontSize: 12.5 }}>{supplier.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
