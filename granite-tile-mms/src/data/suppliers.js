export const suppliers = [
  {
    id: 'SUP-4001', name: 'Kanchi Quarries Pvt Ltd', gst: '33AAACK1234F1Z5',
    contactPerson: 'Balasubramaniam R.', phone: '+91 94420 11223', email: 'balu@kanchiquarries.com',
    address: 'SH-32, Quarry Zone, Kanchipuram, Tamil Nadu 631502',
    material: 'Raw Granite Blocks', rating: 4.6, deliveryPerformance: 96, status: 'Active',
    since: '2014', totalOrders: 212,
  },
  {
    id: 'SUP-4002', name: 'Rajasthan Stone Exports', gst: '08AAECR5678G1Z2',
    contactPerson: 'Devendra Singh', phone: '+91 98290 44556', email: 'devendra@rjstone.in',
    address: 'Marble Market Road, Kishangarh, Rajasthan 305801',
    material: 'Marble & Sandstone', rating: 4.3, deliveryPerformance: 91, status: 'Active',
    since: '2017', totalOrders: 138,
  },
  {
    id: 'SUP-4003', name: 'Global Abrasives Co.', gst: '33AABCG4321H1Z8',
    contactPerson: 'Lakshmi Narayanan', phone: '+91 90475 66123', email: 'lakshmi@globalabrasives.com',
    address: 'Guindy Industrial Estate, Chennai, Tamil Nadu 600032',
    material: 'Polishing Abrasives', rating: 4.1, deliveryPerformance: 88, status: 'Active',
    since: '2019', totalOrders: 96,
  },
  {
    id: 'SUP-4004', name: 'TechBlade Tools', gst: '33AACTT9988K1ZA',
    contactPerson: 'Ashok Kumar', phone: '+91 99420 77812', email: 'ashok@techblade.in',
    address: 'Peelamedu Industrial Area, Coimbatore, Tamil Nadu 641004',
    material: 'Diamond Cutting Blades', rating: 4.7, deliveryPerformance: 98, status: 'Active',
    since: '2012', totalOrders: 264,
  },
  {
    id: 'SUP-4005', name: 'Southern Adhesives', gst: '33AABCS2211L1Z6',
    contactPerson: 'Meera Krishnan', phone: '+91 96001 33445', email: 'meera@southernadhesives.com',
    address: 'Gandhi Road, Vellore, Tamil Nadu 632001',
    material: 'Epoxy & Resin', rating: 3.9, deliveryPerformance: 74, status: 'Inactive',
    since: '2020', totalOrders: 41,
  },
]

export function getSupplierById(id) {
  return suppliers.find((s) => s.id === id)
}
