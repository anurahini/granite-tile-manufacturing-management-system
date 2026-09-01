import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Cog, Wrench, Zap, Timer } from 'lucide-react'

const stats = [
  { icon: Cog, label: 'Total Machines', value: '34', tone: 'orange' },
  { icon: Zap, label: 'Running', value: '27', tone: 'success' },
  { icon: Wrench, label: 'Under Maintenance', value: '4', tone: 'warning' },
  { icon: Timer, label: 'Avg. Uptime', value: '91.4%', delta: '+1.2%', deltaDir: 'up', tone: 'info' },
]

const columns = [
  { key: 'id', label: 'Machine ID', mono: true },
  { key: 'name', label: 'Machine Name' },
  { key: 'type', label: 'Type' },
  { key: 'location', label: 'Bay / Line' },
  { key: 'lastService', label: 'Last Service' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'MCH-01', name: 'Gang Saw Cutter GS-200', type: 'Block Cutting', location: 'Bay 1', lastService: '02 Jun 2026', status: 'Active' },
  { id: 'MCH-02', name: 'Automatic Polishing Line', type: 'Polishing', location: 'Bay 2', lastService: '18 May 2026', status: 'Active' },
  { id: 'MCH-03', name: 'CNC Router 5-Axis', type: 'Profiling', location: 'Bay 3', lastService: '25 Jul 2026', status: 'In Production' },
  { id: 'MCH-04', name: 'Bridge Cutting Machine', type: 'Precision Cutting', location: 'Bay 1', lastService: '10 Jul 2026', status: 'Active' },
  { id: 'MCH-05', name: 'Edge Profiling Unit EP-9', type: 'Edging', location: 'Bay 4', lastService: '30 Apr 2026', status: 'Inactive' },
]

export default function MachineMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Machine Master"
      translationKey="machineMaster"
      title="Machine Master"
      description="Track factory machinery, maintenance schedules and operating status."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Type', 'Bay / Line', 'Status']}
      addLabel="Add Machine"
    />
  )
}
