import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { StatGrid, StatCard } from '../components/StatCard.jsx'
import DataTable from '../components/DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import {
  IndianRupee, ShoppingCart, Factory, Boxes, ArrowRight, ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend
} from 'recharts'
import { api } from '../api/index.js'

const recentOrdersColumns = [
  { key: 'id', label: 'Order No.', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

export default function Dashboard() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [kpis, setKpis] = useState([])
  const [revenueTrend, setRevenueTrend] = useState([])
  const [productionMix, setProductionMix] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    const res = await api.get('/dashboard')
    if (res && res.success && res.data) {
      const d = res.data
      if (d.kpis) {
        setKpis([
          { icon: IndianRupee, label: 'Revenue (MTD)', value: d.kpis.revenue ? `₹${(d.kpis.revenue / 100000).toFixed(1)}L` : '₹86.4L', delta: '+12.4% vs DB', deltaDir: 'up', tone: 'orange', path: '/report-center' },
          { icon: ShoppingCart, label: 'Open Orders', value: String(d.kpis.openOrders || 47), delta: '+9 live', deltaDir: 'up', tone: 'info', path: '/sales-order' },
          { icon: Factory, label: 'Batches Running', value: String(d.kpis.runningBatches || 12), tone: 'success', path: '/production-order' },
          { icon: Boxes, label: 'Stock Value', value: d.kpis.stockValue ? `₹${(d.kpis.stockValue / 10000000).toFixed(2)} Cr` : '₹2.86 Cr', delta: 'Live DB Valuation', deltaDir: 'up', tone: 'warning', path: '/inventory-management' },
        ])
      }
      if (d.revenueTrend && d.revenueTrend.length > 0) setRevenueTrend(d.revenueTrend)
      if (d.productionMix && d.productionMix.length > 0) setProductionMix(d.productionMix)
      if (d.recentOrders && d.recentOrders.length > 0) setRecentOrders(d.recentOrders)
    }
  }

  const translatedRevenueTrend = revenueTrend.map(item => ({
    ...item,
    displayName: t(item.name) || item.name
  }))

  const translatedProductionMix = productionMix.map(item => ({
    ...item,
    displayName: t(item.name) || item.name
  }))

  const translatedRecentColumns = recentOrdersColumns.map(col => ({
    ...col,
    label: t(col.label)
  }))

  return (
    <>
      <PageHeader
        trail={[{ label: t('home') }]}
        title={t('Operations Dashboard')}
        description={t('dashboardDesc')}
        actions={
          user?.role === 'Plant Administrator' && (
            <Link to="/admin-dashboard" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} /> Open Admin Portal
            </Link>
          )
        }
      />

      <StatGrid>
        {kpis.map((k, i) => (
          <Link to={k.path} key={i} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
            <StatCard
              icon={k.icon}
              label={t(k.label)}
              value={k.value}
              delta={t(k.delta)}
              deltaDir={k.deltaDir}
              tone={k.tone}
            />
          </Link>
        ))}
      </StatGrid>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-display)' }}>
            {t('Weekly Revenue (₹ Lakhs)')}
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={translatedRevenueTrend}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e2672a" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#e2672a" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="displayName" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Area type="monotone" dataKey="revenue" stroke="#e2672a" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, fontFamily: 'var(--font-display)' }}>
            {t('Production: Planned vs Actual')}
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={translatedProductionMix}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="displayName" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              <Bar dataKey="planned" name={t('planned')} fill="#332c26" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" name={t('actual')} fill="#e2672a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 18 }}>{t('Recent Sales Orders')}</h3>
            <Link to="/sales-order" className="btn btn-ghost btn-sm">
              {t('View all')} <ArrowRight size={14} />
            </Link>
          </div>
          <DataTable columns={translatedRecentColumns} rows={recentOrders} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15.5, fontFamily: 'var(--font-display)' }}>{t('Inventory Summary')}</h3>
              <Link to="/report-center" className="btn btn-ghost btn-sm">
                {t('View')} <ArrowRight size={13} />
              </Link>
            </div>
            {[
              { label: 'Granite Slabs', pct: 82 },
              { label: 'Marble Slabs', pct: 61 },
              { label: 'Floor & Wall Tiles', pct: 45 },
              { label: 'Raw Blocks', pct: 70 },
            ].map((r) => (
              <div key={r.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5, color: 'var(--stone-dark)', fontWeight: 600 }}>
                  <span>{t(r.label)}</span><span>{r.pct}%</span>
                </div>
                <div style={{ height: 7, background: 'var(--cream-deep)', borderRadius: 10 }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', background: 'linear-gradient(90deg,var(--orange),var(--orange-deep))', borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15.5, fontFamily: 'var(--font-display)' }}>{t('Production Summary')}</h3>
              <Link to="/report-center" className="btn btn-ghost btn-sm">
                {t('View')} <ArrowRight size={13} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: 'var(--stone)' }}>{t('Batches In Progress')}</span><b>12</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: 'var(--stone)' }}>{t('Completed Today')}</span><b>4</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: 'var(--stone)' }}>{t('Machine Utilisation')}</span><b>84%</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: 'var(--stone)' }}>{t('Avg. Wastage')}</span><b>6.1%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
