import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Warehouse, PackageCheck, Gauge, MapPin } from 'lucide-react'

const stats = [
  { icon: Warehouse, label: 'Total Warehouses', value: '6', tone: 'orange' },
  { icon: PackageCheck, label: 'Storage Utilised', value: '78%', delta: '+5% this month', deltaDir: 'up', tone: 'warning' },
  { icon: Gauge, label: 'Avg. Capacity', value: '12,400 sq.ft', tone: 'info' },
  { icon: MapPin, label: 'Locations', value: '4 cities', tone: 'success' },
]

const columns = [
  { key: 'id', label: 'Warehouse ID', mono: true },
  { key: 'name', label: 'Warehouse Name' },
  { key: 'location', label: 'Location' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'utilisation', label: 'Utilisation' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'WH-01', name: 'Main Finished Goods Store', location: 'Chennai Plant', capacity: '18,000 sq.ft', utilisation: '82%', status: 'Active' },
  { id: 'WH-02', name: 'Raw Block Yard', location: 'Chennai Plant', capacity: '25,000 sq.ft', utilisation: '65%', status: 'Active' },
  { id: 'WH-03', name: 'Tile Storage Unit', location: 'Hosur Facility', capacity: '9,500 sq.ft', utilisation: '90%', status: 'Active' },
  { id: 'WH-04', name: 'Export Packing Store', location: 'Chennai Port Yard', capacity: '6,200 sq.ft', utilisation: '70%', status: 'Active' },
  { id: 'WH-05', name: 'Spares & Consumables', location: 'Chennai Plant', capacity: '2,100 sq.ft', utilisation: '48%', status: 'Inactive' },
]

export default function WarehouseMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Warehouse Master"
      translationKey="warehouseMaster"
      title="Warehouse Master"
      description="Manage storage locations for raw blocks, finished slabs and tiles."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Location', 'Status']}
      addLabel="Add Warehouse"
    />
  )
}
