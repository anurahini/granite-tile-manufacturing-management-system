import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Customer', type: 'select', options: ['Sri Lakshmi Builders', 'Marble Palace Interiors', 'Al Fahad Stone Trading'] },
  { label: 'Sales Order Ref.', type: 'text', placeholder: 'e.g. SO-2026-0986' },
  { label: 'Invoice Date', type: 'date' },
  { label: 'Due Date', type: 'date' },
  { label: 'Taxable Amount', type: 'number', placeholder: 'e.g. 984000' },
  { label: 'GST Rate', type: 'select', options: ['5%', '12%', '18%', '28%'] },
  { label: 'Payment Terms', type: 'select', options: ['Immediate', 'Net 15', 'Net 30'] },
  { label: 'Notes', type: 'textarea', placeholder: 'Invoice notes for the customer...' },
]

const summary = [
  { label: 'Invoice No.', value: 'INV-2026-1204' },
  { label: 'Taxable Value', value: '₹9,84,000' },
  { label: 'GST (18%)', value: '₹1,77,120' },
  { label: 'Round Off', value: '₹0.00' },
  { label: 'Grand Total', value: '₹11,61,120', strong: true },
]

const columns = [
  { key: 'id', label: 'Invoice No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Invoice Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'due', label: 'Due Date' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'INV-2026-1203', customer: 'Sri Lakshmi Builders', date: '10 Aug 2026', amount: '₹11,32,092', due: '10 Sep 2026', status: 'Pending' },
  { id: 'INV-2026-1202', customer: 'Marble Palace Interiors', date: '07 Aug 2026', amount: '₹3,60,000', due: '22 Aug 2026', status: 'Paid' },
  { id: 'INV-2026-1201', customer: 'Al Fahad Stone Trading', date: '04 Aug 2026', amount: '₹8,20,000', due: '19 Aug 2026', status: 'Overdue' },
  { id: 'INV-2026-1200', customer: 'Chola Constructions', date: '01 Aug 2026', amount: '₹4,75,000', due: '16 Aug 2026', status: 'Paid' },
]

export default function Invoice() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Invoice Management"
      translationKey="invoiceManagement"
      title="Invoice Management"
      description="Generate GST-compliant invoices and track customer payment due dates."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
