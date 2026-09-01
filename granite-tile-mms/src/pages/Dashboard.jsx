import PageHeader from '../components/PageHeader.jsx'
import { StatGrid, StatCard } from '../components/StatCard.jsx'
import DataTable from '../components/DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  IndianRupee, ShoppingCart, Factory, Boxes, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend
} from 'recharts'

const kpis = [
  { icon: IndianRupee, label: 'Revenue (MTD)', value: '₹86.4L', delta: '+12.4% vs last month', deltaDir: 'up', tone: 'orange', path: '/report-center' },
  { icon: ShoppingCart, label: 'Open Orders', value: '47', delta: '+9 today', deltaDir: 'up', tone: 'info', path: '/sales-order' },
  { icon: Factory, label: 'Batches Running', value: '12', tone: 'success', path: '/production-order' },
  { icon: Boxes, label: 'Stock Value', value: '₹2.86 Cr', delta: '-1.2% vs last month', deltaDir: 'down', tone: 'warning', path: '/inventory-management' },
]

const revenueTrend = [
  { name: 'Mon', revenue: 11.2 }, { name: 'Tue', revenue: 13.4 }, { name: 'Wed', revenue: 10.8 },
  { name: 'Thu', revenue: 15.1 }, { name: 'Fri', revenue: 17.6 }, { name: 'Sat', revenue: 12.9 }, { name: 'Sun', revenue: 5.4 },
]

const productionMix = [
  { name: 'Granite', planned: 180, actual: 165 },
  { name: 'Marble', planned: 90, actual: 88 },
  { name: 'Tiles', planned: 2400, actual: 2210 },
]

const recentOrdersColumns = [
  { key: 'id', label: 'Order No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]
const recentOrders = [
  { id: 'SO-2026-0986', customer: 'Sri Lakshmi Builders', product: 'Tan Brown Granite', amount: '₹9,84,000', status: 'Processing' },
  { id: 'SO-2026-0985', customer: 'Marble Palace Interiors', product: 'Ivory Ceramic Tile', amount: '₹3,60,000', status: 'Completed' },
  { id: 'SO-2026-0984', customer: 'Al Fahad Stone Trading', product: 'Black Galaxy Granite', amount: '₹8,20,000', status: 'Approved' },
  { id: 'SO-2026-0983', customer: 'Chola Constructions', product: 'Kashmir White Granite', amount: '₹4,75,000', status: 'Pending' },
]

export default function Dashboard() {
  const { t } = useLanguage()
  return (
    <>
      <PageHeader
        trail={[{ label: t('home') }]}
        title="Operations Dashboard"
        description={t('dashboardDesc')}
      />

      <StatGrid>
        {kpis.map((k, i) => (
          <Link to={k.path} key={i} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
            <StatCard {...k} />
          </Link>
        ))}
      </StatGrid>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-display)' }}>Weekly Revenue (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e2672a" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#e2672a" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Area type="monotone" dataKey="revenue" stroke="#e2672a" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-display)' }}>Production: Planned vs Actual</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productionMix}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              <Bar dataKey="planned" fill="#332c26" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" fill="#e2672a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 18 }}>Recent Sales Orders</h3>
            <Link to="/sales-order" className="btn btn-ghost btn-sm">View all <ArrowRight size={14} /></Link>
          </div>
          <DataTable columns={recentOrdersColumns} rows={recentOrders} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15.5, fontFamily: 'var(--font-display)' }}>Inventory Summary</h3>
              <Link to="/report-center" className="btn btn-ghost btn-sm">View <ArrowRight size={13} /></Link>
            </div>
            {[
              { label: 'Granite Slabs', pct: 82 },
              { label: 'Marble Slabs', pct: 61 },
              { label: 'Floor & Wall Tiles', pct: 45 },
              { label: 'Raw Blocks', pct: 70 },
            ].map((r) => (
              <div key={r.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5, color: 'var(--stone-dark)', fontWeight: 600 }}>
                  <span>{r.label}</span><span>{r.pct}%</span>
                </div>
                <div style={{ height: 7, background: 'var(--cream-deep)', borderRadius: 10 }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: 'linear-gradient(90deg,var(--orange),var(--orange-deep))', borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15.5, fontFamily: 'var(--font-display)' }}>Production Summary</h3>
              <Link to="/report-center" className="btn btn-ghost btn-sm">View <ArrowRight size={13} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}><span style={{ color: 'var(--stone)' }}>Batches In Progress</span><b>12</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}><span style={{ color: 'var(--stone)' }}>Completed Today</span><b>4</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}><span style={{ color: 'var(--stone)' }}>Machine Utilisation</span><b>84%</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}><span style={{ color: 'var(--stone)' }}>Avg. Wastage</span><b>6.1%</b></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
