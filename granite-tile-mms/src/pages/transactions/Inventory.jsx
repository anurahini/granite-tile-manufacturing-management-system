import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Warehouse', type: 'select', options: ['Main Finished Goods Store', 'Raw Block Yard', 'Tile Storage Unit'] },
  { label: 'Product / Material', type: 'select', options: ['Tan Brown Granite Slab', 'Black Galaxy Granite', 'Ivory Ceramic Tile'] },
  { label: 'Transaction Type', type: 'select', options: ['Stock In', 'Stock Out', 'Transfer', 'Adjustment'] },
  { label: 'Quantity', type: 'number', placeholder: 'e.g. 50' },
  { label: 'Reference Order', type: 'text', placeholder: 'e.g. PRO-2026-0311' },
  { label: 'Date', type: 'date' },
  { label: 'Handled By', type: 'select', options: ['Kavitha Rao', 'Suresh Babu'] },
  { label: 'Remarks', type: 'textarea', placeholder: 'Reason for stock movement...' },
]

const summary = [
  { label: 'Total SKUs Tracked', value: '318' },
  { label: 'Stock Value', value: '₹2.86 Cr' },
  { label: 'Low Stock Alerts', value: '14' },
  { label: 'Out of Stock', value: '3' },
  { label: 'Warehouse Utilisation', value: '78%', strong: true },
]

const columns = [
  { key: 'id', label: 'Item Code', mono: true },
  { key: 'product', label: 'Product' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'qty', label: 'Available Qty' },
  { key: 'reorder', label: 'Reorder Level' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'INV-8001', product: 'Tan Brown Granite Slab', warehouse: 'Main Finished Goods Store', qty: '412 Slabs', reorder: '100', status: 'In Stock' },
  { id: 'INV-8002', product: 'Black Galaxy Granite', warehouse: 'Main Finished Goods Store', qty: '38 Slabs', reorder: '50', status: 'Low Stock' },
  { id: 'INV-8003', product: 'Ivory Ceramic Floor Tile', warehouse: 'Tile Storage Unit', qty: '0 Pcs', reorder: '500', status: 'Out of Stock' },
  { id: 'INV-8004', product: 'Raw Granite Blocks', warehouse: 'Raw Block Yard', qty: '96 Blocks', reorder: '30', status: 'In Stock' },
]

export default function Inventory() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Inventory Management"
      translationKey="inventoryManagement"
      title="Inventory Management"
      description="Track stock movement of raw blocks, finished slabs and tiles across warehouses."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
