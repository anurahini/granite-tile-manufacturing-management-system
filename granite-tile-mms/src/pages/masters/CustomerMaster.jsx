import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Contact, Building2, Globe2, Star } from 'lucide-react'

const stats = [
  { icon: Contact, label: 'Total Customers', value: '214', tone: 'orange' },
  { icon: Building2, label: 'Corporate Accounts', value: '58', tone: 'info' },
  { icon: Globe2, label: 'Export Clients', value: '19', tone: 'success' },
  { icon: Star, label: 'Key Accounts', value: '12', tone: 'warning' },
]

const columns = [
  { key: 'id', label: 'Customer ID', mono: true },
  { key: 'name', label: 'Customer Name' },
  { key: 'type', label: 'Type' },
  { key: 'city', label: 'City' },
  { key: 'contact', label: 'Contact No.' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'CUS-3001', name: 'Sri Lakshmi Builders', type: 'Corporate', city: 'Chennai', contact: '+91 98400 12345', status: 'Active' },
  { id: 'CUS-3002', name: 'Marble Palace Interiors', type: 'Retail', city: 'Bengaluru', contact: '+91 98450 22233', status: 'Active' },
  { id: 'CUS-3003', name: 'Al Fahad Stone Trading', type: 'Export', city: 'Dubai, UAE', contact: '+971 50 112 3344', status: 'Active' },
  { id: 'CUS-3004', name: 'Chola Constructions', type: 'Corporate', city: 'Madurai', contact: '+91 90030 98765', status: 'Active' },
  { id: 'CUS-3005', name: 'Green Homes Realty', type: 'Retail', city: 'Coimbatore', contact: '+91 96290 11223', status: 'Inactive' },
]

export default function CustomerMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Customer Master"
      translationKey="customerMaster"
      title="Customer Master"
      description="Manage customer accounts, billing details and order history references."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Type', 'City', 'Status']}
      addLabel="Add Customer"
    />
  )
}
