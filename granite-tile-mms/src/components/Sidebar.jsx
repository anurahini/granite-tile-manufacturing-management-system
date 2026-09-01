import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronsLeft, ChevronsRight, Gem } from 'lucide-react'
import { navConfig } from '../data/navConfig.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './Sidebar.css'

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const { t } = useLanguage()
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    navConfig.forEach(item => {
      if (item.type === 'group') {
        initial[item.label] = item.children.some(c => location.pathname.startsWith(c.path))
      }
    })
    return initial
  })

  const toggleGroup = (label) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Gem size={20} /></div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">Granite&nbsp;&amp;&nbsp;Tile</span>
              <span className="brand-sub">Manufacturing MMS</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navConfig.map((item) => {
            if (item.type === 'link') {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={19} strokeWidth={2} />
                  {!collapsed && <span>{t(item.labelKey) || item.label}</span>}
                </NavLink>
              )
            }
            const GroupIcon = item.icon
            const isOpen = openGroups[item.label]
            const groupActive = item.children.some(c => location.pathname.startsWith(c.path))
            return (
              <div key={item.label} className="nav-group">
                <button
                  className={`nav-link group-toggle ${groupActive ? 'active' : ''}`}
                  onClick={() => {
                    if (collapsed) {
                      // Expand the sidebar first; open the group on the next click
                      // once its children are actually visible.
                      setCollapsed(false)
                      setOpenGroups(prev => ({ ...prev, [item.label]: true }))
                      return
                    }
                    toggleGroup(item.label)
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <GroupIcon size={19} strokeWidth={2} />
                  {!collapsed && <span>{t(item.labelKey) || item.label}</span>}
                  {!collapsed && (
                    <ChevronDown size={16} className={`chevron ${isOpen ? 'rot' : ''}`} />
                  )}
                </button>
                {!collapsed && (
                  <div className={`nav-children ${isOpen ? 'open' : ''}`}>
                    {item.children.map(child => {
                      const ChildIcon = child.icon
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <ChildIcon size={16} strokeWidth={2} />
                          <span>{t(child.labelKey) || child.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronsRight size={17} /> : <><ChevronsLeft size={17} /><span>{t('collapseMenu')}</span></>}
        </button>
      </aside>
    </>
  )
}
