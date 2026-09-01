import { useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import { StatGrid, StatCard } from '../../components/StatCard.jsx'
import DataTable from '../../components/DataTable.jsx'
import { Calendar, Download, TrendingUp, IndianRupee, ClipboardList, Truck, AlertTriangle, Boxes, Factory, Gauge } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'

const tabs = [
  { key: 'sales', label: 'Sales Report' },
  { key: 'purchase', label: 'Purchase Report' },
  { key: 'inventory', label: 'Inventory Report' },
  { key: 'production', label: 'Production Report' },
]

const reportData = {
  sales: {
    stats: [
      { icon: IndianRupee, label: 'Total Sales (MTD)', value: '₹86.4L', delta: '+12.4%', deltaDir: 'up', tone: 'orange' },
      { icon: TrendingUp, label: 'Orders Booked', value: '212', delta: '+18', deltaDir: 'up', tone: 'success' },
      { icon: ClipboardList, label: 'Avg. Order Value', value: '₹40,800', tone: 'info' },
    ],
    chartType: 'bar',
    chartKeys: ['sales', 'target'],
    chartData: [
      { name: 'Mar', sales: 62, target: 60 }, { name: 'Apr', sales: 68, target: 65 },
      { name: 'May', sales: 74, target: 70 }, { name: 'Jun', sales: 71, target: 72 },
      { name: 'Jul', sales: 80, target: 75 }, { name: 'Aug', sales: 86, target: 80 },
    ],
    columns: [
      { key: 'id', label: 'SO No.', mono: true }, { key: 'customer', label: 'Customer' },
      { key: 'product', label: 'Product' }, { key: 'value', label: 'Value (₹L)' }, { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 'SO-2026-0986', customer: 'Sri Lakshmi Builders', product: 'Tan Brown Granite', value: '9.84', status: 'Processing' },
      { id: 'SO-2026-0985', customer: 'Marble Palace Interiors', product: 'Ivory Ceramic Tile', value: '3.60', status: 'Completed' },
      { id: 'SO-2026-0984', customer: 'Al Fahad Stone Trading', product: 'Black Galaxy Granite', value: '8.20', status: 'Approved' },
      { id: 'SO-2026-0983', customer: 'Chola Constructions', product: 'Kashmir White Granite', value: '4.75', status: 'Pending' },
    ],
  },
  purchase: {
    stats: [
      { icon: IndianRupee, label: 'Total Purchases (MTD)', value: '₹52.1L', delta: '+6.8%', deltaDir: 'up', tone: 'orange' },
      { icon: ClipboardList, label: 'POs Raised', value: '64', tone: 'info' },
      { icon: Truck, label: 'Active Suppliers', value: '38', tone: 'warning' },
    ],
    chartType: 'area',
    chartKeys: ['purchase'],
    chartData: [
      { name: 'Mar', purchase: 40 }, { name: 'Apr', purchase: 46 }, { name: 'May', purchase: 44 },
      { name: 'Jun', purchase: 50 }, { name: 'Jul', purchase: 48 }, { name: 'Aug', purchase: 52 },
    ],
    columns: [
      { key: 'id', label: 'PO No.', mono: true }, { key: 'supplier', label: 'Supplier' },
      { key: 'material', label: 'Material' }, { key: 'value', label: 'Value (₹L)' }, { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 'PO-2026-0147', supplier: 'Kanchi Quarries Pvt Ltd', material: 'Raw Granite Blocks', value: '5.76', status: 'Approved' },
      { id: 'PO-2026-0146', supplier: 'Rajasthan Stone Exports', material: 'Marble Blocks', value: '3.24', status: 'Pending' },
      { id: 'PO-2026-0145', supplier: 'TechBlade Tools', material: 'Diamond Blades', value: '1.80', status: 'Completed' },
      { id: 'PO-2026-0144', supplier: 'Southern Adhesives', material: 'Epoxy Resin', value: '0.98', status: 'Cancelled' },
    ],
  },
  inventory: {
    stats: [
      { icon: Boxes, label: 'Stock Value', value: '₹2.86 Cr', tone: 'orange' },
      { icon: AlertTriangle, label: 'Low Stock Items', value: '14', tone: 'warning' },
      { icon: AlertTriangle, label: 'Out of Stock', value: '3', tone: 'danger' },
    ],
    chartType: 'bar',
    chartKeys: ['value'],
    chartData: [
      { name: 'Granite', value: 42 }, { name: 'Marble', value: 18 }, { name: 'Floor Tile', value: 24 },
      { name: 'Wall Tile', value: 10 }, { name: 'Raw Blocks', value: 6 },
    ],
    columns: [
      { key: 'id', label: 'Item Code', mono: true }, { key: 'product', label: 'Product' },
      { key: 'warehouse', label: 'Warehouse' }, { key: 'qty', label: 'Qty' }, { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 'INV-8001', product: 'Tan Brown Granite Slab', warehouse: 'Main FG Store', qty: '412', status: 'In Stock' },
      { id: 'INV-8002', product: 'Black Galaxy Granite', warehouse: 'Main FG Store', qty: '38', status: 'Low Stock' },
      { id: 'INV-8003', product: 'Ivory Ceramic Floor Tile', warehouse: 'Tile Storage Unit', qty: '0', status: 'Out of Stock' },
      { id: 'INV-8004', product: 'Raw Granite Blocks', warehouse: 'Raw Block Yard', qty: '96', status: 'In Stock' },
    ],
  },
  production: {
    stats: [
      { icon: Factory, label: 'Batches Completed', value: '58', delta: '+7', deltaDir: 'up', tone: 'orange' },
      { icon: Gauge, label: 'Machine Utilisation', value: '84%', tone: 'success' },
      { icon: AlertTriangle, label: 'Wastage Rate', value: '6.1%', delta: '-0.4%', deltaDir: 'down', tone: 'warning' },
    ],
    chartType: 'line',
    chartKeys: ['output', 'wastage'],
    chartData: [
      { name: 'Mar', output: 210, wastage: 16 }, { name: 'Apr', output: 225, wastage: 15 },
      { name: 'May', output: 240, wastage: 14 }, { name: 'Jun', output: 232, wastage: 13 },
      { name: 'Jul', output: 258, wastage: 12 }, { name: 'Aug', output: 265, wastage: 11 },
    ],
    columns: [
      { key: 'id', label: 'Order No.', mono: true }, { key: 'product', label: 'Product' },
      { key: 'line', label: 'Machine Line' }, { key: 'wastage', label: 'Wastage %' }, { key: 'status', label: 'Status' },
    ],
    rows: [
      { id: 'PRO-2026-0311', product: 'Tan Brown Granite Slab', line: 'Gang Saw GS-200', wastage: '5.8%', status: 'In Production' },
      { id: 'PRO-2026-0310', product: 'Black Galaxy Granite', line: 'Polishing Line', wastage: '4.2%', status: 'Completed' },
      { id: 'PRO-2026-0309', product: 'Ivory Ceramic Floor Tile', line: 'CNC Router 5-Axis', wastage: '3.1%', status: 'Quality Check' },
      { id: 'PRO-2026-0308', product: 'Kashmir White Granite', line: 'Bridge Cutting', wastage: '6.9%', status: 'Pending' },
    ],
  },
}

export default function ReportCenter() {
  const [active, setActive] = useState('sales')
  const data = reportData[active]

  return (
    <>
      <PageHeader
        trail={[{ label: 'Home', path: '/dashboard' }, { label: 'Reports' }, { label: 'Report Center' }]}
        title="Report Center"
        description="Sales, purchase, inventory and production analytics in one place."
        actions={[
          <button className="btn btn-outline btn-sm" key="range"><Calendar size={15} /> This Month</button>,
          <button className="btn btn-primary btn-sm" key="export"><Download size={15} /> Export Report</button>
        ]}
      />

      <div className="tab-row">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab-item ${active === t.key ? 'active' : ''}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <StatGrid>
        {data.stats.map((s, i) => <StatCard key={i} {...s} />)}
      </StatGrid>

      <div className="card" style={{ padding: '24px 22px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>
          {tabs.find(t => t.key === active)?.label} Trend
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          {data.chartType === 'bar' ? (
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              {data.chartKeys.map((k, i) => (
                <Bar key={k} dataKey={k} fill={i === 0 ? '#e2672a' : '#332c26'} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          ) : data.chartType === 'line' ? (
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              {data.chartKeys.map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={i === 0 ? '#e2672a' : '#3e7a73'} strokeWidth={2.5} dot={{ r: 3 }} />
              ))}
            </LineChart>
          ) : (
            <AreaChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Area type="monotone" dataKey={data.chartKeys[0]} stroke="#e2672a" fill="#f7d8bb" strokeWidth={2.5} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <h3 style={{ fontSize: 18, marginBottom: 14 }}>Detailed Report</h3>
      <DataTable columns={data.columns} rows={data.rows} />
    </>
  )
}
