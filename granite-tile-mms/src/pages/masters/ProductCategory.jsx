import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Tags, FolderTree, Percent, Boxes } from 'lucide-react'

const stats = [
  { icon: Tags, label: 'Total Categories', value: '14', tone: 'orange' },
  { icon: FolderTree, label: 'Sub-Categories', value: '31', tone: 'info' },
  { icon: Boxes, label: 'Products Mapped', value: '318', tone: 'success' },
  { icon: Percent, label: 'GST Slabs Used', value: '3', tone: 'warning' },
]

const columns = [
  { key: 'id', label: 'Category ID', mono: true },
  { key: 'name', label: 'Category Name' },
  { key: 'parent', label: 'Parent Group' },
  { key: 'products', label: 'Products' },
  { key: 'gst', label: 'GST %' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'CAT-01', name: 'Granite Slabs', parent: 'Natural Stone', products: 142, gst: '18%', status: 'Active' },
  { id: 'CAT-02', name: 'Marble Slabs', parent: 'Natural Stone', products: 58, gst: '18%', status: 'Active' },
  { id: 'CAT-03', name: 'Ceramic Floor Tiles', parent: 'Tiles', products: 76, gst: '12%', status: 'Active' },
  { id: 'CAT-04', name: 'Vitrified Tiles', parent: 'Tiles', products: 34, gst: '18%', status: 'Active' },
  { id: 'CAT-05', name: 'Mosaic & Border Tiles', parent: 'Tiles', products: 8, gst: '12%', status: 'Inactive' },
]

export default function ProductCategory() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Product Category"
      translationKey="productCategory"
      title="Product Category"
      description="Organise granite and tile products into categories and sub-groups."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Parent Group', 'Status']}
      addLabel="Add Category"
    />
  )
}
