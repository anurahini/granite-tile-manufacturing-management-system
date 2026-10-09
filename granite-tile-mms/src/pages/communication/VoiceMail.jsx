import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import {
  Search, Mic, Play, Pause, Volume2, VolumeX, Download, FileText,
  CheckCircle2, MessageCircle, Save, Plus, X, Radio
} from 'lucide-react'
import { api } from '../../api/index.js'
import { useNavigate } from 'react-router-dom'

const initialVoiceMails = [
  {
    id: 1,
    customerName: 'Sri Lakshmi Builders',
    customerPhone: '+91 93765 43210',
    verified: true,
    initials: 'SB',
    color: '#9c7a46',
    subject: 'Site measurement confirmation',
    timestamp: 'Today, 10:32 AM',
    duration: '00:28',
    seconds: 28,
    transcription: 'Hi, this is from Sri Lakshmi Builders. We need 600x600 vitrified tiles for our new site. Please confirm the availability and rate. We are planning to place the order next week.',
    notes: 'Followed up with site supervisor. Rate sheet sent via WhatsApp.'
  },
  {
    id: 2,
    customerName: 'Chola Constructions',
    customerPhone: '+91 91234 56789',
    verified: true,
    initials: 'CC',
    color: '#3e7a73',
    subject: 'New order enquiry',
    timestamp: 'Today, 09:45 AM',
    duration: '00:42',
    seconds: 42,
    transcription: 'Hello team, we require 400 Sq.Ft of Absolute Black Granite Slabs for our upcoming hotel project in Chennai. Please share the discounted price and delivery schedule.',
    notes: ''
  },
  {
    id: 3,
    customerName: 'Marble Palace Interiors',
    customerPhone: '+91 99887 76655',
    verified: true,
    initials: 'MP',
    color: '#6e5530',
    subject: 'Delivery date inquiry',
    timestamp: 'Yesterday, 05:20 PM',
    duration: '00:35',
    seconds: 35,
    transcription: 'Hi, checking on the dispatch of our Statuario Marble order SO-2026-003. When can we expect the truck to reach our site in Coimbatore?',
    notes: 'Informed truck driver details to site engineer.'
  },
  {
    id: 4,
    customerName: 'Rajasthan Marble Works',
    customerPhone: '+91 87654 32109',
    verified: true,
    initials: 'RM',
    color: '#e28743',
    subject: 'Stock availability',
    timestamp: 'Yesterday, 02:18 PM',
    duration: '00:21',
    seconds: 21,
    transcription: 'Good afternoon, please let us know if Wooden Series Ceramic Floor Tiles 600x600 are currently in stock at Main Yard B.',
    notes: ''
  },
  {
    id: 5,
    customerName: 'Granite Craft Mining Co.',
    customerPhone: '+91 90011 22334',
    verified: true,
    initials: 'GC',
    color: '#2b7a68',
    subject: 'Rate confirmation',
    timestamp: '06 Oct 2026, 11:10 AM',
    duration: '00:50',
    seconds: 50,
    transcription: 'Hello, calling regarding the raw granite block rate quotation for the October shipment. We would like to finalize the purchase order tomorrow.',
    notes: 'PO approved by finance manager.'
  },
  {
    id: 6,
    customerName: 'Ajay Constructions',
    customerPhone: '+91 93456 78901',
    verified: true,
    initials: 'AJ',
    color: '#b86d3b',
    subject: 'Bulk order discussion',
    timestamp: '05 Oct 2026, 04:32 PM',
    duration: '00:38',
    seconds: 38,
    transcription: 'Hi, we have a bulk order requirement of 2,500 Sq.Ft floor tiles for a residential complex. Please call back to discuss payment terms.',
    notes: ''
  }
]

export default function VoiceMail() {
  const navigate = useNavigate()
  const [mails, setMails] = useState(initialVoiceMails)
  const [activeMailId, setActiveMailId] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Record Voice Message Modal State
  const [recordModalOpen, setRecordModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [recCustomerName, setRecCustomerName] = useState('')
  const [recSubject, setRecSubject] = useState('')

  const activeMail = mails.find(m => m.id === activeMailId) || mails[0]

  useEffect(() => {
    if (activeMail) {
      setNoteText(activeMail.notes || '')
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [activeMailId])

  // Timer simulation for playback
  useEffect(() => {
    let timer = null
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= (activeMail.seconds || 28)) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000 / playbackSpeed)
    } else {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [isPlaying, playbackSpeed, activeMail?.seconds])

  // Timer simulation for recording
  useEffect(() => {
    let recTimer = null
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordSeconds(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(recTimer)
    }
    return () => clearInterval(recTimer)
  }, [isRecording])

  const togglePlayPause = () => {
    if (!isPlaying && window.speechSynthesis && activeMail.transcription) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(activeMail.transcription)
        utterance.rate = playbackSpeed
        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn('Speech synthesis playback:', err)
      }
    } else if (isPlaying && window.speechSynthesis) {
      window.speechSynthesis.pause()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSaveNote = async () => {
    setMails(prev => prev.map(m => m.id === activeMailId ? { ...m, notes: noteText } : m))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)

    try {
      await api.put(`/communication/voicemail/${activeMailId}/note`, { notes: noteText })
    } catch (err) {
      console.warn('Save note warning:', err)
    }
  }

  const handleStartRecord = () => {
    setIsRecording(true)
    setRecordSeconds(0)
  }

  const handleStopRecordAndSave = () => {
    setIsRecording(false)
    const mins = Math.floor(recordSeconds / 60).toString().padStart(2, '0')
    const secs = (recordSeconds % 60).toString().padStart(2, '0')
    const durStr = `${mins}:${secs}`

    const newVoiceMail = {
      id: Date.now(),
      customerName: recCustomerName.trim() || 'Factory Staff Member',
      customerPhone: '+91 98400 12345',
      verified: true,
      initials: (recCustomerName.trim() || 'FS').substring(0, 2).toUpperCase(),
      color: '#9c7a46',
      subject: recSubject.trim() || 'New Voice Recording',
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      duration: durStr,
      seconds: recordSeconds || 25,
      transcription: `Recorded Voice Message: "${recSubject.trim() || 'Factory note recording'}"`,
      notes: 'Recorded live in system.'
    }

    setMails([newVoiceMail, ...mails])
    setActiveMailId(newVoiceMail.id)
    setRecordModalOpen(false)
    setRecCustomerName('')
    setRecSubject('')
    setRecordSeconds(0)
  }

  const filteredMails = mails.filter(m =>
    m.customerName.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.transcription.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <>
      <PageHeader
        trail={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Communication' },
          { label: 'Voice Mail' }
        ]}
        title="Voice Mail"
        description="Record and manage voice messages from customers and team members."
        actions={[
          <button key="rec" className="btn btn-primary btn-sm" onClick={() => setRecordModalOpen(true)}>
            <Mic size={15} /> Record Voice Message
          </button>
        ]}
      />

      <div className="card" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: 'calc(100vh - 210px)', minHeight: 580, padding: 0, overflow: 'hidden', background: '#fff', borderRadius: 12, border: '1px solid var(--cream-line)' }}>
        
        {/* Left Voice Messages List Panel */}
        <div style={{ borderRight: '1px solid var(--cream-line)', display: 'flex', flexDirection: 'column', background: '#faf8f5' }}>
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--cream-line)', background: '#fff' }}>
            <h3 style={{ fontSize: 16, margin: '0 0 12px', fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>Voice Messages</h3>

            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
              <input
                type="text"
                placeholder="Search by customer or note..."
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
              <option value="All">All Voice Mails</option>
              <option value="Unread">Unread Mails</option>
              <option value="Site Queries">Site Queries</option>
              <option value="Enquiries">Enquiries</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredMails.map(m => {
              const isActive = m.id === activeMailId
              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMailId(m.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                    borderBottom: '1px solid #f2e9dc', cursor: 'pointer',
                    background: isActive ? '#f3eada' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: m.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0
                  }}>
                    {m.initials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {m.customerName}
                        </span>
                        {m.verified && <CheckCircle2 size={13} fill="#25D366" color="#fff" style={{ flexShrink: 0 }} />}
                      </div>
                    </div>

                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.subject}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--stone)' }}>{m.timestamp}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--orange-deep)', display: 'inline-flex', alignItems: 'center', gap: 3, background: '#fdf5eb', padding: '2px 6px', borderRadius: 4, border: '1px solid #f3d4b8' }}>
                        <Mic size={11} /> {m.duration}
                      </span>
                    </div>

                    {m.notes && (
                      <div style={{ fontSize: 11, color: '#6e5530', background: '#f7eee0', padding: '3px 8px', borderRadius: 4, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #ebdbc2' }}>
                        <FileText size={11} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Voice Message Details & Player Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#faf8f5', padding: '24px 24px 90px 24px', overflowY: 'auto' }}>
          
          {/* Header Customer Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '16px 20px', borderRadius: 10, border: '1px solid var(--cream-line)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: activeMail.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {activeMail.initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                    {activeMail.customerName}
                  </h3>
                  {activeMail.verified && <CheckCircle2 size={15} fill="#25D366" color="#fff" />}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--stone-dark)', fontWeight: 500, marginTop: 2 }}>
                  {activeMail.customerPhone}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--stone)' }}>{activeMail.timestamp}</span>
              <button
                className="btn btn-sm"
                onClick={() => navigate('/whatsapp')}
                style={{ background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}
              >
                <MessageCircle size={15} fill="#fff" color="#25D366" /> Open in WhatsApp
              </button>
            </div>
          </div>

          {/* Interactive Audio Player Card */}
          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 10, border: '1px solid var(--cream-line)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlayPause}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--orange)',
                  color: '#fff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(226,103,42,0.3)',
                  transition: 'transform 0.15s'
                }}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 3 }} />}
              </button>

              {/* Time Counter */}
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--stone-dark)', minWidth: 70 }}>
                {formatTime(currentTime)} / {activeMail.duration}
              </span>

              {/* Animated Waveform Visualizer */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, height: 36, padding: '0 8px' }}>
                {[30, 45, 60, 80, 50, 35, 75, 90, 65, 40, 55, 85, 95, 70, 45, 60, 80, 50, 65, 40, 75, 90, 60, 45, 30].map((h, i) => {
                  const isActive = (currentTime / (activeMail.seconds || 28)) * 25 >= i
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: isPlaying ? `${Math.min(100, h * (0.8 + Math.random() * 0.4))}%` : `${h}%`,
                        background: isActive ? 'var(--orange)' : 'var(--cream-deep)',
                        borderRadius: 3,
                        transition: 'height 0.2s, background 0.2s'
                      }}
                    />
                  )
                })}
              </div>

              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--stone-dark)' }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              {/* Playback Speed Multiplier */}
              <button
                onClick={() => setPlaybackSpeed(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                style={{
                  padding: '4px 8px', borderRadius: 4, border: '1px solid var(--cream-line)',
                  background: 'var(--cream)', fontSize: 12, fontWeight: 700, color: 'var(--charcoal)', cursor: 'pointer'
                }}
              >
                {playbackSpeed}x
              </button>

              {/* Download Audio */}
              <button
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--stone-dark)' }}
                title="Download Voice Recording"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* Transcription (Auto) Card */}
          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 10, border: '1px solid var(--cream-line)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <FileText size={17} color="var(--orange-deep)" />
              <h4 style={{ margin: 0, fontSize: 14.5, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                Transcription (Auto)
              </h4>
            </div>

            <div style={{ padding: 14, background: '#faf8f5', borderRadius: 8, border: '1px solid #efe6d8', fontSize: 13.5, color: 'var(--charcoal)', lineHeight: 1.55 }}>
              &ldquo;{activeMail.transcription}&rdquo;
            </div>
          </div>

          {/* Add Note Card */}
          <div style={{ background: '#fff', padding: '20px 24px', borderRadius: 10, border: '1px solid var(--cream-line)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={17} color="var(--orange-deep)" />
                <h4 style={{ margin: 0, fontSize: 14.5, fontFamily: 'var(--font-display)', color: 'var(--charcoal)' }}>
                  Add Note
                </h4>
              </div>
              {saveSuccess && (
                <span style={{ fontSize: 12.5, color: '#27ae60', fontWeight: 700, background: '#eafaf1', padding: '4px 10px', borderRadius: 6, border: '1px solid #a3e4d7' }}>
                  ✓ Note saved to database!
                </span>
              )}
            </div>

            <textarea
              rows={3}
              placeholder="Add notes about this voice message..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid var(--cream-line)',
                padding: '12px 14px',
                fontSize: 13.5,
                fontFamily: 'inherit',
                outline: 'none',
                marginBottom: 14,
                background: '#faf8f5'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              {noteText && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setNoteText('')}
                >
                  Clear Note
                </button>
              )}
              <button onClick={handleSaveNote} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px' }}>
                <Save size={15} /> Save Note
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Record Voice Message Modal */}
      {recordModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 440, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mic size={20} color="var(--orange)" />
                <h3 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--font-display)' }}>Record Voice Message</h3>
              </div>
              <button type="button" onClick={() => { setRecordModalOpen(false); setIsRecording(false); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-dark)', display: 'block', marginBottom: 6 }}>Customer / Staff Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Sundaram"
                value={recCustomerName}
                onChange={e => setRecCustomerName(e.target.value)}
                style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid var(--cream-line)', padding: '0 12px', fontSize: 13 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--stone-dark)', display: 'block', marginBottom: 6 }}>Subject / Topic</label>
              <input
                type="text"
                placeholder="e.g. Factory quality inspection note"
                value={recSubject}
                onChange={e => setRecSubject(e.target.value)}
                style={{ width: '100%', height: 38, borderRadius: 6, border: '1px solid var(--cream-line)', padding: '0 12px', fontSize: 13 }}
              />
            </div>

            {/* Microphone Recording Visualizer Box */}
            <div style={{ padding: '20px', background: '#faf8f5', borderRadius: 10, border: '1px solid #efe6d8', textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: isRecording ? '#e74c3c' : 'var(--orange)', color: '#fff', marginBottom: 12, boxShadow: isRecording ? '0 0 0 8px rgba(231,76,60,0.2)' : 'none', transition: 'all 0.3s' }}>
                <Mic size={28} />
              </div>

              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>
                {isRecording ? `Recording... ${formatTime(recordSeconds)}` : 'Ready to record'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--stone)' }}>
                {isRecording ? 'Speak clearly into your microphone' : 'Click start to record audio voice message'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              {!isRecording ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={handleStartRecord}>
                  <Radio size={15} /> Start Recording
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" style={{ background: '#27ae60', borderColor: '#27ae60' }} onClick={handleStopRecordAndSave}>
                  <Save size={15} /> Stop & Save Voice Mail
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
