const map = {
  'Completed': 'success', 'Delivered': 'success', 'Paid': 'success', 'Approved': 'success', 'In Stock': 'success', 'Active': 'success',
  'Pending': 'warning', 'Processing': 'warning', 'In Production': 'warning', 'Partial': 'warning', 'Low Stock': 'warning',
  'Cancelled': 'danger', 'Rejected': 'danger', 'Overdue': 'danger', 'Out of Stock': 'danger', 'Inactive': 'danger',
  'Shipped': 'info', 'In Transit': 'info', 'Draft': 'neutral', 'Quality Check': 'info',
}

export default function StatusBadge({ status }) {
  const tone = map[status] || 'neutral'
  return <span className={`badge badge-${tone}`}>{status}</span>
}
