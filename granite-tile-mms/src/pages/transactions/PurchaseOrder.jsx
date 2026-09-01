import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Supplier', type: 'select', options: ['Kanchi Quarries Pvt Ltd', 'Rajasthan Stone Exports', 'TechBlade Tools'] },
  { label: 'PO Date', type: 'date' },
  { label: 'Material', type: 'select', options: ['Raw Granite Blocks', 'Marble Blocks', 'Cutting Blades', 'Epoxy Resin'] },
  { label: 'Quantity', type: 'number', placeholder: 'e.g. 40' },
  { label: 'Unit', type: 'select', options: ['Blocks', 'Tons', 'Pieces', 'Litres'] },
  { label: 'Expected Delivery', type: 'date' },
  { label: 'Payment Terms', type: 'select', options: ['Advance', 'Net 30', 'Net 60', 'Against Delivery'] },
  { label: 'Remarks', type: 'textarea', placeholder: 'Add notes for this purchase order...' },
]

const summary = [
  { label: 'PO Number', value: 'PO-2026-0148' },
  { label: 'Material Cost', value: '₹6,40,000' },
  { label: 'Freight & Loading', value: '₹22,500' },
  { label: 'GST (18%)', value: '₹1,19,250' },
  { label: 'Total Payable', value: '₹7,81,750', strong: true },
]

const columns = [
  { key: 'id', label: 'PO No.', mono: true },
  { key: 'supplier', label: 'Supplier' },
  { key: 'material', label: 'Material' },
  { key: 'qty', label: 'Qty' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'PO-2026-0147', supplier: 'Kanchi Quarries Pvt Ltd', material: 'Raw Granite Blocks', qty: '36 Blocks', amount: '₹5,76,000', status: 'Approved' },
  { id: 'PO-2026-0146', supplier: 'Rajasthan Stone Exports', material: 'Marble Blocks', qty: '18 Blocks', amount: '₹3,24,000', status: 'Pending' },
  { id: 'PO-2026-0145', supplier: 'TechBlade Tools', material: 'Diamond Blades', qty: '60 Pcs', amount: '₹1,80,000', status: 'Completed' },
  { id: 'PO-2026-0144', supplier: 'Southern Adhesives', material: 'Epoxy Resin', qty: '200 Ltr', amount: '₹98,000', status: 'Cancelled' },
]

export default function PurchaseOrder() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Purchase Order"
      translationKey="purchaseOrder"
      title="Purchase Order"
      description="Raise and track purchase orders for raw granite blocks and consumables."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
