import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Chatbot from '../components/Chatbot.jsx'
import { navConfig } from '../data/navConfig.js'

function getPageTitle(pathname) {
  for (const item of navConfig) {
    if (item.type === 'link' && item.path === pathname) return item.label
    if (item.type === 'group') {
      const child = item.children.find(c => c.path === pathname)
      if (child) return child.label
    }
  }
  if (pathname.startsWith('/product-catalog')) return 'Product Catalog'
  return 'Granite & Tile MMS'
}

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`main-col ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar onMenuClick={() => setMobileOpen(!mobileOpen)} pageTitle={getPageTitle(location.pathname)} />
        <div className="page-body">
          <Outlet />
        </div>
      </div>
      <Chatbot />
    </div>
  )
}
