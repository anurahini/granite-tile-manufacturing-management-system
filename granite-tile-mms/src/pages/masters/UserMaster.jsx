import MasterPageTemplate from '../../components/MasterPageTemplate.jsx'
import { Users, UserCheck, ShieldCheck, UserX } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Total Users', value: '48', delta: '+4 this month', deltaDir: 'up', tone: 'orange' },
  { icon: UserCheck, label: 'Active Users', value: '41', delta: '+2 this week', deltaDir: 'up', tone: 'success' },
  { icon: ShieldCheck, label: 'Admin Roles', value: '6', tone: 'info' },
  { icon: UserX, label: 'Inactive', value: '7', delta: '-1 this month', deltaDir: 'down', tone: 'danger' },
]

const columns = [
  { key: 'id', label: 'User ID', mono: true },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
]

const rows = [
  { id: 'USR-1001', name: 'Ramesh Sundaram', role: 'Plant Administrator', department: 'Operations', email: 'ramesh.s@granitex.com', status: 'Active' },
  { id: 'USR-1002', name: 'Priya Natarajan', role: 'Production Manager', department: 'Production', email: 'priya.n@granitex.com', status: 'Active' },
  { id: 'USR-1003', name: 'Arjun Menon', role: 'Sales Executive', department: 'Sales', email: 'arjun.m@granitex.com', status: 'Active' },
  { id: 'USR-1004', name: 'Kavitha Rao', role: 'Inventory Clerk', department: 'Warehouse', email: 'kavitha.r@granitex.com', status: 'Inactive' },
  { id: 'USR-1005', name: 'Suresh Babu', role: 'Quality Inspector', department: 'Quality', email: 'suresh.b@granitex.com', status: 'Active' },
  { id: 'USR-1006', name: 'Divya Chandran', role: 'Accounts Officer', department: 'Finance', email: 'divya.c@granitex.com', status: 'Active' },
]

export default function UserMaster() {
  return (
    <MasterPageTemplate
      breadcrumbLabel="User Master"
      translationKey="userMaster"
      title="User Master"
      description="Manage system users, roles and access levels across the factory ERP."
      stats={stats}
      columns={columns}
      rows={rows}
      filters={['Role', 'Department', 'Status']}
      addLabel="Add User"
    />
  )
}
