import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, ChevronDown, LogOut, UserCircle2, SettingsIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import ThemeSwitcher from './ThemeSwitcher.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import './Navbar.css'

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function Navbar({ onMenuClick, pageTitle }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const displayName = user?.fullName || 'Guest User'
  const displayRole = user?.role || 'Team Member'

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div className="navbar-title">
          <span className="eyebrow">Granite &amp; Tile MMS</span>
          <h2>{pageTitle}</h2>
        </div>
      </div>

      <div className="navbar-search">
        <Search size={17} />
        <input type="text" placeholder={t('search')} />
      </div>

      <div className="navbar-right">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <button className="icon-btn">
          <Bell size={19} />
          <span className="dot-badge">3</span>
        </button>
        <div className="profile-menu">
          <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
            <div className="avatar">{getInitials(displayName)}</div>
            <div className="profile-text">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{displayRole}</span>
            </div>
            <ChevronDown size={15} />
          </button>
          {profileOpen && (
            <div className="profile-dropdown" onMouseLeave={() => setProfileOpen(false)}>
              <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                <UserCircle2 size={16} /> {t('myProfile')}
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                <SettingsIcon size={16} /> {t('settings')}
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} /> {t('signOut')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
