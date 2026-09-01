import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Customer', type: 'select', options: ['Sri Lakshmi Builders', 'Marble Palace Interiors', 'Al Fahad Stone Trading'] },
  { label: 'Order Date', type: 'date' },
  { label: 'Product', type: 'select', options: ['Tan Brown Granite Slab', 'Black Galaxy Granite', 'Ivory Ceramic Tile'] },
  { label: 'Quantity', type: 'number', placeholder: 'e.g. 60' },
  { label: 'Rate per Unit', type: 'number', placeholder: 'e.g. 185' },
  { label: 'Delivery Date', type: 'date' },
  { label: 'Sales Executive', type: 'select', options: ['Arjun Menon', 'Divya Chandran'] },
  { label: 'Special Instructions', type: 'textarea', placeholder: 'Packing, transport preferences...' },
]

const summary = [
  { label: 'Sales Order No.', value: 'SO-2026-0987' },
  { label: 'Order Value', value: '₹9,84,000' },
  { label: 'Discount', value: '₹24,600' },
  { label: 'GST (18%)', value: '₹1,72,692' },
  { label: 'Net Payable', value: '₹11,32,092', strong: true },
]

const columns = [
  { key: 'id', label: 'SO No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'qty', label: 'Qty' },
  { key: 'value', label: 'Order Value' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'SO-2026-0986', customer: 'Sri Lakshmi Builders', product: 'Tan Brown Granite Slab', qty: '60 Slabs', value: '₹9,84,000', status: 'Processing' },
  { id: 'SO-2026-0985', customer: 'Marble Palace Interiors', product: 'Ivory Ceramic Floor Tile', qty: '1,200 Pcs', value: '₹3,60,000', status: 'Completed' },
  { id: 'SO-2026-0984', customer: 'Al Fahad Stone Trading', product: 'Black Galaxy Granite', qty: '40 Slabs', value: '₹8,20,000', status: 'Approved' },
  { id: 'SO-2026-0983', customer: 'Chola Constructions', product: 'Kashmir White Granite', qty: '25 Slabs', value: '₹4,75,000', status: 'Pending' },
]

export default function SalesOrder() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Sales Order"
      translationKey="salesOrder"
      title="Sales Order"
      description="Create and manage customer sales orders for granite slabs and tiles."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
