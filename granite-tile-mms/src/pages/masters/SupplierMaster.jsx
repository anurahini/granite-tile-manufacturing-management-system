import { useNavigate } from 'react-router-dom'
import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { suppliers } from '../../data/suppliers.js'
import { Truck, Mountain, ClipboardCheck, BadgeIndianRupee } from 'lucide-react'

const stats = [
  { icon: Truck, label: 'Total Suppliers', value: '76', tone: 'orange' },
  { icon: Mountain, label: 'Quarry Suppliers', value: '22', tone: 'info' },
  { icon: ClipboardCheck, label: 'Approved Vendors', value: '64', tone: 'success' },
  { icon: BadgeIndianRupee, label: 'Payables Due', value: '₹9.2L', tone: 'warning' },
]

function SupplierLogo({ name }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg, var(--charcoal), var(--charcoal-soft))',
      color: 'var(--orange-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 12.5,
    }}>{initials}</div>
  )
}

export default function SupplierMaster() {
  const navigate = useNavigate()

  const columns = [
    { key: 'id', label: 'Supplier ID', mono: true },
    {
      key: 'name', label: 'Supplier Profile',
      render: (row) => (
        <button
          onClick={() => navigate(`/supplier-master/${row.id}`)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, color: 'var(--orange-deep)' }}
        >
          <SupplierLogo name={row.name} /> {row.name}
        </button>
      ),
    },
    { key: 'gst', label: 'GST No.', mono: true },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'phone', label: 'Phone' },
    { key: 'material', label: 'Materials Supplied' },
    { key: 'deliveryPerformance', label: 'Delivery %', render: (row) => `${row.deliveryPerformance}%` },
    { key: 'rating', label: 'Rating', render: (row) => `${row.rating.toFixed(1)} / 5` },
    { key: 'status', label: 'Status' },
  ]

  return (
    <MasterPageTemplate
      breadcrumbLabel="Supplier Master"
      translationKey="supplierMaster"
      title="Supplier Management"
      description="Manage raw material and consumable suppliers, GST details, quarry sources and delivery performance."
      stats={stats}
      columns={columns}
      rows={suppliers}
      filters={['Material', 'Location', 'Status']}
      addLabel="Add Supplier"
    />
  )
}
