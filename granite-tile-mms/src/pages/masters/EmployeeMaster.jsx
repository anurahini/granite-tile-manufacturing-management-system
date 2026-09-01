import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { UserSquare2, HardHat, Wallet, CalendarCheck } from 'lucide-react'

const stats = [
  { icon: UserSquare2, label: 'Total Employees', value: '132', tone: 'orange' },
  { icon: HardHat, label: 'Shop Floor Staff', value: '86', tone: 'info' },
  { icon: Wallet, label: 'Monthly Payroll', value: '₹18.4L', tone: 'success' },
  { icon: CalendarCheck, label: 'Present Today', value: '124', delta: '94% attendance', deltaDir: 'up', tone: 'success' },
]

const columns = [
  { key: 'id', label: 'Emp Code', mono: true },
  { key: 'name', label: 'Name' },
  { key: 'designation', label: 'Designation' },
  { key: 'shift', label: 'Shift' },
  { key: 'joined', label: 'Joined On' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'EMP-2101', name: 'Karthik Iyer', designation: 'Slab Cutting Operator', shift: 'Shift A (6AM-2PM)', joined: '12 Jan 2021', status: 'Active' },
  { id: 'EMP-2102', name: 'Meena Pillai', designation: 'Polishing Technician', shift: 'Shift B (2PM-10PM)', joined: '03 Mar 2022', status: 'Active' },
  { id: 'EMP-2103', name: 'Vignesh Raj', designation: 'CNC Machine Operator', shift: 'Shift A (6AM-2PM)', joined: '21 Jul 2020', status: 'Active' },
  { id: 'EMP-2104', name: 'Anitha Selvam', designation: 'Quality Inspector', shift: 'General', joined: '15 Sep 2023', status: 'Active' },
  { id: 'EMP-2105', name: 'Ravi Kumar', designation: 'Forklift Operator', shift: 'Shift C (10PM-6AM)', joined: '02 Feb 2019', status: 'Inactive' },
]

export default function EmployeeMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="Employee Master"
      translationKey="employeeMaster"
      title="Employee Master"
      description="Maintain factory workforce records, designations and shift allocations."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Designation', 'Shift', 'Status']}
      addLabel="Add Employee"
    />
  )
}
