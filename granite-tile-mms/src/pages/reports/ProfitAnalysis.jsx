import ReportPageTemplate from '../../components/ReportPageTemplate.jsx'
import { PieChart, TrendingUp, Wallet, Percent } from 'lucide-react'

const stats = [
  { icon: Wallet, label: 'Net Profit (MTD)', value: '₹18.6L', delta: '+9.2%', deltaDir: 'up', tone: 'orange' },
  { icon: TrendingUp, label: 'Revenue', value: '₹86.4L', tone: 'success' },
  { icon: Percent, label: 'Profit Margin', value: '21.5%', delta: '+1.8%', deltaDir: 'up', tone: 'info' },
  { icon: PieChart, label: 'Operating Cost', value: '₹67.8L', tone: 'warning' },
]

const chartData = [
  { name: 'Mar', revenue: 62, cost: 49, profit: 13 },
  { name: 'Apr', revenue: 68, cost: 53, profit: 15 },
  { name: 'May', revenue: 74, cost: 58, profit: 16 },
  { name: 'Jun', revenue: 71, cost: 56, profit: 15 },
  { name: 'Jul', revenue: 80, cost: 62, profit: 18 },
  { name: 'Aug', revenue: 86, cost: 68, profit: 18.6 },
]

const columns = [
  { key: 'month', label: 'Month' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'cost', label: 'Operating Cost' },
  { key: 'profit', label: 'Net Profit' },
  { key: 'margin', label: 'Margin' },
  { key: 'status', label: 'Trend' },
]

const rows = [
  { month: 'March 2026', revenue: '₹62.0L', cost: '₹49.0L', profit: '₹13.0L', margin: '21.0%', status: 'Approved' },
  { month: 'April 2026', revenue: '₹68.0L', cost: '₹53.0L', profit: '₹15.0L', margin: '22.1%', status: 'Approved' },
  { month: 'May 2026', revenue: '₹74.0L', cost: '₹58.0L', profit: '₹16.0L', margin: '21.6%', status: 'Approved' },
  { month: 'June 2026', revenue: '₹71.0L', cost: '₹56.0L', profit: '₹15.0L', margin: '21.1%', status: 'Approved' },
  { month: 'July 2026', revenue: '₹80.0L', cost: '₹62.0L', profit: '₹18.0L', margin: '22.5%', status: 'Approved' },
  { month: 'August 2026', revenue: '₹86.4L', cost: '₹67.8L', profit: '₹18.6L', margin: '21.5%', status: 'Pending' },
]

export default function ProfitAnalysis() {
  return (
    <ReportPageTemplate
      breadcrumbLabel="Monthly Profit Analysis"
      translationKey="profitAnalysis"
      title="Monthly Profit Analysis"
      description="Revenue, cost and net profit trend across the last six months."
      stats={stats}
      chartType="line"
      chartData={chartData}
      chartKeys={['revenue', 'cost', 'profit']}
      columns={columns}
      rows={rows}
    />
  )
}
