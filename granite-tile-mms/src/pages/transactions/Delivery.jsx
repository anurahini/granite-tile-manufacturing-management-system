import TransactionPageTemplate from '../../components/TransactionPageTemplate.jsx'

const formFields = [
  { label: 'Sales Order', type: 'select', options: ['SO-2026-0986', 'SO-2026-0985', 'SO-2026-0984'] },
  { label: 'Dispatch Date', type: 'date' },
  { label: 'Vehicle No.', type: 'text', placeholder: 'e.g. TN 09 AB 4521' },
  { label: 'Driver Name', type: 'text', placeholder: 'e.g. Manikandan S' },
  { label: 'Transport Mode', type: 'select', options: ['Company Truck', 'Third-Party Logistics', 'Customer Pickup'] },
  { label: 'Expected Arrival', type: 'date' },
  { label: 'Destination', type: 'text', placeholder: 'e.g. Anna Nagar, Chennai' },
  { label: 'Packing Notes', type: 'textarea', placeholder: 'Crate count, padding details...' },
]

const summary = [
  { label: 'Delivery Challan No.', value: 'DC-2026-0552' },
  { label: 'Total Packages', value: '18 Crates' },
  { label: 'Total Weight', value: '4.6 Tons' },
  { label: 'Distance', value: '32 km' },
  { label: 'ETA', value: '4 hrs 20 min', strong: true },
]

const columns = [
  { key: 'id', label: 'Challan No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'vehicle', label: 'Vehicle No.' },
  { key: 'dispatch', label: 'Dispatch Date' },
  { key: 'destination', label: 'Destination' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'DC-2026-0551', customer: 'Sri Lakshmi Builders', vehicle: 'TN 09 AB 4521', dispatch: '10 Aug 2026', destination: 'Anna Nagar, Chennai', status: 'In Transit' },
  { id: 'DC-2026-0550', customer: 'Marble Palace Interiors', vehicle: 'KA 05 CD 8890', dispatch: '08 Aug 2026', destination: 'Whitefield, Bengaluru', status: 'Delivered' },
  { id: 'DC-2026-0549', customer: 'Al Fahad Stone Trading', vehicle: 'Export Container #4471', dispatch: '05 Aug 2026', destination: 'Chennai Port', status: 'Shipped' },
  { id: 'DC-2026-0548', customer: 'Chola Constructions', vehicle: 'TN 37 EF 1123', dispatch: '02 Aug 2026', destination: 'Madurai', status: 'Delivered' },
]

export default function Delivery() {
  return (
    <TransactionPageTemplate
      breadcrumbLabel="Delivery Management"
      translationKey="deliveryManagement"
      title="Delivery Management"
      description="Schedule dispatches and track delivery challans to customer sites."
      formFields={formFields}
      summary={summary}
      columns={columns}
      rows={rows}
    />
  )
}
