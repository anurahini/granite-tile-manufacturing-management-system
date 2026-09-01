import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { Truck, Wrench, Star, Car, ClipboardList } from 'lucide-react'

const stats = [
  { icon: Truck, label: 'Total Vendors', value: '29', tone: 'orange' },
  { icon: Wrench, label: 'Service Vendors', value: '12', tone: 'info' },
  { icon: Car, label: 'Transport Vendors', value: '14', tone: 'success' },
  { icon: Star, label: 'Top Rated (4.5+)', value: '9', tone: 'warning' },
]

function VendorAvatar({ name }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg, var(--orange), var(--orange-deep))',
        color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 12.5,
      }}>{initials}</div>
      <span style={{ fontWeight: 600 }}>{name}</span>
    </div>
  )
}

const columns = [
  { key: 'id', label: 'Vendor ID', mono: true },
  { key: 'name', label: 'Vendor Profile', render: (row) => <VendorAvatar name={row.name} /> },
  { key: 'serviceType', label: 'Service Type' },
  { key: 'categories', label: 'Product Categories' },
  { key: 'contactPerson', label: 'Contact Person' },
  { key: 'phone', label: 'Phone' },
  { key: 'previousOrders', label: 'Previous Orders' },
  { key: 'deliveryStatus', label: 'Delivery Status', render: (row) => <StatusBadge status={row.deliveryStatus} /> },
  { key: 'rating', label: 'Performance Rating' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'VEN-01', name: 'Sri Balaji Transports', serviceType: 'Logistics / Freight', categories: 'Granite Slabs, Raw Blocks', contactPerson: 'Murugan K.', phone: '+91 98430 55211', previousOrders: 84, deliveryStatus: 'Delivered', rating: '4.7 / 5', status: 'Active' },
  { id: 'VEN-02', name: 'Precision Machine Services', serviceType: 'Machine Maintenance', categories: 'Cutting & Polishing Equipment', contactPerson: 'Elango R.', phone: '+91 90031 22456', previousOrders: 36, deliveryStatus: 'Completed', rating: '4.5 / 5', status: 'Active' },
  { id: 'VEN-03', name: 'City Forklift Rentals', serviceType: 'Equipment Rental', categories: 'Warehouse Equipment', contactPerson: 'Saravanan T.', phone: '+91 96290 87712', previousOrders: 21, deliveryStatus: 'In Transit', rating: '4.2 / 5', status: 'Active' },
  { id: 'VEN-04', name: 'Metro Container Logistics', serviceType: 'Export Freight', categories: 'Granite Slabs, Marble Slabs', contactPerson: 'Farida Begum', phone: '+91 44 4021 6650', previousOrders: 58, deliveryStatus: 'Delivered', rating: '4.8 / 5', status: 'Active' },
  { id: 'VEN-05', name: 'Chennai Diesel Generators', serviceType: 'Power Backup Service', categories: 'Plant Utilities', contactPerson: 'Vasanth Kumar', phone: '+91 98940 33218', previousOrders: 9, deliveryStatus: 'Pending', rating: '3.9 / 5', status: 'Inactive' },
  { id: 'VEN-06', name: 'SafeGuard Security Services', serviceType: 'Plant Security', categories: 'Facility Services', contactPerson: 'Rajendran P.', phone: '+91 93450 66210', previousOrders: 44, deliveryStatus: 'Completed', rating: '4.4 / 5', status: 'Active' },
]

export default function VendorMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Vendor Master"
      translationKey="vendorMaster"
      title="Vendor Management"
      description="Manage service vendors, logistics partners, product categories supplied and delivery performance."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Service Type', 'Delivery Status', 'Rating', 'Status']}
      addLabel="Add Vendor"
    />
  )
}
