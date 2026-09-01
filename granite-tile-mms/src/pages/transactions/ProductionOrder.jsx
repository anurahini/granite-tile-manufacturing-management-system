import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Product', type: 'select', options: ['Tan Brown Granite Slab', 'Black Galaxy Granite', 'Ivory Ceramic Tile'] },
  { label: 'Machine Line', type: 'select', options: ['Gang Saw Cutter GS-200', 'Automatic Polishing Line', 'CNC Router 5-Axis'] },
  { label: 'Batch Quantity', type: 'number', placeholder: 'e.g. 120 slabs' },
  { label: 'Raw Material Source', type: 'select', options: ['Raw Block Yard - WH02', 'Imported Block Lot #77'] },
  { label: 'Start Date', type: 'date' },
  { label: 'Target Completion', type: 'date' },
  { label: 'Supervisor', type: 'select', options: ['Priya Natarajan', 'Karthik Iyer', 'Vignesh Raj'] },
  { label: 'Process Notes', type: 'textarea', placeholder: 'Cutting thickness, finish type, special instructions...' },
]

const summary = [
  { label: 'Production Order', value: 'PRO-2026-0312' },
  { label: 'Planned Output', value: '120 Slabs' },
  { label: 'Material Allocated', value: '32 Blocks' },
  { label: 'Estimated Wastage', value: '6.4%' },
  { label: 'Est. Completion', value: '5 Days', strong: true },
]

const columns = [
  { key: 'id', label: 'Order No.', mono: true },
  { key: 'product', label: 'Product' },
  { key: 'qty', label: 'Batch Qty' },
  { key: 'line', label: 'Machine Line' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'PRO-2026-0311', product: 'Tan Brown Granite Slab', qty: '150 Slabs', line: 'Gang Saw Cutter GS-200', progress: '82%', status: 'In Production' },
  { id: 'PRO-2026-0310', product: 'Black Galaxy Granite', qty: '90 Slabs', line: 'Automatic Polishing Line', progress: '100%', status: 'Completed' },
  { id: 'PRO-2026-0309', product: 'Ivory Ceramic Floor Tile', qty: '2,400 Pcs', line: 'CNC Router 5-Axis', progress: '45%', status: 'Quality Check' },
  { id: 'PRO-2026-0308', product: 'Kashmir White Granite', qty: '60 Slabs', line: 'Bridge Cutting Machine', progress: '0%', status: 'Pending' },
]

export default function ProductionOrder() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Production Order"
      translationKey="productionOrder"
      title="Production Order"
      description="Plan and monitor production batches from raw block to finished slab."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
