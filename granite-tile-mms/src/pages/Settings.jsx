import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { User, Palette, Bell, ShieldCheck, Save } from 'lucide-react'

const tabs = [
  { key: 'profile', label: 'Profile Settings', icon: User },
  { key: 'theme', label: 'Theme Settings', icon: Palette },
  { key: 'notifications', label: 'Notification Settings', icon: Bell },
  { key: 'security', label: 'Security Settings', icon: ShieldCheck },
]

const themeSwatches = [
  { name: 'Quarry Orange', colors: ['#e2672a', '#211d1a', '#f7efe2'] },
  { name: 'Charcoal Slate', colors: ['#332c26', '#867b6d', '#f7efe2'] },
  { name: 'Terracotta Warm', colors: ['#c8891e', '#5a5148', '#efe1c8'] },
]

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('settings') }]}
        title={t('settings')}
        description={t('settingsDesc')}
      />

      <div className="tab-row">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.key} className={`tab-item ${tab === t.key ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 7 }} onClick={() => setTab(t.key)}>
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ padding: 26, maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 20, borderRadius: 16 }}>RS</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Ramesh Sundaram</div>
              <div style={{ color: 'var(--stone)', fontSize: 13 }}>Plant Administrator · Chennai Facility</div>
            </div>
          </div>
          <div className="form-grid">
            <div className="field"><label>Full Name</label><input defaultValue="Ramesh Sundaram" /></div>
            <div className="field"><label>Email Address</label><input defaultValue="ramesh.s@granitex.com" /></div>
            <div className="field"><label>Phone Number</label><input defaultValue="+91 98400 12345" /></div>
            <div className="field"><label>Designation</label><input defaultValue="Plant Administrator" /></div>
            <div className="field"><label>Department</label>
              <select defaultValue="Operations"><option>Operations</option><option>Production</option><option>Sales</option><option>Finance</option></select>
            </div>
            <div className="field"><label>Employee Code</label><input defaultValue="EMP-2001" disabled /></div>
          </div>
          <div className="form-actions"><button className="btn btn-primary"><Save size={16} /> Save Changes</button></div>
        </div>
      )}

      {tab === 'theme' && (
        <div className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Appearance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 22 }}>
            {themeSwatches.map((s, i) => (
              <div key={s.name} className="card" style={{ padding: 14, border: i === 0 ? '2px solid var(--orange)' : undefined }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  {s.colors.map(c => <div key={c} style={{ width: 26, height: 26, borderRadius: 7, background: c }} />)}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.name}</div>
              </div>
            ))}
          </div>
          <div className="form-grid">
            <div className="field"><label>Sidebar Density</label><select defaultValue="Comfortable"><option>Comfortable</option><option>Compact</option></select></div>
            <div className="field"><label>Font Scale</label><select defaultValue="Medium"><option>Small</option><option>Medium</option><option>Large</option></select></div>
          </div>
          <div className="form-actions"><button className="btn btn-primary"><Save size={16} /> Apply Theme</button></div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Notification Preferences</h3>
          {[
            { label: 'New sales order alerts', checked: true },
            { label: 'Low stock & reorder alerts', checked: true },
            { label: 'Production batch completion', checked: true },
            { label: 'Payment received confirmations', checked: false },
            { label: 'Weekly performance summary email', checked: true },
          ].map(n => (
            <label key={n.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--cream-line)', fontSize: 14 }}>
              {n.label}
              <input type="checkbox" defaultChecked={n.checked} style={{ width: 18, height: 18, accentColor: 'var(--orange)' }} />
            </label>
          ))}
          <div className="form-actions"><button className="btn btn-primary"><Save size={16} /> Save Preferences</button></div>
        </div>
      )}

      {tab === 'security' && (
        <div className="card" style={{ padding: 26, maxWidth: 720 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Security</h3>
          <div className="form-grid">
            <div className="field"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
            <div className="field"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
            <div className="field"><label>Confirm New Password</label><input type="password" placeholder="••••••••" /></div>
            <div className="field"><label>Two-Factor Authentication</label><select defaultValue="Enabled"><option>Enabled</option><option>Disabled</option></select></div>
          </div>
          <div className="form-actions"><button className="btn btn-primary"><Save size={16} /> Update Security</button></div>
        </div>
      )}
    </>
  )
}
