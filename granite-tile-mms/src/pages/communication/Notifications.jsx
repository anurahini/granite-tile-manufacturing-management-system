import { useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import {
  Bell, MessageCircle, Mic, CheckCircle2, AlertTriangle, Info,
  Trash2, Check, Filter
} from 'lucide-react'

const initialNotifications = [
  {
    id: 1,
    title: 'New WhatsApp Message',
    message: 'Sri Lakshmi Builders sent a reply: "Thank you. We will confirm the order."',
    type: 'WhatsApp',
    time: '10:24 AM Today',
    isRead: false
  },
  {
    id: 2,
    title: 'Voice Mail Received',
    message: 'Chola Constructions recorded a voice mail: "New order enquiry for 400 Sq.Ft Granite".',
    type: 'VoiceMail',
    time: '09:45 AM Today',
    isRead: false
  },
  {
    id: 3,
    title: 'Low Stock Alert',
    message: 'Absolute Black Granite Slab stock dropped below reorder level (25 Sq.Ft remaining).',
    type: 'Stock',
    time: 'Yesterday 04:12 PM',
    isRead: true
  },
  {
    id: 4,
    title: 'Sales Order Approved',
    message: 'Sales order SO-2026-001 for Sri Lakshmi Builders approved by Finance Manager.',
    type: 'Order',
    time: 'Yesterday 02:30 PM',
    isRead: true
  },
  {
    id: 5,
    title: 'System Security Audit',
    message: 'Two-factor authentication and database backup completed successfully.',
    type: 'System',
    time: '06 Oct 2026',
    isRead: true
  }
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState('All')

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'All') return true
    if (activeTab === 'Unread') return !n.isRead
    return n.type === activeTab
  })

  const getIcon = (type) => {
    switch (type) {
      case 'WhatsApp': return <MessageCircle size={18} color="#25D366" />
      case 'VoiceMail': return <Mic size={18} color="var(--orange)" />
      case 'Stock': return <AlertTriangle size={18} color="#c2452d" />
      case 'Order': return <CheckCircle2 size={18} color="#27ae60" />
      default: return <Info size={18} color="#3498db" />
    }
  }

  return (
    <>
      <PageHeader
        trail={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Communication' },
          { label: 'Notifications' }
        ]}
        title="Communication & System Notifications"
        description="Alerts, order updates, stock level notifications, and WhatsApp message logs."
        actions={[
          <button key="mark" className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
            <Check size={15} /> Mark All as Read
          </button>
        ]}
      />

      <div className="card" style={{ padding: 24, background: '#fff', borderRadius: 12 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid var(--cream-line)', paddingBottom: 14 }}>
          {['All', 'Unread', 'WhatsApp', 'VoiceMail', 'Stock', 'Order'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                border: '1px solid', borderColor: activeTab === t ? 'var(--orange)' : 'var(--cream-line)',
                background: activeTab === t ? 'var(--orange)' : '#fff',
                color: activeTab === t ? '#fff' : 'var(--stone-dark)',
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--stone)' }}>
              No notifications found in this view.
            </div>
          ) : (
            filteredNotifs.map(n => (
              <div
                key={n.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: 10,
                  background: n.isRead ? '#faf8f5' : '#fffcf5',
                  border: n.isRead ? '1px solid #efe6d8' : '1px solid #f8e1b6',
                  boxShadow: n.isRead ? 'none' : '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', border: '1px solid var(--cream-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getIcon(n.type)}
                  </div>

                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 2 }}>
                      {n.title} {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block', marginLeft: 6 }} />}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--stone-dark)' }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>

                <button onClick={() => handleDelete(n.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--stone)' }} title="Delete Notification">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
