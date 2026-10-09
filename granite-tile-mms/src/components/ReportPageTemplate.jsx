import { useState } from 'react'
import PageHeader from './PageHeader.jsx'
import { StatGrid, StatCard } from './StatCard.jsx'
import FilterBar from './FilterBar.jsx'
import DataTable from './DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Calendar, Download } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts'
import { exportToCSV } from '../utils/exportUtils.js'

const PIE_COLORS = ['#e2672a', '#332c26', '#c8891e', '#3e7a73', '#3f8556']

export default function ReportPageTemplate({
  breadcrumbLabel, title, description, translationKey, stats, chartType = 'bar', chartData, chartKeys, columns, rows = []
}) {
  const { t } = useLanguage()
  const displayTitle = (translationKey && t(translationKey) !== translationKey ? t(translationKey) : title)
  const displayDesc = (translationKey && t(`${translationKey}Desc`) !== `${translationKey}Desc` ? t(`${translationKey}Desc`) : description)

  const [search, setSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({})

  const handleExport = () => {
    exportToCSV(rows, columns, `${displayTitle.toLowerCase().replace(/\s+/g, '-')}-report.csv`)
  }

  const handleResetFilters = () => {
    setSearch('')
    setSelectedFilters({})
  }

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('reports') }, { label: displayTitle }]}
        title={displayTitle}
        description={displayDesc}
        actions={[
          <button className="btn btn-outline btn-sm" key="range"><Calendar size={15} /> This Month</button>,
          <button className="btn btn-primary btn-sm" key="export" onClick={handleExport}><Download size={15} /> Export Report</button>
        ]}
      />

      {stats && (
        <StatGrid>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </StatGrid>
      )}

      <div className="card" style={{ padding: '24px 22px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>{displayTitle} Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              {chartKeys.map((k, i) => (
                <Bar key={k} dataKey={k} fill={i === 0 ? '#e2672a' : '#332c26'} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          ) : chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Legend />
              {chartKeys.map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={i === 0 ? '#e2672a' : '#3e7a73'} strokeWidth={2.5} dot={{ r: 3 }} />
              ))}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efe1c8" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#867b6d' }} />
              <YAxis tick={{ fontSize: 12, fill: '#867b6d' }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2d3b4' }} />
              <Area type="monotone" dataKey={chartKeys[0]} stroke="#e2672a" fill="#f7d8bb" strokeWidth={2.5} />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={chartData} dataKey={chartKeys[0]} nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 18 }}>Detailed Report</h3>
      </div>

      <FilterBar
        placeholder={`Search ${displayTitle.toLowerCase()}...`}
        searchValue={search}
        onSearchChange={(val) => setSearch(val)}
        filters={['Status']}
        dataRows={rows}
        selectedFilters={selectedFilters}
        onFilterChange={(key, val) => setSelectedFilters(prev => ({ ...prev, [key]: val }))}
        onResetFilters={handleResetFilters}
        onExport={handleExport}
      />

      <DataTable
        columns={columns}
        rows={rows}
        searchQuery={search}
        activeFilters={selectedFilters}
        pageSize={10}
        onResetFilters={handleResetFilters}
      />
    </>
  )
}
