import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Boxes, Layers, Ruler, Palette } from 'lucide-react'

const stats = [
  { icon: Boxes, label: 'Total Products', value: '318', tone: 'orange' },
  { icon: Layers, label: 'Granite Variants', value: '142', tone: 'info' },
  { icon: Ruler, label: 'Tile Sizes', value: '26', tone: 'success' },
  { icon: Palette, label: 'Finish Options', value: '9', tone: 'warning' },
]

const columns = [
  { key: 'id', label: 'Product Code', mono: true },
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'size', label: 'Size / Thickness' },
  { key: 'finish', label: 'Finish' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'PRD-5001', name: 'Tan Brown Granite Slab', category: 'Granite Slab', size: '8 x 4 ft / 18mm', finish: 'Polished', status: 'Active' },
  { id: 'PRD-5002', name: 'Black Galaxy Granite', category: 'Granite Slab', size: '8 x 4 ft / 18mm', finish: 'Polished', status: 'Active' },
  { id: 'PRD-5003', name: 'Ivory Ceramic Floor Tile', category: 'Floor Tile', size: '600 x 600mm', finish: 'Matte', status: 'Active' },
  { id: 'PRD-5004', name: 'Kashmir White Granite', category: 'Granite Slab', size: '8 x 4 ft / 20mm', finish: 'Honed', status: 'Active' },
  { id: 'PRD-5005', name: 'Terracotta Wall Tile', category: 'Wall Tile', size: '300 x 450mm', finish: 'Glossy', status: 'Inactive' },
]

export default function ProductMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Product Master"
      translationKey="productMaster"
      title="Product Master"
      description="Catalogue of granite slabs, tiles and finished stone products."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Category', 'Finish', 'Status']}
      addLabel="Add Product"
    />
  )
}
