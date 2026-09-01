export const categories = [
  { key: 'floor-tiles', label: 'Floor Tiles' },
  { key: 'wall-tiles', label: 'Wall Tiles' },
  { key: 'bathroom-tiles', label: 'Bathroom Tiles' },
  { key: 'kitchen-tiles', label: 'Kitchen Tiles' },
  { key: 'outdoor-tiles', label: 'Outdoor Tiles' },
  { key: 'parking-tiles', label: 'Parking Tiles' },
  { key: 'vitrified-tiles', label: 'Vitrified Tiles' },
  { key: 'ceramic-tiles', label: 'Ceramic Tiles' },
  { key: 'granite-slabs', label: 'Granite Slabs' },
  { key: 'marble-collection', label: 'Marble Collection' },
]

// Real photography for each category, sourced under the Unsplash License
// (free for commercial use, no attribution required). If a URL ever fails
// to load (e.g. offline), the colour-swatch gradient layered behind each
// photo in the UI still shows through, so the site never looks "broken".
export const categoryImages = {
  'floor-tiles': 'https://images.unsplash.com/photo-1614598632980-35ee54daa5b9?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'wall-tiles': 'https://images.unsplash.com/photo-1548967199-79324abbe7dc?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'bathroom-tiles': 'https://images.unsplash.com/photo-1580398562556-d33329a0f29b?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'kitchen-tiles': 'https://images.unsplash.com/photo-1706629503586-2731f65587ae?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'outdoor-tiles': 'https://images.unsplash.com/photo-1584403293325-756fc1786516?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'parking-tiles': 'https://images.unsplash.com/photo-1520420253244-9ff6536abf60?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'vitrified-tiles': 'https://images.unsplash.com/photo-1575722290270-626b0208df99?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'ceramic-tiles': 'https://images.unsplash.com/photo-1536566482680-fca31930a0bd?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'granite-slabs': 'https://images.unsplash.com/photo-1585749864755-f1adb4ec8e29?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'marble-collection': 'https://images.unsplash.com/photo-1554296048-b59c9fca4857?fm=jpg&q=70&w=900&auto=format&fit=crop',
}

// Builds a CSS background value that layers the product's own colour swatch
// (as a translucent gradient) on top of the real category photo — keeps the
// "colourful" branded look while showing genuine photography underneath.
export function photoLayerBackground(categoryKey, swatch, opacity = 'B3') {
  const photo = categoryImages[categoryKey]
  const [c1, c2] = swatch
  return `linear-gradient(135deg, ${c1}${opacity}, ${c2}${opacity}), url(${photo}) center/cover no-repeat`
}

export const colorFilters = [
  { key: 'white', label: 'White' },
  { key: 'black', label: 'Black' },
  { key: 'grey', label: 'Grey' },
  { key: 'brown', label: 'Brown' },
  { key: 'cream', label: 'Cream' },
  { key: 'beige', label: 'Beige' },
  { key: 'marble-finish', label: 'Marble Finish' },
]

export const sizeFilters = [
  { key: '1x1', label: '1x1 ft' },
  { key: '2x2', label: '2x2 ft' },
  { key: '2x4', label: '2x4 ft' },
  { key: '4x4', label: '4x4 ft' },
  { key: '8x4', label: '8x4 ft' },
]

export const materialFilters = [
  { key: 'Ceramic', label: 'Ceramic' },
  { key: 'Vitrified', label: 'Vitrified' },
  { key: 'Granite', label: 'Granite' },
  { key: 'Marble', label: 'Marble' },
]

export const priceRangeFilters = [
  { key: '0-50', label: 'Under ₹50', min: 0, max: 50 },
  { key: '50-100', label: '₹50 – ₹100', min: 50, max: 100 },
  { key: '100-200', label: '₹100 – ₹200', min: 100, max: 200 },
  { key: '200-plus', label: '₹200 & above', min: 200, max: Infinity },
]

export const ratingFilters = [
  { key: '4.5', label: '4.5 & up', min: 4.5 },
  { key: '4', label: '4.0 & up', min: 4 },
  { key: '3.5', label: '3.5 & up', min: 3.5 },
]

// Swatch colours render each product's "image" as a CSS gradient card —
// no external image files or SVGs, consistent with the project's existing
// CSS-illustration approach throughout.
export const products = [
  {
    id: 'floor-01', category: 'floor-tiles', code: 'GT-FL-1001', name: 'Alpine Grey Vitrified Floor Tile',
    sizes: ['600x600mm', '800x800mm', '600x1200mm'], sizeBucket: '2x2', colorFamily: 'grey',
    colors: [{ name: 'Alpine Grey', hex: '#9b9b93' }, { name: 'Warm Beige', hex: '#cbb99a' }, { name: 'Charcoal', hex: '#4a463f' }],
    finishes: ['Matte', 'Glossy', 'Satin'], thickness: '10mm', stock: 1240, material: 'Vitrified', rating: 4.5,
    price: 62, unit: 'sq.ft',
    description: 'A double-charged vitrified floor tile with high abrasion resistance, ideal for living rooms and commercial lobbies.',
    swatch: ['#a8a89c', '#7b7a6f'],
  },
  {
    id: 'floor-02', category: 'floor-tiles', code: 'GT-FL-1002', name: 'Sandstone Beige Floor Tile',
    sizes: ['600x600mm', '600x1200mm'], sizeBucket: '2x2', colorFamily: 'beige',
    colors: [{ name: 'Sandstone Beige', hex: '#d9c6a0' }, { name: 'Terracotta', hex: '#b5673a' }],
    finishes: ['Matte', 'Rustic'], thickness: '9mm', stock: 860, material: 'Ceramic', rating: 4.2,
    price: 48, unit: 'sq.ft',
    description: 'Warm-toned ceramic floor tile with a rustic textured surface, well suited to traditional and transitional interiors.',
    swatch: ['#e0cda6', '#b79461'],
  },
  {
    id: 'wall-01', category: 'wall-tiles', code: 'GT-WL-2001', name: 'Ivory Gloss Wall Tile',
    sizes: ['300x450mm', '300x600mm'], sizeBucket: '1x1', colorFamily: 'cream',
    colors: [{ name: 'Ivory', hex: '#efe6d3' }, { name: 'Soft Pink', hex: '#e6c9c2' }, { name: 'Sky Mist', hex: '#cdd9d6' }],
    finishes: ['Glossy', 'Satin'], thickness: '8mm', stock: 2100, material: 'Ceramic', rating: 4.4,
    price: 38, unit: 'sq.ft',
    description: 'High-gloss ceramic wall tile that brightens interior spaces, popular for living and dining room feature walls.',
    swatch: ['#f2ead9', '#d8c9a8'],
  },
  {
    id: 'wall-02', category: 'wall-tiles', code: 'GT-WL-2002', name: 'Terracotta Accent Wall Tile',
    sizes: ['300x450mm'], sizeBucket: '1x1', colorFamily: 'brown',
    colors: [{ name: 'Terracotta', hex: '#c1663a' }, { name: 'Burnt Orange', hex: '#a1481f' }],
    finishes: ['Matte'], thickness: '8mm', stock: 540, material: 'Ceramic', rating: 4.1,
    price: 44, unit: 'sq.ft',
    description: 'Bold terracotta-finish accent tile designed for statement walls in cafés, lobbies and living spaces.',
    swatch: ['#c1663a', '#8f4526'],
  },
  {
    id: 'bath-01', category: 'bathroom-tiles', code: 'GT-BT-3001', name: 'Aqua Blue Bathroom Tile',
    sizes: ['300x300mm', '300x600mm'], sizeBucket: '1x1', colorFamily: 'white',
    colors: [{ name: 'Aqua Blue', hex: '#a9c6c4' }, { name: 'Pure White', hex: '#f4f1ea' }],
    finishes: ['Glossy', 'Anti-skid'], thickness: '8mm', stock: 1720, material: 'Ceramic', rating: 4.6,
    price: 41, unit: 'sq.ft',
    description: 'Water-resistant, anti-skid bathroom tile with a cooling aqua tone — designed for wet-area safety and easy upkeep.',
    swatch: ['#b7d3d1', '#8fb0ad'],
  },
  {
    id: 'bath-02', category: 'bathroom-tiles', code: 'GT-BT-3002', name: 'Mosaic Grey Bathroom Tile',
    sizes: ['300x300mm'], sizeBucket: '1x1', colorFamily: 'grey',
    colors: [{ name: 'Mosaic Grey', hex: '#a3a29b' }, { name: 'Charcoal Mix', hex: '#57534b' }],
    finishes: ['Anti-skid', 'Textured'], thickness: '8mm', stock: 430, material: 'Ceramic', rating: 4.3,
    price: 53, unit: 'sq.ft',
    description: 'Mosaic-pattern anti-skid tile ideal for shower floors and wet zones, with strong slip resistance underfoot.',
    swatch: ['#aeada4', '#716d63'],
  },
  {
    id: 'kitchen-01', category: 'kitchen-tiles', code: 'GT-KT-4001', name: 'Ceramic White Kitchen Tile',
    sizes: ['300x450mm', '600x600mm'], sizeBucket: '2x2', colorFamily: 'white',
    colors: [{ name: 'Pure White', hex: '#f6f3ec' }, { name: 'Cream', hex: '#efe1c8' }],
    finishes: ['Glossy', 'Satin'], thickness: '9mm', stock: 980, material: 'Ceramic', rating: 4.5,
    price: 45, unit: 'sq.ft',
    description: 'Stain-resistant ceramic tile for kitchen countertops and backsplashes, easy to clean and grease-resistant.',
    swatch: ['#f2ecdc', '#dccfab'],
  },
  {
    id: 'kitchen-02', category: 'kitchen-tiles', code: 'GT-KT-4002', name: 'Slate Grey Kitchen Floor Tile',
    sizes: ['600x600mm'], sizeBucket: '2x2', colorFamily: 'grey',
    colors: [{ name: 'Slate Grey', hex: '#6c6b66' }, { name: 'Deep Charcoal', hex: '#3a372f' }],
    finishes: ['Matte', 'Anti-skid'], thickness: '10mm', stock: 310, material: 'Vitrified', rating: 4.2,
    price: 58, unit: 'sq.ft',
    description: 'Durable anti-skid floor tile built for high-traffic kitchen zones, resistant to oil stains and heat marks.',
    swatch: ['#7c7a72', '#4d4a41'],
  },
  {
    id: 'outdoor-01', category: 'outdoor-tiles', code: 'GT-OT-5001', name: 'Rustic Brown Outdoor Tile',
    sizes: ['300x300mm', '600x600mm'], sizeBucket: '2x2', colorFamily: 'brown',
    colors: [{ name: 'Rustic Brown', hex: '#8a5a34' }, { name: 'Desert Sand', hex: '#c9a877' }],
    finishes: ['Textured', 'Anti-skid'], thickness: '12mm', stock: 640, material: 'Vitrified', rating: 4.4,
    price: 55, unit: 'sq.ft',
    description: 'Weather-resistant vitrified tile with a textured anti-skid surface, suited for courtyards, decks and pathways.',
    swatch: ['#9a6a3e', '#6c4726'],
  },
  {
    id: 'outdoor-02', category: 'outdoor-tiles', code: 'GT-OT-5002', name: 'Cool Grey Pool Deck Tile',
    sizes: ['600x600mm'], sizeBucket: '2x2', colorFamily: 'grey',
    colors: [{ name: 'Cool Grey', hex: '#a7aaa4' }, { name: 'Sea Green', hex: '#8fada3' }],
    finishes: ['Anti-skid'], thickness: '12mm', stock: 275, material: 'Vitrified', rating: 4.3,
    price: 60, unit: 'sq.ft',
    description: 'UV and frost resistant tile engineered for poolside and exterior decking with a firm anti-slip grip.',
    swatch: ['#b3b6ae', '#82857d'],
  },
  {
    id: 'parking-01', category: 'parking-tiles', code: 'GT-PK-6001', name: 'Heavy Duty Grey Parking Tile',
    sizes: ['400x400mm', '600x600mm'], sizeBucket: '2x2', colorFamily: 'grey',
    colors: [{ name: 'Industrial Grey', hex: '#8f918d' }, { name: 'Charcoal', hex: '#48463f' }],
    finishes: ['Anti-skid', 'Heavy-duty'], thickness: '18mm', stock: 480, material: 'Vitrified', rating: 4.6,
    price: 68, unit: 'sq.ft',
    description: 'High load-bearing tile designed for vehicle parking areas, engineered to resist cracking under repeated wheel load.',
    swatch: ['#95978f', '#5c5a52'],
  },
  {
    id: 'parking-02', category: 'parking-tiles', code: 'GT-PK-6002', name: 'Terracotta Driveway Paver',
    sizes: ['300x300mm'], sizeBucket: '1x1', colorFamily: 'brown',
    colors: [{ name: 'Terracotta', hex: '#a85c34' }],
    finishes: ['Textured', 'Anti-skid'], thickness: '20mm', stock: 210, material: 'Ceramic', rating: 4.0,
    price: 72, unit: 'sq.ft',
    description: 'Interlocking-style paver finish for driveways and parking bays, built for exterior durability and oil resistance.',
    swatch: ['#a85c34', '#7a4023'],
  },
  {
    id: 'vitrified-01', category: 'vitrified-tiles', code: 'GT-VT-7001', name: 'Carrara Marble-Look Vitrified Tile',
    sizes: ['600x1200mm', '800x1600mm'], sizeBucket: '4x4', colorFamily: 'marble-finish',
    colors: [{ name: 'Carrara White', hex: '#e9e6dd' }, { name: 'Statuario Grey', hex: '#cfcabd' }],
    finishes: ['Glossy', 'Polished'], thickness: '10mm', stock: 920, material: 'Vitrified', rating: 4.8,
    price: 89, unit: 'sq.ft',
    description: 'Full-body vitrified tile with a photo-realistic marble finish — the look of natural marble with tile-level durability.',
    swatch: ['#ece8de', '#cac5b7'],
  },
  {
    id: 'vitrified-02', category: 'vitrified-tiles', code: 'GT-VT-7002', name: 'Graphite Double-Charge Vitrified Tile',
    sizes: ['600x600mm', '800x800mm'], sizeBucket: '2x2', colorFamily: 'black',
    colors: [{ name: 'Graphite', hex: '#37352f' }, { name: 'Deep Charcoal', hex: '#211f1b' }],
    finishes: ['Matte', 'Satin'], thickness: '10mm', stock: 640, material: 'Vitrified', rating: 4.5,
    price: 76, unit: 'sq.ft',
    description: 'Dense double-charge vitrified tile with a deep graphite tone, ideal for modern minimalist interiors.',
    swatch: ['#454339', '#242219'],
  },
  {
    id: 'ceramic-01', category: 'ceramic-tiles', code: 'GT-CR-8001', name: 'Classic White Ceramic Tile',
    sizes: ['300x300mm', '300x600mm'], sizeBucket: '1x1', colorFamily: 'white',
    colors: [{ name: 'Classic White', hex: '#f5f2ea' }],
    finishes: ['Glossy'], thickness: '7mm', stock: 1580, material: 'Ceramic', rating: 4.0,
    price: 32, unit: 'sq.ft',
    description: 'Entry-level ceramic tile with a bright, uniform glossy finish — an economical choice for walls and light-use floors.',
    swatch: ['#f5f2ea', '#dcd6c4'],
  },
  {
    id: 'ceramic-02', category: 'ceramic-tiles', code: 'GT-CR-8002', name: 'Printed Floral Ceramic Tile',
    sizes: ['300x450mm'], sizeBucket: '1x1', colorFamily: 'cream',
    colors: [{ name: 'Floral Cream', hex: '#e9dcc0' }],
    finishes: ['Glossy', 'Printed'], thickness: '7mm', stock: 390, material: 'Ceramic', rating: 4.1,
    price: 36, unit: 'sq.ft',
    description: 'Decorative printed-pattern ceramic tile for accent walls in bedrooms, kitchens and hallways.',
    swatch: ['#e9dcc0', '#c9b98e'],
  },
  {
    id: 'granite-01', category: 'granite-slabs', code: 'GT-GR-9001', name: 'Tan Brown Granite Slab',
    sizes: ['8x4 ft / 18mm', '8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'brown',
    colors: [{ name: 'Tan Brown', hex: '#8a5a34' }, { name: 'Coffee Brown', hex: '#5c3a1f' }],
    finishes: ['Polished', 'Honed', 'Leathered'], thickness: '18-20mm', stock: 340, material: 'Granite', rating: 4.7,
    price: 185, unit: 'sq.ft',
    description: 'A premium South Indian granite with rich brown tones and dark speckling — a long-time favourite for countertops and flooring.',
    swatch: ['#8a5a34', '#5c3a1f'],
  },
  {
    id: 'granite-02', category: 'granite-slabs', code: 'GT-GR-9002', name: 'Black Galaxy Granite Slab',
    sizes: ['8x4 ft / 18mm', '8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'black',
    colors: [{ name: 'Black Galaxy', hex: '#2b2b2b' }],
    finishes: ['Polished', 'Leathered'], thickness: '18-20mm', stock: 156, material: 'Granite', rating: 4.9,
    price: 320, unit: 'sq.ft',
    description: 'Deep black granite with golden mineral flecks that catch the light — a signature choice for luxury countertops.',
    swatch: ['#2b2b2b', '#0e0e0e'],
  },
  {
    id: 'granite-03', category: 'granite-slabs', code: 'GT-GR-9003', name: 'Kashmir White Granite Slab',
    sizes: ['8x4 ft / 18mm', '8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'white',
    colors: [{ name: 'Kashmir White', hex: '#e9e2d2' }],
    finishes: ['Polished', 'Honed'], thickness: '18-20mm', stock: 210, material: 'Granite', rating: 4.5,
    price: 210, unit: 'sq.ft',
    description: 'Light-toned granite with fine burgundy and grey flecking — pairs well with both modern and classic interiors.',
    swatch: ['#e9e2d2', '#c9bfa5'],
  },
  {
    id: 'granite-04', category: 'granite-slabs', code: 'GT-GR-9004', name: 'Steel Grey Granite Slab',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'grey',
    colors: [{ name: 'Steel Grey', hex: '#8a8f92' }],
    finishes: ['Polished', 'Flamed'], thickness: '18mm', stock: 265, material: 'Granite', rating: 4.3,
    price: 175, unit: 'sq.ft',
    description: 'A versatile mid-grey granite with uniform speckling, widely used for flooring, cladding and countertops alike.',
    swatch: ['#8a8f92', '#5b6063'],
  },
  {
    id: 'marble-01', category: 'marble-collection', code: 'GT-MB-1101', name: 'Makrana White Marble Slab',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'white',
    colors: [{ name: 'Makrana White', hex: '#f0ebe0' }],
    finishes: ['Polished', 'Honed'], thickness: '18mm', stock: 118, material: 'Marble', rating: 4.6,
    price: 260, unit: 'sq.ft',
    description: 'Classic Rajasthan marble with a pure white base, historically used in monumental architecture — elegant for flooring and cladding.',
    swatch: ['#f0ebe0', '#d8d0bd'],
  },
  {
    id: 'marble-02', category: 'marble-collection', code: 'GT-MB-1102', name: 'Italian Statuario Marble Slab',
    sizes: ['8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'marble-finish',
    colors: [{ name: 'Statuario', hex: '#e7e3d8' }, { name: 'Grey Vein', hex: '#b9b3a4' }],
    finishes: ['Polished'], thickness: '20mm', stock: 64, material: 'Marble', rating: 4.9,
    price: 410, unit: 'sq.ft',
    description: 'Imported Italian marble with bold grey veining on a bright white base — a premium statement choice for luxury interiors.',
    swatch: ['#eae6db', '#c3bdae'],
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categoryKey) {
  return products.filter((p) => p.category === categoryKey)
}

export function filterProducts({ category, color, size, material, priceRange, minRating } = {}) {
  return products.filter((p) => {
    if (category && p.category !== category) return false
    if (color && p.colorFamily !== color) return false
    if (size && p.sizeBucket !== size) return false
    if (material && p.material !== material) return false
    if (priceRange) {
      const range = priceRangeFilters.find((r) => r.key === priceRange)
      if (range && (p.price < range.min || p.price > range.max)) return false
    }
    if (minRating && p.rating < minRating) return false
    return true
  })
}
