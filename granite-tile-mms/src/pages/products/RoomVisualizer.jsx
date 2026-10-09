import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader.jsx'
import { products, categories, colorFilters, sortOptions } from '../../data/products.js'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import {
  Sparkles, Upload, Image as ImageIcon, Sliders, Eye, RefreshCw,
  Heart, Download, Send, CheckCircle2, AlertCircle, Layers,
  Ruler, IndianRupee, Scale, X, HelpCircle, ArrowUpDown, Filter,
  Bot, Check, ChevronRight, Sun, Flame, Zap, Calculator, Home as HomeIcon,
  Grid, Maximize2
} from 'lucide-react'
import { api } from '../../api/index.js'
import './RoomVisualizer.css'

// Helper: Convert tile size string to Sq.Ft coverage per piece
function parseTileSizeSqFt(sizeStr) {
  if (!sizeStr) return 4.0
  const str = String(sizeStr).toLowerCase().trim()
  if (str.includes('600x600')) return 3.875
  if (str.includes('600x1200')) return 7.75
  if (str.includes('800x800')) return 6.89
  if (str.includes('300x300')) return 0.97
  if (str.includes('300x600')) return 1.94
  if (str.includes('1200x2400') || str.includes('8x4')) return 31.0
  if (str.includes('1x1')) return 1.0
  if (str.includes('2x2')) return 4.0
  if (str.includes('2x4')) return 8.0
  if (str.includes('4x4')) return 16.0

  const nums = str.match(/\d+/g)
  if (nums && nums.length >= 2) {
    const [w, h] = nums.map(Number)
    if (str.includes('mm')) {
      return Number(((w / 304.8) * (h / 304.8)).toFixed(2))
    }
    return w * h
  }
  return 4.0
}

// Showroom Room Preset Templates
const roomTemplates = [
  {
    id: 'tpl-living',
    name: 'Modern Living Room',
    type: 'living-room',
    category: 'floor-tiles',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    placement: 'floor',
    maskZone: { yStart: 0.64 },
    aiAnalysis: { lighting: 'Daylight', recommended: ['marble-02', 'marble-03', 'wood-01'] }
  },
  {
    id: 'tpl-bath',
    name: 'Luxury Bathroom',
    type: 'bathroom',
    category: 'bathroom-tiles',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    placement: 'floor',
    maskZone: { yStart: 0.60 },
    aiAnalysis: { lighting: 'Warm', recommended: ['marble-05', 'des-02', 'des-04'] }
  },
  {
    id: 'tpl-kitchen',
    name: 'Modular Kitchen',
    type: 'kitchen',
    category: 'kitchen-tiles',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    placement: 'wall',
    maskZone: { yStart: 0.38, yEnd: 0.72 },
    aiAnalysis: { lighting: 'Cool', recommended: ['des-01', 'des-05', 'granite-02'] }
  },
  {
    id: 'tpl-bedroom',
    name: 'Master Bedroom',
    type: 'bedroom',
    category: 'wooden-tiles',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    placement: 'floor',
    maskZone: { yStart: 0.60 },
    aiAnalysis: { lighting: 'Warm', recommended: ['wood-01', 'wood-02', 'floor-02'] }
  },
  {
    id: 'tpl-lobby',
    name: 'Grand Commercial Lobby',
    type: 'office',
    category: 'vitrified-tiles',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    placement: 'floor',
    maskZone: { yStart: 0.60 },
    aiAnalysis: { lighting: 'Daylight', recommended: ['marble-01', 'marble-06', 'granite-05'] }
  },
  {
    id: 'tpl-outdoor',
    name: 'Patio & Poolside Deck',
    type: 'outdoor',
    category: 'outdoor-tiles',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    placement: 'floor',
    maskZone: { yStart: 0.62 },
    aiAnalysis: { lighting: 'Daylight', recommended: ['granite-01', 'wood-02', 'des-03'] }
  }
]

export default function RoomVisualizer() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { isWishlisted, toggleWishlist } = useWishlist()

  // State: Room Setup & Dimensions
  const [roomType, setRoomType] = useState('living-room')
  const [roomLength, setRoomLength] = useState(15)
  const [roomWidth, setRoomWidth] = useState(12)
  const [wastagePercent, setWastagePercent] = useState(10)
  const [lightingCondition, setLightingCondition] = useState('Daylight') // Daylight | Warm | Cool

  // State: Visualizer setup
  const [activeTemplate, setActiveTemplate] = useState(roomTemplates[0])
  const [customImage, setCustomImage] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [compareProduct, setCompareProduct] = useState(products[4] || products[1])

  // Placement & Tuning state
  const [placement, setPlacement] = useState('floor')
  const [pattern, setPattern] = useState('grid') // grid | diagonal | brick | herringbone
  const [tileSize, setTileSize] = useState('medium') // small | medium | large | slab
  const [groutColor, setGroutColor] = useState('#ffffff')
  const [sheen, setSheen] = useState('glossy') // glossy | matte | satin
  const [blendOpacity, setBlendOpacity] = useState(0.80)
  const [furnitureProtection, setFurnitureProtection] = useState(0.85)

  // Interactive View Modes: 'single' | 'split' | 'compare'
  const [viewMode, setViewMode] = useState('single')
  const [splitPos, setSplitPos] = useState(50)

  // Catalog Filters & Sorting State
  const [catalogCategory, setCatalogCategory] = useState('All')
  const [catalogMaterial, setCatalogMaterial] = useState('All')
  const [catalogColor, setCatalogColor] = useState('All')
  const [catalogSearch, setCatalogSearch] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  // Quote Modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', email: '', city: 'Chennai', notes: '' })
  const [quoteStatus, setQuoteStatus] = useState('')
  const [quoteError, setQuoteError] = useState('')

  // Canvas Refs
  const canvasRef = useRef(null)
  const canvasCompareRef = useRef(null)
  const fileInputRef = useRef(null)

  // DERIVED CALCULATIONS BASED ON ROOM DIMENSIONS AND SELECTED TILE
  const lengthNum = Math.max(0, Number(roomLength) || 0)
  const widthNum = Math.max(0, Number(roomWidth) || 0)
  const roomArea = lengthNum * widthNum
  const wastageArea = roomArea * ((Number(wastagePercent) || 0) / 100)
  const totalRequiredArea = roomArea + wastageArea
  const tileCoveragePerPiece = parseTileSizeSqFt(selectedProduct?.sizes?.[0])
  const requiredTileQuantity = tileCoveragePerPiece > 0 ? Math.ceil(totalRequiredArea / tileCoveragePerPiece) : 0
  const estimatedCost = Math.round(totalRequiredArea * (selectedProduct?.price || 0))

  // Effect: Render Main Visualizer Canvas
  useEffect(() => {
    renderVisualizerCanvas(canvasRef.current, selectedProduct, activeTemplate, customImage, lightingCondition, furnitureProtection)
  }, [selectedProduct, activeTemplate, customImage, placement, pattern, tileSize, groutColor, sheen, blendOpacity, lightingCondition, furnitureProtection])

  // Effect: Render Compare Visualizer Canvas if compare mode active
  useEffect(() => {
    if (viewMode === 'compare' && canvasCompareRef.current) {
      renderVisualizerCanvas(canvasCompareRef.current, compareProduct, activeTemplate, customImage, lightingCondition, furnitureProtection)
    }
  }, [viewMode, compareProduct, activeTemplate, customImage, placement, pattern, tileSize, groutColor, sheen, blendOpacity, lightingCondition, furnitureProtection])

  // Canvas Rendering Engine
  const renderVisualizerCanvas = (targetCanvas, product, template, userCustomImg, lighting, furnitureProt = 0.85) => {
    if (!targetCanvas || !product) return
    const ctx = targetCanvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = userCustomImg || template.image

    img.onload = () => {
      targetCanvas.width = img.naturalWidth || 1200
      targetCanvas.height = img.naturalHeight || 800

      const w = targetCanvas.width
      const h = targetCanvas.height

      // 1. Draw base room photo
      ctx.drawImage(img, 0, 0, w, h)

      // 2. Create Pattern Texture Canvas based on Product Design Type
      const tileTexCanvas = document.createElement('canvas')
      const scaleFactor = tileSize === 'small' ? 50 : tileSize === 'medium' ? 90 : tileSize === 'large' ? 140 : 240
      tileTexCanvas.width = scaleFactor
      tileTexCanvas.height = scaleFactor
      const tCtx = tileTexCanvas.getContext('2d')

      const [c1, c2] = product.swatch || ['#9b9b93', '#4a463f']
      const designType = product.designType || 'solid'

      // Base color gradient
      const grad = tCtx.createLinearGradient(0, 0, scaleFactor, scaleFactor)
      grad.addColorStop(0, c1)
      grad.addColorStop(1, c2)
      tCtx.fillStyle = grad
      tCtx.fillRect(0, 0, scaleFactor, scaleFactor)

      // Procedural Texture Generator
      if (designType === 'marble') {
        tCtx.lineWidth = Math.max(1.5, scaleFactor * 0.03)
        tCtx.strokeStyle = product.veinColor || 'rgba(255, 255, 255, 0.45)'
        tCtx.beginPath()
        tCtx.moveTo(0, scaleFactor * 0.2)
        tCtx.bezierCurveTo(scaleFactor * 0.3, scaleFactor * 0.1, scaleFactor * 0.6, scaleFactor * 0.9, scaleFactor, scaleFactor * 0.7)
        tCtx.stroke()

        tCtx.lineWidth = Math.max(1, scaleFactor * 0.015)
        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        tCtx.beginPath()
        tCtx.moveTo(scaleFactor * 0.4, scaleFactor * 0.45)
        tCtx.bezierCurveTo(scaleFactor * 0.7, scaleFactor * 0.3, scaleFactor * 0.8, scaleFactor * 0.9, scaleFactor * 0.9, scaleFactor)
        tCtx.stroke()
      } else if (designType === 'granite') {
        tCtx.fillStyle = product.speckleColor || 'rgba(255, 255, 255, 0.5)'
        for (let i = 0; i < 70; i++) {
          const rx = Math.random() * scaleFactor
          const ry = Math.random() * scaleFactor
          tCtx.beginPath()
          tCtx.arc(rx, ry, Math.random() * 2 + 1, 0, Math.PI * 2)
          tCtx.fill()
        }
        tCtx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        for (let i = 0; i < 50; i++) {
          const rx = Math.random() * scaleFactor
          const ry = Math.random() * scaleFactor
          tCtx.fillRect(rx, ry, Math.random() * 2 + 1, Math.random() * 2 + 1)
        }
      } else if (designType === 'wood') {
        tCtx.strokeStyle = 'rgba(0, 0, 0, 0.18)'
        tCtx.lineWidth = 1
        for (let y = 8; y < scaleFactor; y += 10) {
          tCtx.beginPath()
          tCtx.moveTo(0, y)
          tCtx.bezierCurveTo(scaleFactor * 0.3, y + Math.sin(y) * 4, scaleFactor * 0.7, y - Math.cos(y) * 4, scaleFactor, y)
          tCtx.stroke()
        }
        tCtx.strokeStyle = 'rgba(0, 0, 0, 0.35)'
        tCtx.lineWidth = 2
        tCtx.strokeRect(0, 0, scaleFactor, scaleFactor)
      } else if (designType === 'moroccan') {
        const cx = scaleFactor / 2
        const cy = scaleFactor / 2
        const r = scaleFactor * 0.35
        tCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        tCtx.lineWidth = 2
        tCtx.strokeRect(cx - r, cy - r, r * 2, r * 2)
      }

      // Outer Tile Grout Line
      tCtx.strokeStyle = groutColor
      tCtx.lineWidth = Math.max(1.5, Math.floor(scaleFactor * 0.035))
      tCtx.strokeRect(0, 0, scaleFactor, scaleFactor)

      // 3. Apply Pattern Texture to Main Room Canvas Mask Zone
      const tilePattern = ctx.createPattern(tileTexCanvas, 'repeat')

      ctx.save()

      // Define Perspective Mask Zone based on placement
      ctx.beginPath()
      const yStart = (template.maskZone?.yStart || 0.64) * h
      const yEnd = (template.maskZone?.yEnd || 1.0) * h

      if (placement === 'floor') {
        ctx.moveTo(w * 0.08, yStart)
        ctx.lineTo(w * 0.92, yStart)
        ctx.lineTo(w * 1.05, h)
        ctx.lineTo(-w * 0.05, h)
      } else if (placement === 'wall') {
        ctx.moveTo(w * 0.05, h * 0.15)
        ctx.lineTo(w * 0.95, h * 0.15)
        ctx.lineTo(w * 0.95, yEnd)
        ctx.lineTo(w * 0.05, yEnd)
      } else {
        ctx.moveTo(w * 0.15, h * 0.35)
        ctx.lineTo(w * 0.85, h * 0.35)
        ctx.lineTo(w * 0.90, h * 0.75)
        ctx.lineTo(w * 0.10, h * 0.75)
      }
      ctx.closePath()

      ctx.clip()

      ctx.globalAlpha = blendOpacity * 0.75
      ctx.globalCompositeOperation = sheen === 'glossy' ? 'multiply' : 'source-over'

      if (pattern === 'diagonal') {
        ctx.translate(w / 2, h / 2)
        ctx.rotate(Math.PI / 4)
        ctx.translate(-w / 2, -h / 2)
      }

      ctx.fillStyle = tilePattern
      ctx.fillRect(-w, -h, w * 3, h * 3)

      if (pattern === 'diagonal') {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      }

      // 4. FURNITURE STRUCTURE & CONTOUR PRESERVATION PASS
      // Ensures chair legs, coffee table base, sofa base, and floor shadows stay crisp on top of the tile pattern
      if (furnitureProt > 0) {
        ctx.globalCompositeOperation = 'darken'
        ctx.globalAlpha = furnitureProt * 0.45
        ctx.drawImage(img, 0, 0, w, h)
      }

      // 5. Glossy Surface Highlight
      if (sheen === 'glossy') {
        ctx.globalCompositeOperation = 'overlay'
        ctx.globalAlpha = 0.18
        const glossGrad = ctx.createLinearGradient(0, yStart, w, h)
        glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
        glossGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
        glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.3)')
        ctx.fillStyle = glossGrad
        ctx.fillRect(0, yStart, w, h - yStart)
      }

      ctx.restore()

      // 5. Apply Selected Lighting Filter (Daylight | Warm | Cool)
      ctx.save()
      if (lighting === 'Warm') {
        ctx.globalCompositeOperation = 'color-dodge'
        ctx.globalAlpha = 0.22
        const warmGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, 50, w * 0.5, h * 0.5, w * 0.8)
        warmGrad.addColorStop(0, '#fef08a')
        warmGrad.addColorStop(0.6, '#f59e0b')
        warmGrad.addColorStop(1, '#78350f')
        ctx.fillStyle = warmGrad
        ctx.fillRect(0, 0, w, h)
      } else if (lighting === 'Cool') {
        ctx.globalCompositeOperation = 'soft-light'
        ctx.globalAlpha = 0.25
        const coolGrad = ctx.createLinearGradient(0, 0, 0, h)
        coolGrad.addColorStop(0, '#e0f2fe')
        coolGrad.addColorStop(1, '#0284c7')
        ctx.fillStyle = coolGrad
        ctx.fillRect(0, 0, w, h)
      } else {
        // Daylight: Natural Bright Sun
        ctx.globalCompositeOperation = 'soft-light'
        ctx.globalAlpha = 0.12
        const dayGrad = ctx.createLinearGradient(0, 0, w, h)
        dayGrad.addColorStop(0, '#ffffff')
        dayGrad.addColorStop(1, '#cbd5e1')
        ctx.fillStyle = dayGrad
        ctx.fillRect(0, 0, w, h)
      }
      ctx.restore()
    }
  }

  // Handle Custom Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      setCustomImage(evt.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle Render Snapshot Download
  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `AI-Room-Visualizer-${selectedProduct.code}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  // Handle Submit Quote Enquiry
  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    setQuoteStatus('')
    setQuoteError('')

    const payload = {
      productLot: selectedProduct.name,
      customerName: quoteForm.name || 'Showroom Visitor',
      phone: quoteForm.phone || '+91 98400 12345',
      email: quoteForm.email || 'customer@example.com',
      quantity: requiredTileQuantity || Number(totalRequiredArea.toFixed(0)),
      message: `Quote for AI Visualizer: Room ${roomLength}x${roomWidth} ft (${roomArea} sq.ft), Tile: ${selectedProduct.name} (${selectedProduct.code}), Lighting: ${lightingCondition}, Total Area: ${totalRequiredArea.toFixed(1)} sq.ft, Estimated Cost: ₹${estimatedCost}. Notes: ${quoteForm.notes}`
    }

    const res = await api.post('/enquiries', payload)
    if (res && res.success) {
      setQuoteStatus('Enquiry submitted successfully! Our showroom team will contact you with exact pricing & physical tile samples.')
      setTimeout(() => {
        setQuoteStatus('')
        setQuoteModalOpen(false)
      }, 2500)
    } else {
      setQuoteError(res?.message || 'Error submitting enquiry. Please try again.')
    }
  }

  // Filter & Sort Products Catalog
  const filteredCatalog = products.filter(p => {
    if (catalogCategory !== 'All' && p.category !== catalogCategory) return false
    if (catalogMaterial !== 'All' && p.material !== catalogMaterial) return false
    if (catalogColor !== 'All' && p.colorFamily !== catalogColor) return false
    if (catalogSearch && catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase().trim()
      return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.material.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'rating-desc') return b.rating - a.rating
    if (sortBy === 'stock-desc') return b.stock - a.stock
    return 0
  })

  // Recommended products list
  const recommendedItems = (activeTemplate.aiAnalysis?.recommended || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  return (
    <div className="visualizer-container">
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('catalog'), path: '/product-catalog' }, { label: t('aiRoomVisualizer') }]}
        title="AI Room Tile Visualizer & Material Estimator"
        description="Configure your room dimensions, select tiles from our database, set lighting conditions, and preview room transformations with instant cost estimation."
        actions={[
          <button className="btn btn-outline btn-sm" key="reset" onClick={() => setCustomImage(null)}>
            <RefreshCw size={14} /> Reset Room Photo
          </button>,
          <button className="btn btn-primary btn-sm" key="upload" onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Upload Room Image
          </button>
        ]}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />

      {/* STEP 1: ROOM SETUP & CONFIGURATION CARD */}
      <div className="card room-config-card">
        <div className="card-header" style={{ paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="icon-badge-orange">
              <Sliders size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>1. Room & Tile Specifications</h3>
              <p style={{ fontSize: 12.5, color: 'var(--stone)', margin: '2px 0 0' }}>
                Set your room dimensions, room type, selected tile product, and lighting condition.
              </p>
            </div>
          </div>
        </div>

        <div className="room-config-grid">
          {/* Room Type Select */}
          <div className="tune-field">
            <label>Room Type</label>
            <select
              className="tune-select"
              value={roomType}
              onChange={(e) => {
                setRoomType(e.target.value)
                const tpl = roomTemplates.find(t => t.type === e.target.value)
                if (tpl && !customImage) {
                  setActiveTemplate(tpl)
                  setPlacement(tpl.placement)
                }
              }}
            >
              <option value="living-room">Living Room</option>
              <option value="bedroom">Master Bedroom</option>
              <option value="kitchen">Modular Kitchen</option>
              <option value="bathroom">Bathroom & Vanity</option>
              <option value="office">Commercial / Office Lobby</option>
              <option value="outdoor">Patio & Outdoor Deck</option>
            </select>
          </div>

          {/* Room Length */}
          <div className="tune-field">
            <label>Room Length (ft)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="1"
                max="500"
                className="tune-select"
                style={{ width: '100%', paddingRight: 32 }}
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
              />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--stone)', fontWeight: 600 }}>
                ft
              </span>
            </div>
          </div>

          {/* Room Width */}
          <div className="tune-field">
            <label>Room Width (ft)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="1"
                max="500"
                className="tune-select"
                style={{ width: '100%', paddingRight: 32 }}
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
              />
              <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--stone)', fontWeight: 600 }}>
                ft
              </span>
            </div>
          </div>

          {/* Selected Tile Dropdown */}
          <div className="tune-field">
            <label>Selected Tile Product</label>
            <select
              className="tune-select"
              style={{ fontWeight: 600 }}
              value={selectedProduct.id}
              onChange={(e) => {
                const prod = products.find(p => p.id === e.target.value)
                if (prod) setSelectedProduct(prod)
              }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code}) — ₹{p.price}/sq.ft
                </option>
              ))}
            </select>
          </div>

          {/* Lighting Condition Pills */}
          <div className="tune-field" style={{ gridColumn: 'span 2' }}>
            <label>Lighting Condition</label>
            <div className="lighting-pills">
              <button
                type="button"
                className={`lighting-btn ${lightingCondition === 'Daylight' ? 'active' : ''}`}
                onClick={() => setLightingCondition('Daylight')}
              >
                <Sun size={15} /> Daylight (Natural)
              </button>
              <button
                type="button"
                className={`lighting-btn ${lightingCondition === 'Warm' ? 'active' : ''}`}
                onClick={() => setLightingCondition('Warm')}
              >
                <Flame size={15} /> Warm Light (Golden)
              </button>
              <button
                type="button"
                className={`lighting-btn ${lightingCondition === 'Cool' ? 'active' : ''}`}
                onClick={() => setLightingCondition('Cool')}
              >
                <Zap size={15} /> Cool Light (Studio)
              </button>
            </div>
          </div>

          {/* Recommended Wastage */}
          <div className="tune-field">
            <label>Wastage Allowance (%)</label>
            <select
              className="tune-select"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(Number(e.target.value))}
            >
              <option value={5}>5% (Minimal cuts)</option>
              <option value={10}>10% (Recommended standard)</option>
              <option value={15}>15% (Diagonal / Herringbone layout)</option>
              <option value={20}>20% (Complex room geometry)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STEP 2: CLEAR CALCULATION RESULTS BAR */}
      <div className="card calculation-results-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={18} color="var(--orange-deep)" />
            <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: 'var(--charcoal)' }}>
              Estimation & Material Calculation Results
            </h3>
          </div>
          <span className="pill" style={{ background: 'var(--orange-deep)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
            Live Calculation
          </span>
        </div>

        <div className="results-metrics-grid">
          {/* Metric 1: Room Area */}
          <div className="metric-box">
            <div className="metric-label">
              <Maximize2 size={13} color="var(--stone)" /> Room Area
            </div>
            <div className="metric-value">{roomArea.toLocaleString('en-IN')} <small>sq.ft</small></div>
            <div className="metric-subtext">{roomLength} ft × {roomWidth} ft</div>
          </div>

          {/* Metric 2: Tile Size */}
          <div className="metric-box">
            <div className="metric-label">
              <Ruler size={13} color="var(--stone)" /> Tile Size
            </div>
            <div className="metric-value" style={{ fontSize: 18 }}>
              {selectedProduct?.sizes?.[0] || '600x600mm'}
            </div>
            <div className="metric-subtext">~{tileCoveragePerPiece} sq.ft / tile</div>
          </div>

          {/* Metric 3: Required Quantity */}
          <div className="metric-box highlight">
            <div className="metric-label">
              <Grid size={13} color="var(--orange)" /> Required Quantity
            </div>
            <div className="metric-value" style={{ color: 'var(--orange-deep)' }}>
              {requiredTileQuantity} <small>Tiles</small>
            </div>
            <div className="metric-subtext">{totalRequiredArea.toFixed(1)} sq.ft total coverage</div>
          </div>

          {/* Metric 4: Wastage */}
          <div className="metric-box">
            <div className="metric-label">
              <Scale size={13} color="var(--stone)" /> Recommended Wastage
            </div>
            <div className="metric-value">{wastagePercent}%</div>
            <div className="metric-subtext">+{wastageArea.toFixed(1)} sq.ft margin</div>
          </div>

          {/* Metric 5: Estimated Cost */}
          <div className="metric-box price-box">
            <div className="metric-label">
              <IndianRupee size={13} color="var(--success)" /> Estimated Cost
            </div>
            <div className="metric-value price-text">
              ₹{estimatedCost.toLocaleString('en-IN')}
            </div>
            <div className="metric-subtext">@ ₹{selectedProduct?.price} / sq.ft</div>
          </div>
        </div>
      </div>

      {/* Mode Control & Preset Room Selector Bar */}
      <div className="visualizer-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone-dark)', textTransform: 'uppercase' }}>
            View Mode:
          </span>
          <div className="visualizer-mode-pills">
            <button
              className={`visualizer-mode-btn ${viewMode === 'single' ? 'active' : ''}`}
              onClick={() => setViewMode('single')}
            >
              <Eye size={14} /> Room Preview
            </button>
            <button
              className={`visualizer-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
            >
              <Sliders size={14} /> Split Before/After
            </button>
            <button
              className={`visualizer-mode-btn ${viewMode === 'compare' ? 'active' : ''}`}
              onClick={() => setViewMode('compare')}
            >
              <Scale size={14} /> Compare 2 Tiles
            </button>
          </div>
        </div>

        {/* Room Template Selector Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--stone)' }}>Room Presets:</span>
          {roomTemplates.map(tpl => (
            <div
              key={tpl.id}
              className={`room-template-item ${!customImage && activeTemplate.id === tpl.id ? 'active' : ''}`}
              onClick={() => {
                setCustomImage(null)
                setActiveTemplate(tpl)
                setRoomType(tpl.type)
                setPlacement(tpl.placement)
              }}
              title={tpl.name}
            >
              <img src={tpl.image} alt={tpl.name} />
              <div className="template-name">{tpl.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Visualizer Workspace Grid */}
      <div className="visualizer-studio-grid">
        {/* Left Column: Canvas Viewport */}
        <div className="visualizer-viewport-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="pill" style={{ background: 'var(--charcoal)', color: '#fff' }}>
                {customImage ? 'Uploaded Custom Photo' : activeTemplate.name}
              </span>
              <span className="pill" style={{ background: 'var(--orange)', color: '#fff' }}>
                Lighting: {lightingCondition}
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--stone)', fontWeight: 600 }}>
              Tile overlay rendered safely without obscuring room structure
            </span>
          </div>

          {viewMode === 'compare' ? (
            /* Dual Compare Mode Grid */
            <div className="dual-compare-grid">
              <div className="compare-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow">Option A</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{selectedProduct.name}</span>
                </div>
                <div className="compare-canvas-box">
                  <canvas ref={canvasRef} className="visualizer-canvas" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--orange-deep)', fontWeight: 700 }}>
                  <span>{selectedProduct.code} ({selectedProduct.material})</span>
                  <span>₹{selectedProduct.price} / sq.ft</span>
                </div>
              </div>

              <div className="compare-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="eyebrow" style={{ color: 'var(--info)' }}>Option B</span>
                  <select
                    className="tune-select"
                    value={compareProduct.id}
                    onChange={(e) => {
                      const p = products.find(x => x.id === e.target.value)
                      if (p) setCompareProduct(p)
                    }}
                    style={{ fontSize: 12.5, padding: '4px 8px' }}
                  >
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>)}
                  </select>
                </div>
                <div className="compare-canvas-box">
                  <canvas ref={canvasCompareRef} className="visualizer-canvas" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--info)', fontWeight: 700 }}>
                  <span>{compareProduct.code} ({compareProduct.material})</span>
                  <span>₹{compareProduct.price} / sq.ft</span>
                </div>
              </div>
            </div>
          ) : (
            /* Single or Split Viewport */
            <div className="visualizer-canvas-wrapper">
              <canvas ref={canvasRef} className="visualizer-canvas" />

              {/* Split Slider Overlay */}
              {viewMode === 'split' && (
                <div className="split-slider-container">
                  <div className="split-slider-line" style={{ left: `${splitPos}%` }}>
                    <div className="split-slider-handle">↔</div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, width: `${splitPos}%`, overflow: 'hidden' }}>
                    <img
                      src={customImage || activeTemplate.image}
                      alt="Original Room"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Viewport Control Bar */}
          <div className="viewport-toolbar">
            {viewMode === 'split' && (
              <div className="toolbar-group" style={{ flex: 1, maxWidth: 300 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone-dark)' }}>Original vs Tile:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPos}
                  onChange={(e) => setSplitPos(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--orange)' }}
                />
              </div>
            )}

            <div className="toolbar-group">
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone-dark)' }}>Placement:</span>
              <button
                className={`btn btn-ghost btn-sm ${placement === 'floor' ? 'btn-dark' : ''}`}
                onClick={() => setPlacement('floor')}
              >
                Floor
              </button>
              <button
                className={`btn btn-ghost btn-sm ${placement === 'wall' ? 'btn-dark' : ''}`}
                onClick={() => setPlacement('wall')}
              >
                Wall
              </button>
              <button
                className={`btn btn-ghost btn-sm ${placement === 'feature' ? 'btn-dark' : ''}`}
                onClick={() => setPlacement('feature')}
              >
                Accent
              </button>
            </div>

            <div className="toolbar-group">
              <button className="btn btn-outline btn-sm" onClick={handleDownloadSnapshot}>
                <Download size={14} /> Download Render
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Fine Tuning & Tile Catalog Selector */}
        <div className="visualizer-sidebar-panel">
          {/* Surface & Pattern Tuning Section */}
          <div className="panel-section">
            <div className="panel-title">
              <Sliders size={16} color="var(--orange)" /> Surface & Pattern Settings
            </div>

            <div className="tuning-grid">
              <div className="tune-field">
                <label>Tile Pattern</label>
                <select className="tune-select" value={pattern} onChange={(e) => setPattern(e.target.value)}>
                  <option value="grid">Grid (Straight)</option>
                  <option value="diagonal">Diagonal (45° Angle)</option>
                  <option value="brick">Brick Bond Stagger</option>
                  <option value="herringbone">Herringbone Wave</option>
                </select>
              </div>

              <div className="tune-field">
                <label>Tile Scale</label>
                <select className="tune-select" value={tileSize} onChange={(e) => setTileSize(e.target.value)}>
                  <option value="small">Small (300x300mm)</option>
                  <option value="medium">Medium (600x600mm)</option>
                  <option value="large">Large (600x1200mm)</option>
                  <option value="slab">Grand Slab (8x4 ft)</option>
                </select>
              </div>

              <div className="tune-field">
                <label>Grout Line Color</label>
                <select className="tune-select" value={groutColor} onChange={(e) => setGroutColor(e.target.value)}>
                  <option value="#ffffff">Pure White Grout</option>
                  <option value="#999999">Seamless Grey Grout</option>
                  <option value="#333333">Slate Black Grout</option>
                  <option value="#c9a968">Champagne Gold</option>
                </select>
              </div>

              <div className="tune-field">
                <label>Finish Sheen</label>
                <select className="tune-select" value={sheen} onChange={(e) => setSheen(e.target.value)}>
                  <option value="glossy">Glossy Mirror Polish</option>
                  <option value="matte">Matte Natural Finish</option>
                  <option value="satin">Satin Touch</option>
                </select>
              </div>
            </div>

            <div className="tune-field" style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--stone-dark)' }}>
                <span>Texture Intensity</span>
                <span>{Math.round(blendOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="1.0"
                step="0.05"
                value={blendOpacity}
                onChange={(e) => setBlendOpacity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--orange)', marginTop: 4 }}
              />
            </div>

            <div className="tune-field" style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--stone-dark)' }}>
                <span>Furniture Protection (No Overlap)</span>
                <span>{Math.round(furnitureProtection * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={furnitureProtection}
                onChange={(e) => setFurnitureProtection(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--orange)', marginTop: 4 }}
              />
              <span style={{ fontSize: 11, color: 'var(--stone)', display: 'block', marginTop: 2 }}>
                Prevents tile overlay from bleeding over sofas, tables & decor
              </span>
            </div>
          </div>

          {/* Tile Picker Catalog */}
          <div className="panel-section" style={{ flex: 1 }}>
            <div className="panel-title" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={16} color="var(--orange)" /> Select Product from Database
              </span>
              <span className="pill">{filteredCatalog.length} Items</span>
            </div>

            {/* Filters Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              <input
                type="text"
                className="tune-select"
                placeholder="Search tile by name, code or material..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase', marginBottom: 2, display: 'block' }}>
                    Material
                  </label>
                  <select
                    className="tune-select"
                    value={catalogMaterial}
                    onChange={(e) => setCatalogMaterial(e.target.value)}
                    style={{ fontSize: 12, padding: '6px 8px' }}
                  >
                    <option value="All">All Materials</option>
                    <option value="Marble">Italian & Indian Marble</option>
                    <option value="Granite">Granite Slabs</option>
                    <option value="Encaustic">Designed Encaustic Tiles</option>
                    <option value="Vitrified">Vitrified Tiles</option>
                    <option value="Ceramic">Ceramic Tiles</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--orange-deep)', textTransform: 'uppercase', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowUpDown size={11} /> Sort By
                  </label>
                  <select
                    className="tune-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ fontSize: 12, padding: '6px 8px', fontWeight: 600, borderColor: 'var(--orange)' }}
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="catalog-mini-grid">
              {filteredCatalog.map(prod => {
                const [c1, c2] = prod.swatch || ['#9b9b93', '#4a463f']
                const isSelected = selectedProduct.id === prod.id

                return (
                  <div
                    key={prod.id}
                    className={`tile-mini-card ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedProduct(prod)}
                  >
                    <div
                      className="tile-swatch-box"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      <span className="pill" style={{ fontSize: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', fontWeight: 700 }}>
                        {prod.material}
                      </span>
                    </div>

                    <div className="tile-mini-info">
                      <h4>{prod.name}</h4>
                      <div className="tile-mini-meta">
                        <span>{prod.code}</span>
                        <span className="tile-mini-price">₹{prod.price}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product Banner & Action Hub */}
      {selectedProduct && (
        <div className="visualizer-product-banner">
          <div className="visualizer-product-info">
            <div
              className="product-swatch-thumb"
              style={{
                background: `linear-gradient(135deg, ${selectedProduct.swatch?.[0] || '#9b9b93'}, ${selectedProduct.swatch?.[1] || '#4a463f'})`
              }}
            />
            <div className="visualizer-product-details">
              <span className="eyebrow">{selectedProduct.code} • {selectedProduct.material}</span>
              <h3>{selectedProduct.name}</h3>
              <div className="visualizer-product-tags">
                <span className="pill"><Ruler size={12} /> {selectedProduct.sizes[0]}</span>
                <span className="pill">Thickness: {selectedProduct.thickness}</span>
                <span className="pill">Coverage: ~{tileCoveragePerPiece} sq.ft/tile</span>
                <span className="pill" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                  In Stock ({selectedProduct.stock} sq.ft)
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--stone)', fontWeight: 600, textTransform: 'uppercase' }}>Selected Tile Price</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--orange-deep)', fontWeight: 700 }}>
                ₹{selectedProduct.price} <small style={{ fontSize: 14, color: 'var(--stone)' }}>/ sq.ft</small>
              </div>
            </div>

            <div className="visualizer-product-actions">
              <button
                className={`btn ${isWishlisted(selectedProduct.id) ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleWishlist(selectedProduct.id)}
              >
                <Heart size={16} fill={isWishlisted(selectedProduct.id) ? 'currentColor' : 'none'} />
                {isWishlisted(selectedProduct.id) ? 'Saved' : 'Wishlist'}
              </button>

              <button className="btn btn-dark" onClick={() => setQuoteModalOpen(true)}>
                <Send size={16} /> Request Quote (₹{estimatedCost.toLocaleString('en-IN')})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote Request Modal Drawer */}
      {quoteModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 540, padding: 26, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <span className="eyebrow">Instant Showroom Quote</span>
                <h3 style={{ fontSize: 20, marginTop: 2 }}>{selectedProduct.name}</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setQuoteModalOpen(false)}><X size={18} /></button>
            </div>

            {quoteStatus && (
              <div className="auth-success" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} /> {quoteStatus}
              </div>
            )}

            {quoteError && (
              <div className="auth-error" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> {quoteError}
              </div>
            )}

            <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="field">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  required
                  value={quoteForm.name}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98400 12345"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="field">
                  <label>Calculated Quantity</label>
                  <input
                    type="text"
                    readOnly
                    value={`${requiredTileQuantity} Tiles (${totalRequiredArea.toFixed(1)} sq.ft)`}
                    style={{ background: 'var(--cream)', fontWeight: 700 }}
                  />
                </div>
                <div className="field">
                  <label>Estimated Total Cost</label>
                  <input
                    type="text"
                    readOnly
                    value={`₹${estimatedCost.toLocaleString('en-IN')}`}
                    style={{ background: 'var(--cream)', color: 'var(--orange-deep)', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div className="field">
                <label>Notes / Custom Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Mention any custom tile sizes, edge polishing or delivery timelines..."
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setQuoteModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Quote Enquiry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
