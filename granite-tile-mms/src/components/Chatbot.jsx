import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare, X, Send, Sparkles, IndianRupee, Star, ArrowRight, TrendingUp,
  Package, Boxes, Factory, Truck, Users, RefreshCw, FileText, Wrench, Mic, MicOff
} from 'lucide-react'
import { products as fallbackProducts, photoLayerBackground } from '../data/products.js'
import { parseIntent, generateSmartAnswer } from '../utils/nluEngine.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { api } from '../api/index.js'
import './Chatbot.css'

const quickReplies = [
  '⚡ Show Low Stock',
  '💰 Monthly Profit',
  '🏭 Production Batches',
  '🏬 Granite & Tile Catalog',
  '🚚 Recent Orders',
  '🤝 Supplier Info',
]

const roomToCategory = {
  Bathroom: 'bathroom-tiles',
  Kitchen: 'kitchen-tiles',
  Outdoor: 'outdoor-tiles',
  'Living Room': 'floor-tiles',
  Parking: 'parking-tiles',
}

function recommendForCategory(category, productList) {
  const list = productList && productList.length ? productList : fallbackProducts
  const options = list.filter((p) => p.category === category || (p.category && p.category.toLowerCase().includes(category)))
  if (options.length === 0) return null
  return [...options].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))[0]
}

function ProductSuggestionCard({ product }) {
  const category = product.category || 'floor-tiles'
  const swatch = product.swatch || 'granite-mottled'
  const price = product.price || product.unitPrice || 85
  const unit = product.unit || 'sq.ft'
  const rating = typeof product.rating === 'number' ? product.rating : 4.8

  return (
    <div className="chatbot-product-card">
      <div className="chatbot-product-swatch" style={{ background: photoLayerBackground(category, swatch) }} />
      <div className="chatbot-product-info">
        <div className="chatbot-product-name">{product.name || product.productName}</div>
        <div className="chatbot-product-meta">
          <span><IndianRupee size={11} />{price}/{unit}</span>
          <span className="chatbot-product-rating"><Star size={11} fill="currentColor" /> {rating.toFixed(1)}</span>
        </div>
        <Link to={`/product-catalog`} className="chatbot-product-link">
          View In Catalog <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}

function KpiSummaryCard({ title, items, tone = 'orange' }) {
  return (
    <div className={`chatbot-kpi-card tone-${tone}`}>
      <div className="chatbot-kpi-title">{title}</div>
      <div className="chatbot-kpi-body">
        {items.map((item, idx) => (
          <div key={idx} className="chatbot-kpi-row">
            <span className="kpi-label">{item.label}</span>
            <span className="kpi-val">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionChipsCard({ chips }) {
  return (
    <div className="chatbot-action-chips">
      {chips.map((c, idx) => (
        <Link key={idx} to={c.path} className="chatbot-chip-btn">
          {c.icon && <c.icon size={13} />}
          <span>{c.label}</span>
        </Link>
      ))}
    </div>
  )
}

export default function Chatbot() {
  const { lang, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      type: 'text',
      text: lang === 'ta'
        ? "வணக்கம்! நான் GraniteX AI உதவியாளன். கிரானைட், டைல்ஸ், விலை, சரக்கு நிலை, உற்பத்திகள், லாபம் மற்றும் ஆர்டர்கள் பற்றி எது வேண்டுமானாலும் கேளுங்கள்!"
        : "Hi! I am GraniteX AI Assistant. Ask me anything about granite slabs, tiles, prices, stock levels, production batches, monthly profit, or customer orders!"
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [awaitingRoom, setAwaitingRoom] = useState(false)
  const [liveProducts, setLiveProducts] = useState(fallbackProducts)
  const [isListening, setIsListening] = useState(false)
  const scrollRef = useRef(null)

  const toggleChatMic = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRec) {
      alert('Speech recognition is not supported on this browser. Try Chrome or Edge.')
      return
    }
    if (isListening) {
      setIsListening(false)
      return
    }
    try {
      const rec = new SpeechRec()
      rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN'
      rec.interimResults = true
      rec.onstart = () => setIsListening(true)
      rec.onresult = (e) => {
        const text = Array.from(e.results).map((r) => r[0].transcript).join('')
        setInput(text)
        if (e.results[0].isFinal) {
          setIsListening(false)
          sendMessage(text)
        }
      }
      rec.onerror = () => setIsListening(false)
      rec.onend = () => setIsListening(false)
      rec.start()
    } catch (err) {
      console.error(err)
      setIsListening(false)
    }
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products')
        if (res && (res.success || Array.isArray(res))) {
          const items = Array.isArray(res) ? res : res.data || res.products || []
          if (items.length > 0) setLiveProducts(items)
        }
      } catch {
        /* fallback */
      }
    }
    loadProducts()
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open, isTyping])

  const pushBot = (msg) => setMessages((m) => [...m, { from: 'bot', ...msg }])

  const handleRoomChoice = (room) => {
    setMessages((m) => [...m, { from: 'user', type: 'text', text: room }])
    setAwaitingRoom(false)
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const category = roomToCategory[room]
      const product = recommendForCategory(category, liveProducts)
      if (product) {
        pushBot({ type: 'text', text: `Here is our top rated option for ${room.toLowerCase()}:` })
        setTimeout(() => pushBot({ type: 'product', product }), 200)
      } else {
        pushBot({ type: 'text', text: "Check out our complete Product Catalog for available tiles and granite slabs." })
        pushBot({
          type: 'action_chips',
          chips: [{ label: 'Explore Product Catalog', path: '/product-catalog', icon: Package }]
        })
      }
    }, 400)
  }

  const generateDynamicReply = async (userText) => {
    setIsTyping(true)

    // Add artificial tiny delay for natural AI feel
    await new Promise((r) => setTimeout(r, 350))

    try {
      const result = await generateSmartAnswer(userText, lang, api, liveProducts)
      setIsTyping(false)

      if (result.text) {
        pushBot({ type: 'text', text: result.text })
      }
      if (result.kpiCard) {
        pushBot({
          type: 'kpi_card',
          title: result.kpiCard.title,
          items: result.kpiCard.items,
          tone: result.kpiCard.tone
        })
      }
      if (result.product) {
        pushBot({ type: 'product', product: result.product })
      }
      if (result.actionChips && result.actionChips.length > 0) {
        pushBot({ type: 'action_chips', chips: result.actionChips })
      }
    } catch (err) {
      console.error("Chatbot query processing error:", err)
      setIsTyping(false)
      pushBot({
        type: 'text',
        text: lang === 'ta'
          ? "மன்னிக்கவும், தகவலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்!"
          : "Sorry, could not process your query right now. Please try again!"
      })
    }
  }

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { from: 'user', type: 'text', text: trimmed }])
    setInput('')
    generateDynamicReply(trimmed)
  }

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <Sparkles size={16} className="glow-icon" />
              <div>
                <span className="title-main">GraniteX AI</span>
                <span className="title-sub">Smart Factory &amp; Catalog Bot</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                className="chatbot-icon-btn"
                onClick={() => setMessages([{ from: 'bot', type: 'text', text: 'Chat reset! How can I help you today?' }])}
                title="Reset Chat"
              >
                <RefreshCw size={14} />
              </button>
              <button className="chatbot-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="chatbot-body" ref={scrollRef}>
            {messages.map((m, i) => {
              if (m.type === 'product') return <ProductSuggestionCard key={i} product={m.product} />
              if (m.type === 'kpi_card') return <KpiSummaryCard key={i} title={m.title} items={m.items} tone={m.tone} />
              if (m.type === 'action_chips') return <ActionChipsCard key={i} chips={m.chips} />
              return <div key={i} className={`chatbot-msg ${m.from}`}>{m.text}</div>
            })}
            {isTyping && (
              <div className="chatbot-msg bot typing-indicator">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="typing-text">Querying ERP Database...</span>
              </div>
            )}
          </div>

          <div className="chatbot-quick-replies">
            {awaitingRoom
              ? Object.keys(roomToCategory).map((room) => (
                  <button key={room} onClick={() => handleRoomChoice(room)}>{room}</button>
                ))
              : quickReplies.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}>{q}</button>
                ))}
          </div>

          <form
            className="chatbot-input-row"
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
          >
            <input
              type="text"
              placeholder={isListening ? "Listening... Speak now..." : "Ask anything (prices, stock, profit, sales)..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="button"
              className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleChatMic}
              title={isListening ? "Listening... click to stop" : "Speak (Voice to text)"}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button type="submit" aria-label="Send message" disabled={!input.trim()}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(!open)} aria-label="Toggle AI assistant">
        {open ? <X size={22} /> : <MessageSquare size={22} />}
        <span className="fab-glow-ring" />
      </button>
    </div>
  )
}
