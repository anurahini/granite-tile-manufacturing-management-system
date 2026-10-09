import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import {
  Search, Plus, Phone, MoreVertical, Paperclip, Send, Smile,
  CheckCircle2, FileText, Download, CheckCheck, MessageCircle, X,
  ExternalLink, Smartphone, Share2
} from 'lucide-react'
import { api } from '../../api/index.js'
import { useAuth } from '../../context/AuthContext.jsx'

const initialContacts = [
  {
    id: 1,
    name: 'Sri Lakshmi Builders',
    phone: '+91 98765 43210',
    verified: true,
    initials: 'SB',
    color: '#9c7a46',
    time: '10:24 AM',
    lastMessage: 'Thank you. We will confirm the order.',
    messages: [
      {
        id: 101,
        sender: 'customer',
        text: 'Hi, I need a quotation for 600x600 floor tiles.',
        time: '10:15 AM'
      },
      {
        id: 102,
        sender: 'agent',
        text: 'Hello,\nPlease find the quotation for 600x600 floor tiles.',
        attachment: {
          name: 'Tile_Quotation_SL.pdf',
          size: '245 KB',
          type: 'pdf'
        },
        time: '10:18 AM',
        status: 'read'
      },
      {
        id: 103,
        sender: 'customer',
        text: 'Thank you. We will confirm the order. Thanks',
        time: '10:24 AM'
      }
    ]
  },
  {
    id: 2,
    name: 'Chola Constructions',
    phone: '+91 91234 56789',
    verified: true,
    initials: 'CC',
    color: '#3e7a73',
    time: '09:15 AM',
    lastMessage: 'Please share the quotation.',
    messages: [
      { id: 201, sender: 'customer', text: 'Hi, need catalog for vitrified wall tiles.', time: '09:10 AM' },
      { id: 202, sender: 'customer', text: 'Please share the quotation.', time: '09:15 AM' }
    ]
  },
  {
    id: 3,
    name: 'Marble Palace Interiors',
    phone: '+91 99887 76655',
    verified: true,
    initials: 'MP',
    color: '#6e5530',
    time: 'Yesterday',
    lastMessage: 'Order delivered. Thanks!',
    messages: [
      { id: 301, sender: 'agent', text: 'Your delivery for Statuario Marble Slabs is en route.', time: 'Yesterday 04:30 PM', status: 'read' },
      { id: 302, sender: 'customer', text: 'Order delivered. Thanks!', time: 'Yesterday 05:20 PM' }
    ]
  },
  {
    id: 4,
    name: 'Rajasthan Marble Works',
    phone: '+91 87654 32109',
    verified: true,
    initials: 'RM',
    color: '#e28743',
    time: 'Yesterday',
    lastMessage: 'When will the stock be available?',
    messages: [
      { id: 401, sender: 'customer', text: 'When will the stock be available?', time: 'Yesterday 02:15 PM' }
    ]
  },
  {
    id: 5,
    name: 'Granite Craft Mining Co.',
    phone: '+91 90011 22334',
    verified: true,
    initials: 'GC',
    color: '#2b7a68',
    time: '06 Oct',
    lastMessage: 'Please send the rate list.',
    messages: [
      { id: 501, sender: 'customer', text: 'Please send the rate list.', time: '06 Oct 11:00 AM' }
    ]
  },
  {
    id: 6,
    name: 'Ajay Constructions',
    phone: '+91 93456 78901',
    verified: true,
    initials: 'AJ',
    color: '#b86d3b',
    time: '05 Oct',
    lastMessage: 'Need 600x600 floor tiles.',
    messages: [
      { id: 601, sender: 'customer', text: 'Need 600x600 floor tiles.', time: '05 Oct 04:30 PM' }
    ]
  }
]

export default function WhatsApp() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState(initialContacts)
  const [activeContactId, setActiveContactId] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All Customers')
  const [inputMessage, setInputMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  // Real WhatsApp Auto-Dispatch Toggle
  const [autoLaunchWa, setAutoLaunchWa] = useState(true)

  // Modals state
  const [newMsgModalOpen, setNewMsgModalOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')

  const [myNumberModalOpen, setMyNumberModalOpen] = useState(false)
  const [myPhoneInput, setMyPhoneInput] = useState(() => user?.mobile || '+91 ')

  const chatEndRef = useRef(null)

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeContact?.messages])

  // Helper to trigger real WhatsApp message launch on phone/browser via wa.me link
  const launchRealWhatsApp = (phone, text) => {
    const rawDigits = String(phone || '').replace(/[^\d]/g, '')
    // Default to country code 91 if 10 digits
    const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits
    if (!cleanPhone) {
      alert('Please enter a valid mobile number first.')
      return
    }
    const messageBody = text || 'Hello from Granite & Tile Manufacturing MMS!'
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageBody)}`
    window.open(waUrl, '_blank')
  }

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!inputMessage.trim() && !selectedFile) return

    const messageText = inputMessage.trim()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const newMessage = {
      id: Date.now(),
      sender: 'agent',
      text: messageText,
      attachment: selectedFile ? {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        type: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'file'
      } : null,
      time: now,
      status: 'read'
    }

    setContacts(prev => prev.map(c => {
      if (c.id === activeContactId) {
        return {
          ...c,
          time: now,
          lastMessage: messageText || (selectedFile ? `Attachment: ${selectedFile.name}` : ''),
          messages: [...c.messages, newMessage]
        }
      }
      return c
    }))

    setInputMessage('')
    setSelectedFile(null)

    // Send payload to backend database
    try {
      await api.post('/communication/whatsapp/send-real', {
        contactName: activeContact.name,
        contactPhone: activeContact.phone,
        messageText: messageText
      })
    } catch (err) {
      console.warn('Backend WhatsApp message save warning:', err)
    }

    // Auto-launch real WhatsApp App / Web if enabled
    if (autoLaunchWa) {
      launchRealWhatsApp(activeContact.phone, messageText)
    }
  }

  const handleAddMyNumber = (e) => {
    e.preventDefault()
    if (!myPhoneInput.trim() || myPhoneInput.trim().length < 8) {
      alert('Please enter a valid 10-digit mobile number.')
      return
    }

    const myContact = {
      id: 9999,
      name: `${user?.fullName || 'My Number'} (Me)`,
      phone: myPhoneInput.trim(),
      verified: true,
      initials: 'ME',
      color: '#25D366',
      time: 'Just now',
      isMe: true,
      lastMessage: 'My Personal WhatsApp connected.',
      messages: [
        {
          id: Date.now(),
          sender: 'agent',
          text: `👋 Hello! This is your personal WhatsApp connection for Granite & Tile MMS (${myPhoneInput.trim()}). Any message sent here launches directly to your phone via WhatsApp!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    }

    setContacts([myContact, ...contacts.filter(c => c.id !== 9999)])
    setActiveContactId(myContact.id)
    setMyNumberModalOpen(false)
  }

  const handleCreateNewContact = (e) => {
    e.preventDefault()
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return

    const newContact = {
      id: Date.now(),
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim(),
      verified: true,
      initials: newCustomerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      color: '#9c7a46',
      time: 'Just now',
      lastMessage: 'Conversation started.',
      messages: [
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: `Hello ${newCustomerName.trim()}, welcome to Granite & Tile Manufacturing MMS. How can we assist you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    }

    setContacts([newContact, ...contacts])
    setActiveContactId(newContact.id)
    setNewCustomerName('')
    setNewCustomerPhone('')
    setNewMsgModalOpen(false)
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  const downloadSamplePdf = (filename) => {
    const dummyContent = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    const blob = new Blob([dummyContent], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'Quotation.pdf'
    link.click()
  }

  return (
    <>
      <PageHeader
        trail={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Communication' },
          { label: 'WhatsApp' }
        ]}
        title="WhatsApp Communication"
        description="Send order updates, quotations and notifications to customers or your phone directly via WhatsApp."
        actions={[
          <button
            key="my-num"
            className="btn btn-outline btn-sm"
            onClick={() => setMyNumberModalOpen(true)}
            style={{ borderColor: '#25D366', color: '#25D366', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Smartphone size={16} color="#25D366" /> + Add My Number
          </button>,
          <button key="new" className="btn btn-primary btn-sm" onClick={() => setNewMsgModalOpen(true)}>
            <Plus size={15} /> New Message
          </button>
        ]}
      />

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '330px 1fr', height: 'calc(100vh - 210px)', minHeight: 580, padding: 0, overflow: 'hidden', background: '#fff', borderRadius: 12, border: '1px solid var(--cream-line)' }}>
        
        {/* Left Contacts Panel */}
        <div style={{ borderRight: '1px solid var(--cream-line)', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--cream-line)', background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 16, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>Contacts</h3>
              <button
                onClick={() => setMyNumberModalOpen(true)}
                style={{ fontSize: 11, fontWeight: 700, color: '#25D366', background: '#e2f4ea', border: '1px solid #b8e6ce', padding: '3px 8px', borderRadius: 12, cursor: 'pointer' }}
              >
                + My WhatsApp
              </button>
            </div>
            
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
              <input
                type="text"
                placeholder="Search customer or mobile..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', height: 36, paddingLeft: 32, paddingRight: 10, fontSize: 12.5, borderRadius: 6, border: '1px solid var(--cream-line)', background: '#fff' }}
              />
            </div>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{ width: '100%', height: 32, fontSize: 12, borderRadius: 6, border: '1px solid var(--cream-line)', background: '#fff', padding: '0 8px', color: 'var(--stone-dark)' }}
            >
              <option value="All Customers">All Customers</option>
              <option value="Active Leads">Active Leads</option>
              <option value="Frequent Buyers">Frequent Buyers</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map(c => {
              const isActive = c.id === activeContactId
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
                    borderBottom: '1px solid #f2e9dc', cursor: 'pointer',
                    background: isActive ? '#f3eada' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: c.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0
                  }}>
                    {c.initials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {c.name}
                        </span>
                        {c.verified && <CheckCircle2 size={13} fill="#25D366" color="#fff" style={{ flexShrink: 0 }} />}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--stone)', flexShrink: 0 }}>{c.time}</span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#25D366', fontWeight: 600, marginBottom: 2 }}>{c.phone}</div>

                    <div style={{ fontSize: 12, color: 'var(--stone-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.lastMessage}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Active Chat Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#f5f0e8' }}>
          
          {/* Chat Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#fff', borderBottom: '1px solid var(--cream-line)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <MessageCircle size={20} fill="#fff" color="#25D366" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                    {activeContact.name}
                  </h4>
                  {activeContact.verified && <CheckCircle2 size={14} fill="#25D366" color="#fff" />}
                  {activeContact.isMe && (
                    <span style={{ fontSize: 10, background: '#25D366', color: '#fff', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>
                      My Phone
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--stone-dark)', fontWeight: 500 }}>
                  {activeContact.phone}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Direct Real WhatsApp wa.me launcher button */}
              <button
                type="button"
                onClick={() => launchRealWhatsApp(activeContact.phone, activeContact.lastMessage || 'Hello from Granite & Tile MMS!')}
                style={{
                  background: '#25D366', color: '#fff', border: 'none', borderRadius: 6,
                  padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 5px rgba(37,211,102,0.3)'
                }}
                title="Launch Real WhatsApp App / Web (wa.me)"
              >
                <ExternalLink size={14} /> Open Real WhatsApp
              </button>

              <button className="btn btn-ghost btn-sm" title="Call Number" style={{ padding: 6 }}>
                <Phone size={17} color="var(--stone-dark)" />
              </button>
              <button className="btn btn-ghost btn-sm" title="More Options" style={{ padding: 6 }}>
                <MoreVertical size={17} color="var(--stone-dark)" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeContact.messages.map(msg => {
              const isAgent = msg.sender === 'agent'
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isAgent ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '65%',
                      padding: '12px 16px',
                      borderRadius: isAgent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isAgent ? '#e2f4ea' : '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      border: isAgent ? '1px solid #c3ebda' : '1px solid #e8e2d5',
                      color: 'var(--charcoal)',
                      fontSize: 13.5,
                      lineHeight: 1.45,
                      whiteSpace: 'pre-line'
                    }}
                  >
                    <div>{msg.text}</div>

                    {msg.attachment && (
                      <div
                        onClick={() => downloadSamplePdf(msg.attachment.name)}
                        style={{
                          marginTop: 10,
                          padding: '10px 12px',
                          background: '#fff',
                          borderRadius: 8,
                          border: '1px solid #d2e4d9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <FileText size={18} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.attachment.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--stone)' }}>{msg.attachment.size}</div>
                        </div>
                        <Download size={16} color="var(--stone-dark)" />
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 4, fontSize: 10.5, color: 'var(--stone)' }}>
                      <span>{msg.time}</span>
                      {isAgent && <CheckCheck size={14} color="#3498db" />}
                      <button
                        type="button"
                        onClick={() => launchRealWhatsApp(activeContact.phone, msg.text)}
                        style={{ background: 'transparent', border: 'none', color: '#25D366', cursor: 'pointer', padding: 0 }}
                        title="Send this exact message to Real WhatsApp"
                      >
                        <Share2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Selected File Preview Badge */}
          {selectedFile && (
            <div style={{ padding: '6px 20px', background: '#fff', borderTop: '1px solid var(--cream-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--orange-deep)', fontWeight: 600 }}>
                <Paperclip size={14} /> Attached: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
              </div>
              <button type="button" onClick={() => setSelectedFile(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--stone)' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Chat Input Bar & Real WhatsApp Options */}
          <div style={{ background: '#fff', borderTop: '1px solid var(--cream-line)', padding: '8px 18px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--stone-dark)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600, color: '#25D366' }}>
                <input
                  type="checkbox"
                  checked={autoLaunchWa}
                  onChange={e => setAutoLaunchWa(e.target.checked)}
                />
                Auto-open Real WhatsApp App/Web on Send ({activeContact.phone})
              </label>

              <button
                type="button"
                onClick={() => launchRealWhatsApp(activeContact.phone, inputMessage || 'Hello!')}
                style={{ background: '#e2f4ea', color: '#25D366', border: '1px solid #b8e6ce', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                Send to WhatsApp Now ↗
              </button>
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              
              <label style={{ cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', color: 'var(--stone-dark)' }} title="Attach file or quotation">
                <Paperclip size={18} />
                <input
                  type="file"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0])
                    }
                  }}
                />
              </label>

              <input
                type="text"
                placeholder={`Type a message to send to ${activeContact.phone}...`}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  height: 40,
                  borderRadius: 20,
                  border: '1px solid var(--cream-line)',
                  padding: '0 16px',
                  fontSize: 13.5,
                  background: '#faf8f5',
                  outline: 'none'
                }}
              />

              <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 8, color: 'var(--stone-dark)' }} title="Add emoji">
                <Smile size={18} />
              </button>

              <button
                type="submit"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(37,211,102,0.3)'
                }}
                title="Send Message & Launch WhatsApp"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Add My Personal WhatsApp Number Modal */}
      {myNumberModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 440, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Smartphone size={20} color="#25D366" />
                <h3 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                  Connect My WhatsApp Number
                </h3>
              </div>
              <button type="button" onClick={() => setMyNumberModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--stone-dark)', marginTop: 0, marginBottom: 16 }}>
              Enter your personal mobile phone number below. Any message sent to this number will directly launch to your real WhatsApp on your phone/computer!
            </p>

            <form onSubmit={handleAddMyNumber}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-dark)', display: 'block', marginBottom: 6 }}>Your WhatsApp Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98400 12345"
                  value={myPhoneInput}
                  onChange={e => setMyPhoneInput(e.target.value)}
                  style={{ width: '100%', height: 40, borderRadius: 6, border: '1px solid var(--cream-line)', padding: '0 12px', fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}
                />
                <span style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, display: 'block' }}>
                  Format: +91 XXXXXXXXXX or 10-digit mobile number
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setMyNumberModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm" style={{ background: '#25D366', color: '#fff', border: 'none', fontWeight: 600 }}>
                  Add My Number & Open Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Customer / WhatsApp Message Modal */}
      {newMsgModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 420, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--font-display)' }}>Start New WhatsApp Chat</h3>
              <button type="button" onClick={() => setNewMsgModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <form onSubmit={handleCreateNewContact}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-dark)', display: 'block', marginBottom: 6 }}>Customer / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Marble Tech"
                  value={newCustomerName}
                  onChange={e => setNewCustomerName(e.target.value)}
                  style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid var(--cream-line)', padding: '0 12px', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-dark)', display: 'block', marginBottom: 6 }}>Mobile Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98400 99887"
                  value={newCustomerPhone}
                  onChange={e => setNewCustomerPhone(e.target.value)}
                  style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid var(--cream-line)', padding: '0 12px', fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setNewMsgModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">Start Conversation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
