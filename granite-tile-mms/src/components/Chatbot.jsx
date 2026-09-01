import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, X, Send, Sparkles, IndianRupee, Star, ArrowRight } from 'lucide-react'
import { products, photoLayerBackground } from '../data/products.js'
import './Chatbot.css'

const quickReplies = [
  'Recommend a tile',
  'Show bathroom tiles',
  'Show granite slabs',
  'Tile prices',
  'Supplier details',
]

const roomToCategory = {
  Bathroom: 'bathroom-tiles',
  Kitchen: 'kitchen-tiles',
  Outdoor: 'outdoor-tiles',
  'Living Room': 'floor-tiles',
  Parking: 'parking-tiles',
}

function recommendFor(category) {
  const options = products.filter((p) => p.category === category)
  if (options.length === 0) return null
  return [...options].sort((a, b) => b.rating - a.rating)[0]
}

function getBotReply(text) {
  const q = text.toLowerCase()
  if (q.includes('bathroom')) {
    return 'We stock anti-skid bathroom tiles in Aqua Blue and Mosaic Grey finishes — check Product Catalog → Bathroom Tiles for the full range.'
  }
  if (q.includes('granite')) {
    return 'Our granite slabs include Tan Brown, Black Galaxy, Kashmir White and Steel Grey — priced ₹175–₹320 per sq.ft. See Product Catalog → Granite Slabs.'
  }
  if (q.includes('color') || q.includes('colour')) {
    return 'You can filter by White, Black, Grey, Brown, Cream, Beige or Marble Finish on the Product Catalog page.'
  }
  if (q.includes('supplier')) {
    return 'Supplier details — including GST, contact person, address and delivery performance — are available under Masters → Supplier Master.'
  }
  if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
    return 'Granite slabs range from ₹150–₹420 per sq.ft and tiles from ₹32–₹95 per sq.ft depending on finish. Check the Product Catalog for exact pricing.'
  }
  if (q.includes('track') || q.includes('order') || q.includes('delivery')) {
    return 'You can track dispatches under Transactions → Delivery Management, or check status on the Sales Order page.'
  }
  if (q.includes('size')) {
    return 'Common tile sizes are 1x1, 2x2, 2x4 and 4x4 ft, plus 8x4 ft granite slabs. Use the Size filter on the Product Catalog page.'
  }
  if (q.includes('vendor')) {
    return 'Vendor and logistics partner details, including delivery status and performance rating, are available under Masters → Vendor Master.'
  }
  if (q.includes('clearance') || q.includes('damaged') || q.includes('discount')) {
    return 'Discounted clearance stock from batch overruns and minor transit damage is listed under Catalog → Clearance Sale.'
  }
  if (q.includes('compare')) {
    return 'You can compare 2 to 4 products side by side — price, size, finish, rating and more — under Catalog → Compare Products.'
  }
  if (q.includes('hello') || q.includes('hi')) {
    return 'Hello! I can help with product pricing, tile recommendations, order tracking, or supplier and vendor details.'
  }
  return "I'm a demo assistant for this project — try asking about bathroom tiles, granite slabs, prices, or say \"recommend a tile\" for a personalised pick!"
}

function ProductSuggestionCard({ product }) {
  return (
    <div className="chatbot-product-card">
      <div className="chatbot-product-swatch" style={{ background: photoLayerBackground(product.category, product.swatch) }} />
      <div className="chatbot-product-info">
        <div className="chatbot-product-name">{product.name}</div>
        <div className="chatbot-product-meta">
          <span><IndianRupee size={11} />{product.price}/{product.unit}</span>
          <span className="chatbot-product-rating"><Star size={11} fill="currentColor" /> {product.rating.toFixed(1)}</span>
        </div>
        <Link to={`/product-catalog/${product.id}`} className="chatbot-product-link">
          View Product <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', type: 'text', text: 'Hi! I\'m the GraniteX assistant. Ask me about products, pricing, or your orders.' },
  ])
  const [input, setInput] = useState('')
  const [awaitingRoom, setAwaitingRoom] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const pushBot = (msg) => setMessages((m) => [...m, { from: 'bot', ...msg }])

  const handleRoomChoice = (room) => {
    setMessages((m) => [...m, { from: 'user', type: 'text', text: room }])
    setAwaitingRoom(false)
    const category = roomToCategory[room]
    const product = recommendFor(category)
    setTimeout(() => {
      if (product) {
        pushBot({ type: 'text', text: `Based on ratings, here's our top pick for ${room.toLowerCase()}:` })
        setTimeout(() => pushBot({ type: 'product', product }), 300)
      } else {
        pushBot({ type: 'text', text: "I couldn't find a match for that room — try browsing the full Product Catalog instead." })
      }
    }, 450)
  }

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((m) => [...m, { from: 'user', type: 'text', text: trimmed }])
    setInput('')

    if (/recommend|suggest/i.test(trimmed)) {
      setTimeout(() => {
        pushBot({ type: 'text', text: 'Happy to help! Which room is this for?' })
        setAwaitingRoom(true)
      }, 500)
      return
    }

    setTimeout(() => {
      pushBot({ type: 'text', text: getBotReply(trimmed) })
    }, 500)
  }

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <Sparkles size={16} />
              <span>GraniteX Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
          </div>

          <div className="chatbot-body" ref={scrollRef}>
            {messages.map((m, i) => (
              m.type === 'product'
                ? <ProductSuggestionCard key={i} product={m.product} />
                : <div key={i} className={`chatbot-msg ${m.from}`}>{m.text}</div>
            ))}
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
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" aria-label="Send message"><Send size={16} /></button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen(!open)} aria-label="Toggle chat assistant">
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  )
}
