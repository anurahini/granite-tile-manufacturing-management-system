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
  { key: 'designed-tiles', label: 'Designed & Patterned Tiles' },
  { key: 'wooden-tiles', label: 'Wooden Finish Tiles' },
]

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
  'designed-tiles': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?fm=jpg&q=70&w=900&auto=format&fit=crop',
  'wooden-tiles': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?fm=jpg&q=70&w=900&auto=format&fit=crop',
}

export function photoLayerBackground(categoryKey, swatch, opacity = 'B3') {
  const photo = categoryImages[categoryKey] || categoryImages['floor-tiles']
  const [c1, c2] = swatch || ['#9b9b93', '#4a463f']
  return `linear-gradient(135deg, ${c1}${opacity}, ${c2}${opacity}), url(${photo}) center/cover no-repeat`
}

export const colorFilters = [
  { key: 'white', label: 'White' },
  { key: 'black', label: 'Black' },
  { key: 'grey', label: 'Grey' },
  { key: 'brown', label: 'Brown' },
  { key: 'cream', label: 'Cream & Beige' },
  { key: 'blue', label: 'Royal Blue' },
  { key: 'green', label: 'Emerald Green' },
  { key: 'red', label: 'Terracotta & Crimson' },
  { key: 'gold', label: 'Gold & Copper' },
  { key: 'marble-finish', label: 'Marble Finish' },
  { key: 'wood-finish', label: 'Wooden Finish' },
  { key: 'patterned-finish', label: 'Designed & Moroccan' },
]

export const sizeFilters = [
  { key: '1x1', label: '1x1 ft' },
  { key: '2x2', label: '2x2 ft' },
  { key: '2x4', label: '2x4 ft' },
  { key: '4x4', label: '4x4 ft' },
  { key: '8x4', label: '8x4 ft Slabs' },
]

export const materialFilters = [
  { key: 'Ceramic', label: 'Ceramic' },
  { key: 'Vitrified', label: 'Vitrified' },
  { key: 'Granite', label: 'Granite' },
  { key: 'Marble', label: 'Marble' },
  { key: 'Encaustic', label: 'Encaustic Designed' },
  { key: 'Porcelain', label: 'Porcelain' },
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

export const sortOptions = [
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'name-asc', label: 'Name: A to Z' },
  { key: 'rating-desc', label: 'Top Rated' },
  { key: 'stock-desc', label: 'Stock Availability' },
]

// Products Master Catalog with procedural designType for realistic rendering
export const products = [
  // --- FLOOR TILES ---
  {
    id: 'floor-01', category: 'floor-tiles', code: 'GT-FL-1001', name: 'Alpine Grey Vitrified Floor Tile',
    sizes: ['600x600mm', '800x800mm', '600x1200mm'], sizeBucket: '2x2', colorFamily: 'grey',
    colors: [{ name: 'Alpine Grey', hex: '#9b9b93' }, { name: 'Warm Beige', hex: '#cbb99a' }],
    finishes: ['Matte', 'Glossy'], thickness: '10mm', stock: 1240, material: 'Vitrified', rating: 4.5,
    price: 62, unit: 'sq.ft', designType: 'solid',
    description: 'Double-charged vitrified floor tile with high abrasion resistance, ideal for living rooms and lobbies.',
    swatch: ['#a8a89c', '#7b7a6f'],
  },
  {
    id: 'floor-02', category: 'floor-tiles', code: 'GT-FL-1002', name: 'Sandstone Beige Floor Tile',
    sizes: ['600x600mm', '600x1200mm'], sizeBucket: '2x2', colorFamily: 'cream',
    colors: [{ name: 'Sandstone Beige', hex: '#d9c6a0' }],
    finishes: ['Matte', 'Rustic'], thickness: '9mm', stock: 860, material: 'Ceramic', rating: 4.2,
    price: 48, unit: 'sq.ft', designType: 'solid',
    description: 'Warm-toned ceramic floor tile with a rustic textured surface.',
    swatch: ['#e0cda6', '#b79461'],
  },

  // --- WALL TILES ---
  {
    id: 'wall-01', category: 'wall-tiles', code: 'GT-WL-2001', name: 'Ivory Gloss Wall Tile',
    sizes: ['300x450mm', '300x600mm'], sizeBucket: '1x1', colorFamily: 'cream',
    colors: [{ name: 'Ivory', hex: '#efe6d3' }],
    finishes: ['Glossy', 'Satin'], thickness: '8mm', stock: 2100, material: 'Ceramic', rating: 4.4,
    price: 38, unit: 'sq.ft', designType: 'solid',
    description: 'High-gloss ceramic wall tile that brightens interior spaces.',
    swatch: ['#f2ead9', '#d8c9a8'],
  },
  {
    id: 'wall-02', category: 'wall-tiles', code: 'GT-WL-2002', name: 'Terracotta Accent Wall Tile',
    sizes: ['300x450mm'], sizeBucket: '1x1', colorFamily: 'red',
    colors: [{ name: 'Terracotta', hex: '#c1663a' }],
    finishes: ['Matte'], thickness: '8mm', stock: 540, material: 'Ceramic', rating: 4.1,
    price: 44, unit: 'sq.ft', designType: 'solid',
    description: 'Bold terracotta-finish accent tile designed for feature walls.',
    swatch: ['#c1663a', '#8f4526'],
  },

  // --- MARBLE COLLECTION (RICH LUXURY MARBLES) ---
  {
    id: 'marble-01', category: 'marble-collection', code: 'GT-MB-1101', name: 'Makrana Pure White Marble Slab',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'white',
    colors: [{ name: 'Makrana White', hex: '#f0ebe0' }],
    finishes: ['Polished', 'Honed'], thickness: '18mm', stock: 118, material: 'Marble', rating: 4.7,
    price: 260, unit: 'sq.ft', designType: 'marble', veinColor: '#b8b2a3',
    description: 'Classic pristine white marble from Makrana with fine soft grey veins.',
    swatch: ['#f0ebe0', '#d8d0bd'],
  },
  {
    id: 'marble-02', category: 'marble-collection', code: 'GT-MB-1102', name: 'Italian Statuario Marble Slab',
    sizes: ['8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'marble-finish',
    colors: [{ name: 'Statuario White', hex: '#f5f5f7' }, { name: 'Charcoal Vein', hex: '#6b7280' }],
    finishes: ['Polished Mirror'], thickness: '20mm', stock: 84, material: 'Marble', rating: 4.9,
    price: 450, unit: 'sq.ft', designType: 'marble', veinColor: '#4b5563',
    description: 'Ultra-luxurious Italian Statuario marble with iconic dramatic grey veins over a snow-white surface.',
    swatch: ['#ffffff', '#9ca3af'],
  },
  {
    id: 'marble-03', category: 'marble-collection', code: 'GT-MB-1103', name: 'Calacatta Gold Italian Marble',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'gold',
    colors: [{ name: 'Calacatta Base', hex: '#faf7f2' }, { name: 'Gold Vein', hex: '#d97706' }],
    finishes: ['High Gloss Polished'], thickness: '18mm', stock: 65, material: 'Marble', rating: 4.9,
    price: 520, unit: 'sq.ft', designType: 'marble', veinColor: '#b45309',
    description: 'Rare Italian marble with warm amber-gold and soft pewter grey veining across an opaque ivory porcelain base.',
    swatch: ['#fef3c7', '#d97706'],
  },
  {
    id: 'marble-04', category: 'marble-collection', code: 'GT-MB-1104', name: 'Emperador Dark Spanish Marble',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'brown',
    colors: [{ name: 'Chocolate Dark', hex: '#3d251e' }, { name: 'Spider White Vein', hex: '#e5e7eb' }],
    finishes: ['Polished'], thickness: '18mm', stock: 92, material: 'Marble', rating: 4.8,
    price: 340, unit: 'sq.ft', designType: 'marble', veinColor: '#f3f4f6',
    description: 'Deep espresso dark brown marble with intricate fine white web-like veining.',
    swatch: ['#3d251e', '#1f130f'],
  },
  {
    id: 'marble-05', category: 'marble-collection', code: 'GT-MB-1105', name: 'Black Marquina Nero Marble Slab',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'black',
    colors: [{ name: 'Nero Black', hex: '#111827' }, { name: 'White Strike Vein', hex: '#ffffff' }],
    finishes: ['Polished Mirror', 'Leathered'], thickness: '18mm', stock: 110, material: 'Marble', rating: 4.8,
    price: 390, unit: 'sq.ft', designType: 'marble', veinColor: '#ffffff',
    description: 'Striking jet-black Spanish marble featuring bold white lightning-streak veins.',
    swatch: ['#111827', '#030712'],
  },
  {
    id: 'marble-06', category: 'marble-collection', code: 'GT-MB-1106', name: 'Royal Onyx Blue Translucent Marble',
    sizes: ['8x4 ft / 16mm'], sizeBucket: '8x4', colorFamily: 'blue',
    colors: [{ name: 'Onyx Blue', hex: '#1e3a8a' }, { name: 'Gold Wave', hex: '#f59e0b' }],
    finishes: ['Polished Backlit Capable'], thickness: '16mm', stock: 45, material: 'Marble', rating: 5.0,
    price: 680, unit: 'sq.ft', designType: 'marble', veinColor: '#fbbf24',
    description: 'Exotic blue onyx marble with swirling golden waves and translucent crystal layers.',
    swatch: ['#1e40af', '#0f172a'],
  },
  {
    id: 'marble-07', category: 'marble-collection', code: 'GT-MB-1107', name: 'Rose Pink Portuguese Marble',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'red',
    colors: [{ name: 'Rose Blush', hex: '#fbcfe8' }, { name: 'Burgundy Vein', hex: '#831843' }],
    finishes: ['Polished', 'Honed'], thickness: '18mm', stock: 78, material: 'Marble', rating: 4.6,
    price: 310, unit: 'sq.ft', designType: 'marble', veinColor: '#9d174d',
    description: 'Soft pastel rose pink marble with deep wine burgundy veining.',
    swatch: ['#fbcfe8', '#be185d'],
  },
  {
    id: 'marble-08', category: 'marble-collection', code: 'GT-MB-1108', name: 'Verde Guatemala Emerald Green Marble',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'green',
    colors: [{ name: 'Emerald Green', hex: '#064e3b' }, { name: 'Deep Jade', hex: '#022c22' }],
    finishes: ['Polished'], thickness: '18mm', stock: 52, material: 'Marble', rating: 4.7,
    price: 375, unit: 'sq.ft', designType: 'marble', veinColor: '#34d399',
    description: 'Deep royal forest green marble with intricate mint jade veining and high polish.',
    swatch: ['#064e3b', '#022c22'],
  },

  // --- GRANITE SLABS (DURABLE LUXURY GRANITES) ---
  {
    id: 'granite-01', category: 'granite-slabs', code: 'GT-GR-9001', name: 'Tan Brown Granite Slab',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'brown',
    colors: [{ name: 'Tan Brown', hex: '#8a5a34' }],
    finishes: ['Polished', 'Leathered'], thickness: '18mm', stock: 340, material: 'Granite', rating: 4.7,
    price: 185, unit: 'sq.ft', designType: 'granite',
    description: 'Premium South Indian granite with rich brown tones and black quartz speckling.',
    swatch: ['#8a5a34', '#5c3a1f'],
  },
  {
    id: 'granite-02', category: 'granite-slabs', code: 'GT-GR-9002', name: 'Black Galaxy Golden Fleck Granite',
    sizes: ['8x4 ft / 18mm', '8x4 ft / 20mm'], sizeBucket: '8x4', colorFamily: 'black',
    colors: [{ name: 'Black Galaxy', hex: '#1c1917' }],
    finishes: ['Polished Mirror', 'Leathered'], thickness: '18mm', stock: 156, material: 'Granite', rating: 4.9,
    price: 320, unit: 'sq.ft', designType: 'granite', speckleColor: '#f59e0b',
    description: 'Jet black granite studded with natural golden copper mica flakes that sparkle under lighting.',
    swatch: ['#1c1917', '#0c0a09'],
  },
  {
    id: 'granite-03', category: 'granite-slabs', code: 'GT-GR-9003', name: 'Kashmir White Burgundy Granite',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'white',
    colors: [{ name: 'Kashmir White', hex: '#e9e2d2' }],
    finishes: ['Polished', 'Honed'], thickness: '18mm', stock: 210, material: 'Granite', rating: 4.5,
    price: 210, unit: 'sq.ft', designType: 'granite', speckleColor: '#831843',
    description: 'Soft ivory white granite dotted with garnet burgundy specks and slate quartz waves.',
    swatch: ['#e9e2d2', '#c9bfa5'],
  },
  {
    id: 'granite-04', category: 'granite-slabs', code: 'GT-GR-9004', name: 'Imperial Red Indian Granite',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'red',
    colors: [{ name: 'Imperial Crimson Red', hex: '#991b1b' }],
    finishes: ['Polished', 'Flamed'], thickness: '18mm', stock: 130, material: 'Granite', rating: 4.6,
    price: 240, unit: 'sq.ft', designType: 'granite', speckleColor: '#000000',
    description: 'Vibrant crimson red granite with dense black and blue quartz mineral flecks.',
    swatch: ['#991b1b', '#450a0a'],
  },
  {
    id: 'granite-05', category: 'granite-slabs', code: 'GT-GR-9005', name: 'Absolute Jet Black Granite',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'black',
    colors: [{ name: 'Absolute Black', hex: '#0a0a0a' }],
    finishes: ['High Polish Mirror', 'Honed'], thickness: '18mm', stock: 290, material: 'Granite', rating: 4.9,
    price: 280, unit: 'sq.ft', designType: 'granite',
    description: 'Pure obsidian midnight black granite with zero veining — uniform luxury finish for counters.',
    swatch: ['#0f0f0f', '#000000'],
  },
  {
    id: 'granite-06', category: 'granite-slabs', code: 'GT-GR-9006', name: 'Colonial Gold Amber Granite',
    sizes: ['8x4 ft / 18mm'], sizeBucket: '8x4', colorFamily: 'gold',
    colors: [{ name: 'Colonial Gold', hex: '#d97706' }],
    finishes: ['Polished'], thickness: '18mm', stock: 88, material: 'Granite', rating: 4.7,
    price: 265, unit: 'sq.ft', designType: 'granite', speckleColor: '#78350f',
    description: 'Warm honey-amber granite with brown garnets and creamy quartz matrix.',
    swatch: ['#f59e0b', '#b45309'],
  },

  // --- DESIGNED & PATTERNED TILES (NEW DESIGNED COLLECTION) ---
  {
    id: 'des-01', category: 'designed-tiles', code: 'GT-DS-6001', name: 'Moroccan Vintage Star Encaustic Tile',
    sizes: ['200x200mm', '300x300mm'], sizeBucket: '1x1', colorFamily: 'patterned-finish',
    colors: [{ name: 'Cobalt Star', hex: '#1e3a8a' }, { name: 'Terracotta Red', hex: '#c1663a' }],
    finishes: ['Matte Encaustic'], thickness: '9mm', stock: 720, material: 'Encaustic', rating: 4.9,
    price: 95, unit: 'sq.ft', designType: 'moroccan',
    description: 'Intricate Mediterranean 8-point geometric star pattern encaustic tile for statement flooring and feature walls.',
    swatch: ['#1e3a8a', '#c1663a'],
  },
  {
    id: 'des-02', category: 'designed-tiles', code: 'GT-DS-6002', name: 'Geometric Hexagon Marble Mosaic Tile',
    sizes: ['300x300mm Sheet'], sizeBucket: '1x1', colorFamily: 'grey',
    colors: [{ name: 'White Hex', hex: '#f8fafc' }, { name: 'Nero Black Trim', hex: '#1e293b' }],
    finishes: ['Polished Satin'], thickness: '8mm', stock: 610, material: 'Porcelain', rating: 4.8,
    price: 110, unit: 'sq.ft', designType: 'hexagon',
    description: 'Modern 3D geometric honeycomb hexagon tile interlocked with black marble borders.',
    swatch: ['#e2e8f0', '#334155'],
  },
  {
    id: 'des-03', category: 'designed-tiles', code: 'GT-DS-6003', name: 'Terrazzo Venetian Composite Tile',
    sizes: ['600x600mm'], sizeBucket: '2x2', colorFamily: 'cream',
    colors: [{ name: 'Terrazzo Cream Base', hex: '#fef3c7' }],
    finishes: ['Polished Satin'], thickness: '10mm', stock: 850, material: 'Porcelain', rating: 4.7,
    price: 88, unit: 'sq.ft', designType: 'terrazzo',
    description: 'Trendy Venetian terrazzo tile with embedded multi-color marble chips of terracotta, emerald green, and cobalt.',
    swatch: ['#fef3c7', '#f59e0b'],
  },
  {
    id: 'des-04', category: 'designed-tiles', code: 'GT-DS-6004', name: 'Royal Gold Glass Mosaic Accent Tile',
    sizes: ['300x300mm Sheet'], sizeBucket: '1x1', colorFamily: 'gold',
    colors: [{ name: '24K Metallic Gold', hex: '#fbbf24' }, { name: 'Bronze', hex: '#78350f' }],
    finishes: ['High-Gloss Metallic Shimmer'], thickness: '6mm', stock: 430, material: 'Ceramic', rating: 4.9,
    price: 140, unit: 'sq.ft', designType: 'mosaic',
    description: 'Luxurious reflective square glass mosaic tile with gold leaf foil finish for accent walls and niches.',
    swatch: ['#fbbf24', '#d97706'],
  },
  {
    id: 'des-05', category: 'designed-tiles', code: 'GT-DS-6005', name: 'Heritage Blue & White Floral Rosette Tile',
    sizes: ['200x200mm'], sizeBucket: '1x1', colorFamily: 'blue',
    colors: [{ name: 'Royal Blue', hex: '#1d4ed8' }, { name: 'Porcelain White', hex: '#ffffff' }],
    finishes: ['Glossy Majolica'], thickness: '8mm', stock: 590, material: 'Ceramic', rating: 4.7,
    price: 92, unit: 'sq.ft', designType: 'moroccan',
    description: 'Traditional Spanish Majolica printed floral rosette tile ideal for kitchen backsplashes and bathroom walls.',
    swatch: ['#1d4ed8', '#eff6ff'],
  },

  // --- WOODEN FINISH TILES (NEW WOOD COLLECTION) ---
  {
    id: 'wood-01', category: 'wooden-tiles', code: 'GT-WD-4001', name: 'Nordic Natural Oak Plank Tile',
    sizes: ['200x1200mm'], sizeBucket: '2x4', colorFamily: 'wood-finish',
    colors: [{ name: 'Natural Oak', hex: '#d97706' }, { name: 'Honey Timber', hex: '#f59e0b' }],
    finishes: ['Wood Grain Matte'], thickness: '10mm', stock: 1100, material: 'Vitrified', rating: 4.8,
    price: 78, unit: 'sq.ft', designType: 'wood',
    description: 'Ultra-realistic hardwood timber plank tile with natural tree ring grain textures and warmth underfoot.',
    swatch: ['#d97706', '#92400e'],
  },
  {
    id: 'wood-02', category: 'wooden-tiles', code: 'GT-WD-4002', name: 'Smoked Walnut Hardwood Tile',
    sizes: ['200x1200mm'], sizeBucket: '2x4', colorFamily: 'brown',
    colors: [{ name: 'Smoked Walnut', hex: '#451a03' }],
    finishes: ['Satin Wood Touch'], thickness: '10mm', stock: 820, material: 'Vitrified', rating: 4.7,
    price: 85, unit: 'sq.ft', designType: 'wood',
    description: 'Deep espresso smoked walnut wood finish porcelain plank tile for modern rustic living spaces.',
    swatch: ['#451a03', '#78350f'],
  },

  // --- VITRIFIED TILES ---
  {
    id: 'vitrified-01', category: 'vitrified-tiles', code: 'GT-VT-7001', name: 'Carrara Marble-Look Vitrified Tile',
    sizes: ['600x1200mm', '800x1600mm'], sizeBucket: '4x4', colorFamily: 'marble-finish',
    colors: [{ name: 'Carrara White', hex: '#e9e6dd' }],
    finishes: ['Glossy', 'Polished'], thickness: '10mm', stock: 920, material: 'Vitrified', rating: 4.8,
    price: 89, unit: 'sq.ft', designType: 'marble', veinColor: '#9ca3af',
    description: 'Full-body vitrified tile with photo-realistic marble veining.',
    swatch: ['#ece8de', '#cac5b7'],
  },
  {
    id: 'vitrified-02', category: 'vitrified-tiles', code: 'GT-VT-7002', name: 'Graphite Double-Charge Vitrified Tile',
    sizes: ['600x600mm', '800x800mm'], sizeBucket: '2x2', colorFamily: 'black',
    colors: [{ name: 'Graphite', hex: '#37352f' }],
    finishes: ['Matte', 'Satin'], thickness: '10mm', stock: 640, material: 'Vitrified', rating: 4.5,
    price: 76, unit: 'sq.ft', designType: 'solid',
    description: 'Dense double-charge vitrified tile with a deep graphite tone.',
    swatch: ['#454339', '#242219'],
  },

  // --- CERAMIC & BATHROOM TILES ---
  {
    id: 'bath-01', category: 'bathroom-tiles', code: 'GT-BT-3001', name: 'Aqua Blue Anti-Skid Bathroom Tile',
    sizes: ['300x300mm'], sizeBucket: '1x1', colorFamily: 'blue',
    colors: [{ name: 'Aqua Blue', hex: '#a9c6c4' }],
    finishes: ['Anti-skid'], thickness: '8mm', stock: 1720, material: 'Ceramic', rating: 4.6,
    price: 41, unit: 'sq.ft', designType: 'solid',
    description: 'Water-resistant anti-skid tile with a cooling aqua blue tone.',
    swatch: ['#b7d3d1', '#8fb0ad'],
  },
  {
    id: 'bath-02', category: 'bathroom-tiles', code: 'GT-BT-3002', name: 'Mosaic Grey Shower Floor Tile',
    sizes: ['300x300mm'], sizeBucket: '1x1', colorFamily: 'grey',
    colors: [{ name: 'Mosaic Grey', hex: '#a3a29b' }],
    finishes: ['Anti-skid', 'Textured'], thickness: '8mm', stock: 430, material: 'Ceramic', rating: 4.3,
    price: 53, unit: 'sq.ft', designType: 'mosaic',
    description: 'Mosaic-pattern anti-skid tile ideal for shower floors.',
    swatch: ['#aeada4', '#716d63'],
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categoryKey) {
  return products.filter((p) => p.category === categoryKey)
}

export function filterProducts({ category, color, size, material, priceRange, minRating, sortBy } = {}) {
  let list = products.filter((p) => {
    if (category && category !== 'All' && p.category !== category) return false
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

  // Sorting logic
  if (sortBy) {
    list = [...list].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'rating-desc') return b.rating - a.rating
      if (sortBy === 'stock-desc') return b.stock - a.stock
      return 0
    })
  }

  return list
}
