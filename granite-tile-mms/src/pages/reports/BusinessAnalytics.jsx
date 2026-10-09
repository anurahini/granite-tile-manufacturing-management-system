import { useState, useEffect } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import {
  TrendingUp, Download, ArrowUpRight, ShoppingBag, Users, Coins,
  PieChart as PieIcon, BarChart3, AlertTriangle, Calendar, ChevronRight
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { api } from '../../api/index.js'
import { exportToCSV } from '../../utils/exportUtils.js'
import { useNavigate } from 'react-router-dom'

export default function BusinessAnalytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('Apr 2026 - Sep 2026')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [customerFilter, setCustomerFilter] = useState('All')

  const [analyticsData, setAnalyticsData] = useState({
    kpis: {
      totalSales: '24.8',
      totalSalesDelta: '+12.5%',
      totalOrders: 486,
      totalOrdersDelta: '+8.3%',
      activeCustomers: 172,
      activeCustomersDelta: '+10.2%',
      avgOrderValue: '5,102',
      avgOrderValueDelta: '+6.8%',
      grossProfit: '7.6',
      grossProfitDelta: '+15.4%'
    },
    topCustomers: [
      { name: 'Sri Lakshmi Builders', value: 6.4, formatted: '₹6.4 L' },
      { name: 'Chola Constructions', value: 4.8, formatted: '₹4.8 L' },
      { name: 'Marble Palace Interiors', value: 3.6, formatted: '₹3.6 L' },
      { name: 'Rajasthan Marble Works', value: 2.9, formatted: '₹2.9 L' },
      { name: 'Granite Craft Mining Co.', value: 2.1, formatted: '₹2.1 L' },
    ],
    categorySales: [
      { name: 'Floor Tiles', percentage: 34, value: 8.4, formatted: '₹8.4 L', color: '#c9a968' },
      { name: 'Granite', percentage: 28, value: 7.0, formatted: '₹7.0 L', color: '#6e5530' },
      { name: 'Wall Tiles', percentage: 22, value: 5.5, formatted: '₹5.5 L', color: '#e28743' },
      { name: 'Marble', percentage: 16, value: 3.9, formatted: '₹3.9 L', color: '#3e7a73' },
    ],
    monthlySalesVsProfit: [
      { month: 'Apr', sales: 4.2, profit: 1.8 },
      { month: 'May', sales: 5.0, profit: 2.1 },
      { month: 'Jun', sales: 6.1, profit: 2.7 },
      { month: 'Jul', sales: 6.8, profit: 3.0 },
      { month: 'Aug', sales: 7.3, profit: 3.5 },
      { month: 'Sep', sales: 8.2, profit: 4.1 },
    ],
    popularProducts: [
      { id: 1, name: 'Alpine Grey Vitrified Floor Tile', category: 'Floor Tiles', orderCount: 86, salesValue: '₹4,32,000' },
      { id: 2, name: 'Black Galaxy Granite Slab', category: 'Granite', orderCount: 74, salesValue: '₹3,86,000' },
      { id: 3, name: 'Statuario Marble Tile', category: 'Marble', orderCount: 62, salesValue: '₹3,10,000' },
      { id: 4, name: 'Wooden Series Ceramic Tile', category: 'Floor Tiles', orderCount: 58, salesValue: '₹2,94,000' },
      { id: 5, name: 'Ocean Beige Wall Tile', category: 'Wall Tiles', orderCount: 46, salesValue: '₹2,41,000' },
    ],
    customerFrequency: {
      totalCustomers: 172,
      repeatCount: 117,
      repeatPercentage: 68,
      newCount: 55,
      newPercentage: 32,
    },
    lowStockAlerts: [
      { id: 1, name: 'Absolute Black Granite Slab', category: 'Granite', currentStock: 8, reorderLevel: 20 },
      { id: 2, name: 'Carrara White Marble Tile', category: 'Marble', currentStock: 12, reorderLevel: 30 },
      { id: 3, name: 'Ocean Beige Wall Tile', category: 'Wall Tiles', currentStock: 25, reorderLevel: 50 },
      { id: 4, name: 'Matt Finish Floor Tile 600x600', category: 'Floor Tiles', currentStock: 40, reorderLevel: 100 },
    ]
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/business-analytics')
      if (res && res.success && res.data) {
        setAnalyticsData(res.data)
      }
    } catch (err) {
      console.warn('Failed to fetch business analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const exportRows = analyticsData.popularProducts.map(p => ({
      Product: p.name,
      Category: p.category,
      Orders: p.orderCount,
      'Sales Value': p.salesValue
    }))
    const columns = [
      { key: 'Product', label: 'Product Name' },
      { key: 'Category', label: 'Category' },
      { key: 'Orders', label: 'Order Count' },
      { key: 'Sales Value', label: 'Sales Value' },
    ]
    exportToCSV(exportRows, columns, 'business-analytics-report.csv')
  }

  // Filtered view logic
  const filteredCategorySales = categoryFilter === 'All'
    ? analyticsData.categorySales
    : analyticsData.categorySales.filter(c => c.name === categoryFilter)

  const filteredPopularProducts = categoryFilter === 'All'
    ? analyticsData.popularProducts
    : analyticsData.popularProducts.filter(p => p.category === categoryFilter)

  const repeatChartData = [
    { name: 'Repeat Customers', value: analyticsData.customerFrequency.repeatPercentage, count: analyticsData.customerFrequency.repeatCount, color: '#9c7a46' },
    { name: 'New Customers', value: analyticsData.customerFrequency.newPercentage, count: analyticsData.customerFrequency.newCount, color: '#e8d9b5' }
  ]

  return (
    <div className="business-analytics-page" style={{ paddingBottom: 40 }}>
      {/* Top Header & Breadcrumbs */}
      <PageHeader
        trail={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Reports', path: '/report-center' },
          { label: 'Business Analytics' }
        ]}
        title="Business Analytics Dashboard"
        description="Customer trends, product performance and sales insights for better decision making."
        actions={[
          <button key="export" className="btn btn-primary btn-sm" onClick={handleExport}>
            <Download size={15} /> Export Report
          </button>
        ]}
      />

      {/* Filter Control Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: 'var(--white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--cream)', borderRadius: 6, border: '1px solid var(--cream-line)', fontSize: 13, fontWeight: 500 }}>
            <Calendar size={15} color="var(--orange)" />
            <span>{dateRange}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="form-input"
              style={{ height: 38, fontSize: 13, padding: '0 12px', minWidth: 160 }}
            >
              <option value="All">All Product Categories</option>
              <option value="Floor Tiles">Floor Tiles</option>
              <option value="Granite">Granite</option>
              <option value="Wall Tiles">Wall Tiles</option>
              <option value="Marble">Marble</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select
              value={customerFilter}
              onChange={e => setCustomerFilter(e.target.value)}
              className="form-input"
              style={{ height: 38, fontSize: 13, padding: '0 12px', minWidth: 160 }}
            >
              <option value="All">All Customers</option>
              <option value="Sri Lakshmi Builders">Sri Lakshmi Builders</option>
              <option value="Chola Constructions">Chola Constructions</option>
              <option value="Marble Palace Interiors">Marble Palace Interiors</option>
              <option value="Rajasthan Marble Works">Rajasthan Marble Works</option>
              <option value="Granite Craft Mining Co.">Granite Craft Mining Co.</option>
            </select>
          </div>
        </div>

        <button className="btn btn-outline btn-sm" onClick={() => { setCategoryFilter('All'); setCustomerFilter('All'); }}>
          Reset Filters
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* KPI 1 */}
        <div className="card" style={{ padding: '20px 22px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--stone-dark)', textTransform: 'uppercase' }}>
              TOTAL SALES
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fbf5e8', border: '1px solid #ebd9b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} color="#9c7a46" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              ₹{analyticsData.kpis.totalSales} L
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2b7a68', background: '#e3f4ef', padding: '2px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={13} /> {analyticsData.kpis.totalSalesDelta}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, display: 'block' }}>vs previous period</span>
        </div>

        {/* KPI 2 */}
        <div className="card" style={{ padding: '20px 22px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--stone-dark)', textTransform: 'uppercase' }}>
              TOTAL ORDERS
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fbf5e8', border: '1px solid #ebd9b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} color="#9c7a46" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              {analyticsData.kpis.totalOrders}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2b7a68', background: '#e3f4ef', padding: '2px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={13} /> {analyticsData.kpis.totalOrdersDelta}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, display: 'block' }}>vs previous period</span>
        </div>

        {/* KPI 3 */}
        <div className="card" style={{ padding: '20px 22px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--stone-dark)', textTransform: 'uppercase' }}>
              ACTIVE CUSTOMERS
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fbf5e8', border: '1px solid #ebd9b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#9c7a46" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              {analyticsData.kpis.activeCustomers}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2b7a68', background: '#e3f4ef', padding: '2px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={13} /> {analyticsData.kpis.activeCustomersDelta}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, display: 'block' }}>vs previous period</span>
        </div>

        {/* KPI 4 */}
        <div className="card" style={{ padding: '20px 22px', background: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', color: 'var(--stone-dark)', textTransform: 'uppercase' }}>
              AVERAGE ORDER VALUE
            </span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fbf5e8', border: '1px solid #ebd9b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coins size={20} color="#9c7a46" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
              ₹{analyticsData.kpis.avgOrderValue}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#2b7a68', background: '#e3f4ef', padding: '2px 8px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <ArrowUpRight size={13} /> {analyticsData.kpis.avgOrderValueDelta}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, display: 'block' }}>vs previous period</span>
        </div>
      </div>

      {/* Row 1 Charts: Top 5 Customers & Sales by Category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Top 5 Customers Horizontal Bar Chart */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Users size={18} color="var(--orange)" />
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
              Top 5 Customers by Purchase Value
            </h3>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={analyticsData.topCustomers}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0e6d6" />
                <XAxis type="number" unit=" L" domain={[0, 8]} tick={{ fontSize: 12, fill: '#867b6d' }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#2a2620', fontWeight: 500 }} />
                <Tooltip
                  formatter={(val) => [`₹${val} Lakhs`, 'Purchase Value']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2d3b4', backgroundColor: '#fff' }}
                />
                <Bar dataKey="value" fill="#b86d3b" radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--stone)', marginTop: 4 }}>
            Purchase Value (₹ Lakhs)
          </div>
        </div>

        {/* Sales by Product Category Donut Chart */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PieIcon size={18} color="var(--orange)" />
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
              Sales by Product Category
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 20, height: 260 }}>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredCategorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {filteredCategorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name, item) => [`${val}% (${item.payload.formatted})`, item.payload.name]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Label */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                  ₹24.8 L
                </span>
                <span style={{ fontSize: 11, color: 'var(--stone)' }}>Total Sales</span>
              </div>
            </div>

            {/* Custom Right Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
              {filteredCategorySales.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                    <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{item.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{item.percentage}%</span>
                    <span style={{ color: 'var(--stone)', fontSize: 12 }}>{item.formatted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Monthly Sales vs Profit & Most Frequently Purchased Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Monthly Sales vs Profit Line Chart */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={18} color="var(--orange)" />
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
              Monthly Sales vs Profit
            </h3>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlySalesVsProfit} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#867b6d' }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#867b6d' }} unit="L" />
                <Tooltip formatter={(val) => [`₹${val} Lakhs`]} contentStyle={{ borderRadius: 8, border: '1px solid #e2d3b4' }} />
                <Legend />
                <Line type="monotone" dataKey="sales" name="Sales" stroke="#9c7a46" strokeWidth={3} dot={{ r: 4, fill: '#9c7a46' }} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#2b7a68" strokeWidth={3} dot={{ r: 4, fill: '#2b7a68' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--stone)', marginTop: 4 }}>
            Amount (₹ Lakhs)
          </div>
        </div>

        {/* Most Frequently Purchased Products Table */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <ShoppingBag size={18} color="var(--orange)" />
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
              Most Frequently Purchased Products
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--cream-line)', textAlign: 'left', color: 'var(--stone-dark)', fontSize: 12 }}>
                  <th style={{ padding: '8px 10px', width: 40 }}>#</th>
                  <th style={{ padding: '8px 10px' }}>Product Name</th>
                  <th style={{ padding: '8px 10px' }}>Category</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Order Count</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Sales Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredPopularProducts.map((p, idx) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f6f0e6', height: 42 }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--stone)' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--charcoal)' }}>{p.name}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--stone-dark)' }}>{p.category}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600 }}>{p.orderCount}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: 'var(--charcoal)' }}>{p.salesValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Customer Purchase Frequency & Low Stock Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        {/* Customer Purchase Frequency Donut Chart */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Users size={18} color="var(--orange)" />
            <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
              Customer Purchase Frequency
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, height: 200 }}>
            <div style={{ position: 'relative', width: 170, height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={repeatChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {repeatChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name, item) => [`${val}% (${item.payload.count})`, item.payload.name]} />
                </PieChart>
              </ResponsiveContainer>

              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                  {analyticsData.customerFrequency.totalCustomers}
                </span>
                <span style={{ fontSize: 11, color: 'var(--stone)' }}>Customers</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 180 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#9c7a46', display: 'inline-block' }} />
                  <span>Repeat Customers</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginLeft: 18, marginTop: 2 }}>
                  {analyticsData.customerFrequency.repeatPercentage}% ({analyticsData.customerFrequency.repeatCount})
                </div>
                <div style={{ fontSize: 11, color: 'var(--stone)', marginLeft: 18 }}>Purchased more than once</div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e8d9b5', display: 'inline-block' }} />
                  <span>New Customers</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginLeft: 18, marginTop: 2 }}>
                  {analyticsData.customerFrequency.newPercentage}% ({analyticsData.customerFrequency.newCount})
                </div>
                <div style={{ fontSize: 11, color: 'var(--stone)', marginLeft: 18 }}>First time purchase</div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="card" style={{ padding: 24, background: 'var(--white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#c2452d" />
              <h3 style={{ fontSize: 16, fontFamily: 'var(--font-display)', margin: 0 }}>
                Low Stock Alerts
              </h3>
            </div>
            <button
              onClick={() => navigate('/inventory-management')}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--orange)', display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--cream-line)', textAlign: 'left', color: 'var(--stone-dark)', fontSize: 12 }}>
                  <th style={{ padding: '8px 10px', width: 40 }}>#</th>
                  <th style={{ padding: '8px 10px' }}>Product Name</th>
                  <th style={{ padding: '8px 10px' }}>Category</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Current Stock</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.lowStockAlerts.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f6f0e6', height: 42 }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--stone)' }}>{idx + 1}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--charcoal)' }}>{item.name}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--stone-dark)' }}>{item.category}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#c2452d' }}>{item.currentStock}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 500, color: 'var(--stone)' }}>{item.reorderLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
