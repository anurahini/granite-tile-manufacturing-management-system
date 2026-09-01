import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Invoice Ref.', type: 'select', options: ['INV-2026-1203', 'INV-2026-1201', 'INV-2026-1198'] },
  { label: 'Payment Date', type: 'date' },
  { label: 'Amount Received', type: 'number', placeholder: 'e.g. 500000' },
  { label: 'Payment Mode', type: 'select', options: ['Bank Transfer (NEFT/RTGS)', 'Cheque', 'UPI', 'Cash'] },
  { label: 'Transaction Ref. No.', type: 'text', placeholder: 'e.g. UTR123456789' },
  { label: 'Received By', type: 'select', options: ['Divya Chandran', 'Accounts Desk'] },
  { label: 'Bank Account', type: 'select', options: ['HDFC - Current A/c 0021', 'ICICI - Current A/c 4471'] },
  { label: 'Notes', type: 'textarea', placeholder: 'Any adjustment or remarks...' },
]

const summary = [
  { label: 'Receipt No.', value: 'RCT-2026-0741' },
  { label: 'Invoice Balance Before', value: '₹11,32,092' },
  { label: 'Amount Received', value: '₹5,00,000' },
  { label: 'Balance Due', value: '₹6,32,092' },
  { label: 'Payment Status', value: 'Partial', strong: true },
]

const columns = [
  { key: 'id', label: 'Receipt No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'invoice', label: 'Invoice No.' },
  { key: 'amount', label: 'Amount' },
  { key: 'mode', label: 'Mode' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'RCT-2026-0740', customer: 'Marble Palace Interiors', invoice: 'INV-2026-1202', amount: '₹3,60,000', mode: 'Bank Transfer', status: 'Paid' },
  { id: 'RCT-2026-0739', customer: 'Al Fahad Stone Trading', invoice: 'INV-2026-1201', amount: '₹4,00,000', mode: 'Bank Transfer', status: 'Partial' },
  { id: 'RCT-2026-0738', customer: 'Chola Constructions', invoice: 'INV-2026-1200', amount: '₹4,75,000', mode: 'Cheque', status: 'Paid' },
  { id: 'RCT-2026-0737', customer: 'Sri Lakshmi Builders', invoice: 'INV-2026-1195', amount: '₹2,10,000', mode: 'UPI', status: 'Paid' },
]

export default function Payment() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Payment Management"
      translationKey="paymentManagement"
      title="Payment Management"
      description="Record customer payments and reconcile outstanding invoice balances."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
