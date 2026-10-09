import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { User, Palette, Bell, ShieldCheck, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '../api/index.js'

const tabs = [
  { key: 'profile', label: 'Profile Settings', icon: User },
  { key: 'theme', label: 'Theme Settings', icon: Palette },
  { key: 'notifications', label: 'Notification Settings', icon: Bell },
  { key: 'security', label: 'Security Settings', icon: ShieldCheck },
]

const themeSwatches = [
  { key: 'light', name: 'Quarry Orange', colors: ['#e2672a', '#211d1a', '#f7efe2'] },
  { key: 'dark', name: 'Charcoal Slate', colors: ['#332c26', '#867b6d', '#f7efe2'] },
  { key: 'luxury', name: 'Terracotta Warm', colors: ['#c8891e', '#5a5148', '#efe1c8'] },
  { key: 'granite-black', name: 'Granite Obsidian', colors: ['#111111', '#5a5148', '#ffffff'] },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const { t } = useLanguage()
  const { user } = useAuth()
  const { theme, setTheme, density, setDensity, fontScale, setFontScale } = useTheme()

  const userId = user?.id || 1

  // Profile Form State
  const [profile, setProfile] = useState({
    fullName: user?.fullName || 'Ramesh Sundaram',
    email: user?.email || 'ramesh.s@granitex.com',
    mobile: user?.mobile || '+91 98400 12345',
    designation: user?.designation || 'Plant Administrator',
    department: user?.department || 'Operations',
    employeeId: user?.employeeId || 'EMP-2001'
  })

  // Theme Form State
  const [selectedTheme, setSelectedTheme] = useState(theme || 'light')
  const [selectedDensity, setSelectedDensity] = useState(density || 'Comfortable')
  const [selectedFontScale, setSelectedFontScale] = useState(fontScale || 'Medium')

  // Notification State
  const [notifications, setNotifications] = useState({
    salesOrderAlerts: true,
    lowStockAlerts: true,
    productionAlerts: true,
    paymentConfirmations: false,
    weeklyReportEmail: true
  })

  // Security Form State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: 'Enabled'
  })

  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchUserData()
    // Load stored notifications if available
    const savedNotifs = localStorage.getItem('gtmms_notifications')
    if (savedNotifs) {
      try { setNotifications(JSON.parse(savedNotifs)) } catch { }
    }
  }, [userId])

  const fetchUserData = async () => {
    const res = await api.get(`/users/${userId}`)
    if (res && res.success && res.data) {
      const u = res.data
      setProfile({
        fullName: u.fullName || 'Ramesh Sundaram',
        email: u.email || 'ramesh.s@granitex.com',
        mobile: u.mobile || '+91 98400 12345',
        designation: u.designation || 'Plant Administrator',
        department: u.department || 'Operations',
        employeeId: u.employeeId || 'EMP-2001'
      })
      if (u.theme) {
        setSelectedTheme(u.theme)
        setTheme(u.theme)
      }
      if (u.sidebarDensity) {
        setSelectedDensity(u.sidebarDensity)
        setDensity(u.sidebarDensity)
      }
      if (u.fontScale) {
        setSelectedFontScale(u.fontScale)
        setFontScale(u.fontScale)
      }
      if (u.notificationPreferences) {
        try {
          const notifObj = typeof u.notificationPreferences === 'string'
            ? JSON.parse(u.notificationPreferences)
            : u.notificationPreferences
          setNotifications(notifObj)
        } catch { }
      }
      if (typeof u.twoFactorEnabled !== 'undefined') {
        setSecurity(s => ({ ...s, twoFactorEnabled: u.twoFactorEnabled ? 'Enabled' : 'Disabled' }))
      }
    }
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setErrorMsg('')
    setSaving(true)

    const res = await api.put(`/users/${userId}/profile`, profile)
    setSaving(false)

    if (res && res.success) {
      setStatusMsg('Profile settings updated and saved to MySQL successfully!')
      // Update local storage session
      const existingSession = JSON.parse(localStorage.getItem('gtmms_session') || '{}')
      if (existingSession.id) {
        localStorage.setItem('gtmms_session', JSON.stringify({ ...existingSession, ...profile }))
      }
    } else {
      setErrorMsg(res?.message || 'Failed to update profile settings.')
    }
  }

  const handleThemeApply = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setErrorMsg('')
    setSaving(true)

    setTheme(selectedTheme)
    setDensity(selectedDensity)
    setFontScale(selectedFontScale)

    const res = await api.put(`/users/${userId}/theme`, {
      theme: selectedTheme,
      sidebarDensity: selectedDensity,
      fontScale: selectedFontScale
    })
    setSaving(false)

    if (res && res.success) {
      setStatusMsg('Theme settings applied and persisted to MySQL successfully!')
    } else {
      setStatusMsg('Theme applied locally and saved to settings!')
    }
  }

  const handleNotificationsSave = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setErrorMsg('')
    setSaving(true)

    localStorage.setItem('gtmms_notifications', JSON.stringify(notifications))

    const res = await api.put(`/users/${userId}/notifications`, {
      notificationPreferences: notifications
    })
    setSaving(false)

    if (res && res.success) {
      setStatusMsg('Notification preferences saved to MySQL successfully!')
    } else {
      setStatusMsg('Notification preferences saved locally!')
    }
  }

  const handleSecuritySave = async (e) => {
    e.preventDefault()
    setStatusMsg('')
    setErrorMsg('')

    if (security.newPassword || security.confirmPassword) {
      if (!security.currentPassword) {
        setErrorMsg('Please enter your current password to change password.')
        return
      }
      if (security.newPassword !== security.confirmPassword) {
        setErrorMsg('New password and confirm password do not match.')
        return
      }
      if (security.newPassword.length < 4) {
        setErrorMsg('New password must be at least 4 characters long.')
        return
      }
    }

    setSaving(true)
    const res = await api.post('/auth/update-password', {
      userId,
      currentPassword: security.currentPassword,
      newPassword: security.newPassword,
      twoFactorEnabled: security.twoFactorEnabled === 'Enabled'
    })
    setSaving(false)

    if (res && res.success) {
      setStatusMsg('Security settings updated securely in MySQL!')
      setSecurity(s => ({ ...s, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } else {
      setErrorMsg(res?.message || 'Failed to update security settings.')
    }
  }

  const initials = (profile.fullName || 'Ramesh Sundaram')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('settings') }]}
        title={t('settings')}
        description={t('settingsDesc')}
      />

      {statusMsg && (
        <div className="auth-success" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="auth-error" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="tab-row">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              className={`tab-item ${tab === t.key ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
              onClick={() => { setTab(t.key); setStatusMsg(''); setErrorMsg('') }}
            >
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="card" style={{ padding: 26, maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 20, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--orange)', color: '#fff', fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{profile.fullName}</div>
              <div style={{ color: 'var(--stone)', fontSize: 13 }}>{profile.designation} · {profile.department}</div>
            </div>
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Full Name</label>
              <input
                required
                value={profile.fullName}
                onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input
                required
                value={profile.mobile}
                onChange={(e) => setProfile(p => ({ ...p, mobile: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Designation</label>
              <input
                required
                value={profile.designation}
                onChange={(e) => setProfile(p => ({ ...p, designation: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Department</label>
              <select
                value={profile.department}
                onChange={(e) => setProfile(p => ({ ...p, department: e.target.value }))}
              >
                <option>Operations</option>
                <option>Production</option>
                <option>Sales</option>
                <option>Finance</option>
                <option>Logistics</option>
              </select>
            </div>
            <div className="field">
              <label>Employee Code</label>
              <input
                value={profile.employeeId}
                onChange={(e) => setProfile(p => ({ ...p, employeeId: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving to MySQL...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {tab === 'theme' && (
        <form onSubmit={handleThemeApply} className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Appearance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 22 }}>
            {themeSwatches.map((s) => (
              <div
                key={s.key}
                className="card"
                style={{
                  padding: 14,
                  cursor: 'pointer',
                  border: selectedTheme === s.key ? '2px solid var(--orange)' : '1px solid var(--cream-line)',
                  background: selectedTheme === s.key ? 'var(--cream-light)' : 'var(--white)'
                }}
                onClick={() => setSelectedTheme(s.key)}
              >
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {s.colors.map(c => <div key={c} style={{ width: 24, height: 24, borderRadius: 6, background: c, border: '1px solid rgba(0,0,0,0.1)' }} />)}
                </div>
                <div style={{ fontSize: 13, fontWeight: selectedTheme === s.key ? 700 : 600 }}>{s.name}</div>
              </div>
            ))}
          </div>
          <div className="form-grid">
            <div className="field">
              <label>Sidebar Density</label>
              <select value={selectedDensity} onChange={(e) => setSelectedDensity(e.target.value)}>
                <option value="Comfortable">Comfortable</option>
                <option value="Compact">Compact</option>
              </select>
            </div>
            <div className="field">
              <label>Font Scale</label>
              <select value={selectedFontScale} onChange={(e) => setSelectedFontScale(e.target.value)}>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Applying...' : 'Apply Theme'}
            </button>
          </div>
        </form>
      )}

      {tab === 'notifications' && (
        <form onSubmit={handleNotificationsSave} className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Notification Preferences</h3>
          {[
            { key: 'salesOrderAlerts', label: 'New sales order alerts' },
            { key: 'lowStockAlerts', label: 'Low stock & reorder alerts' },
            { key: 'productionAlerts', label: 'Production batch completion' },
            { key: 'paymentConfirmations', label: 'Payment received confirmations' },
            { key: 'weeklyReportEmail', label: 'Weekly performance summary email' },
          ].map(n => (
            <label key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--cream-line)', fontSize: 14, cursor: 'pointer' }}>
              {n.label}
              <input
                type="checkbox"
                checked={!!notifications[n.key]}
                onChange={(e) => setNotifications(prev => ({ ...prev, [n.key]: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: 'var(--orange)' }}
              />
            </label>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handleSecuritySave} className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Security</h3>
          <div className="form-grid">
            <div className="field">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={security.currentPassword}
                onChange={(e) => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={security.newPassword}
                onChange={(e) => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={security.confirmPassword}
                onChange={(e) => setSecurity(s => ({ ...s, confirmPassword: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Two-Factor Authentication</label>
              <select
                value={security.twoFactorEnabled}
                onChange={(e) => setSecurity(s => ({ ...s, twoFactorEnabled: e.target.value }))}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Updating...' : 'Update Security'}
            </button>
          </div>
        </form>
      )}
    </>
  )
}
