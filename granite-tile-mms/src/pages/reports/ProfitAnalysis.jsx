import { useState, useEffect } from 'react'
import ReportPageTemplate from '../../components/ReportPageTemplate.jsx'
import { PieChart, TrendingUp, Wallet, Percent } from 'lucide-react'
import { api } from '../../api/index.js'

const columns = [
  { key: 'month', label: 'Month' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'cost', label: 'Operating Cost' },
  { key: 'profit', label: 'Net Profit' },
  { key: 'margin', label: 'Margin' },
  { key: 'status', label: 'Trend' },
]

export default function ProfitAnalysis() {
  const [stats, setStats] = useState([])
  const [chartData, setChartData] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfitData()
  }, [])

  const fetchProfitData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profit')
      if (res && res.success && res.data) {
        const d = res.data
        setStats([
          { icon: Wallet, label: 'Net Profit (Calculated)', value: `₹${((d.netProfit || 0) / 100000).toFixed(2)} Lakhs`, tone: 'orange' },
          { icon: TrendingUp, label: 'Total Sales (DB)', value: `₹${((d.totalSales || 0) / 100000).toFixed(2)} Lakhs`, tone: 'success' },
          { icon: Percent, label: 'Profit Margin', value: `${d.profitPercentage || 0}%`, tone: 'info' },
          { icon: PieChart, label: 'Total Purchases & Expenses', value: `₹${(((d.totalPurchases || 0) + (d.expenses || 0)) / 100000).toFixed(2)} Lakhs`, tone: 'warning' },
        ])

        if (Array.isArray(d.monthlyBreakdown) && d.monthlyBreakdown.length > 0) {
          const formattedChart = d.monthlyBreakdown.map(m => ({
            name: m.month,
            revenue: Number(((m.sales || 0) / 100000).toFixed(1)),
            cost: Number((((m.purchases || 0) + (d.expenses || 0) / 6) / 100000).toFixed(1)),
            profit: Number(((m.netProfit || 0) / 100000).toFixed(1))
          }))
          setChartData(formattedChart)

          const formattedRows = d.monthlyBreakdown.map(m => ({
            month: `${m.month} 2026`,
            revenue: `₹${((m.sales || 0) / 100000).toFixed(2)}L`,
            cost: `₹${(((m.purchases || 0) + (d.expenses || 0) / 6) / 100000).toFixed(2)}L`,
            profit: `₹${((m.netProfit || 0) / 100000).toFixed(2)}L`,
            margin: `${m.sales > 0 ? ((m.netProfit / m.sales) * 100).toFixed(1) : '0'}%`,
            status: 'Live MySQL'
          }))
          setRows(formattedRows)
        }
      }
    } catch (err) {
      console.warn('[Profit Analysis Fetch Error]:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ReportPageTemplate
      breadcrumbLabel="Monthly Profit Analysis"
      translationKey="profitAnalysis"
      title="Monthly Profit Analysis"
      description="Dynamic calculation of Total Sales, Total Purchases, Expenses, Returns, Gross Profit, and Net Profit directly from MySQL database transactions."
      stats={stats}
      chartType="line"
      chartData={chartData}
      chartKeys={['revenue', 'cost', 'profit']}
      columns={columns}
      rows={rows}
    />
  )
}
