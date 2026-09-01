export const clearanceItems = [
  {
    id: 'clr-01', name: 'Alpine Grey Vitrified Tile — Edge Chipped', category: 'Floor Tiles',
    damagePercent: 15, damageType: 'Corner Damage', originalPrice: 62, discountedPrice: 45, stock: 320, unit: 'sq.ft',
    note: 'Minor edge chipping on a small percentage of pieces — fully usable for cut/border areas.',
    swatch: ['#a8a89c', '#7b7a6f'],
  },
  {
    id: 'clr-02', name: 'Black Galaxy Granite — Corner Damage', category: 'Granite Slabs',
    damagePercent: 8, damageType: 'Corner Damage', originalPrice: 320, discountedPrice: 255, stock: 14, unit: 'sq.ft',
    note: 'Slight corner damage on select slabs from transit — ideal for smaller countertop cuts.',
    swatch: ['#2b2b2b', '#0e0e0e'],
  },
  {
    id: 'clr-03', name: 'Ivory Gloss Wall Tile — Batch Overrun', category: 'Wall Tiles',
    damagePercent: 5, damageType: 'Packaging Damage', originalPrice: 38, discountedPrice: 26, stock: 640, unit: 'sq.ft',
    note: 'Excess production batch, not damaged — discounted purely to clear warehouse space.',
    swatch: ['#f2ead9', '#d8c9a8'],
  },
  {
    id: 'clr-04', name: 'Rustic Brown Outdoor Tile — Surface Scuff', category: 'Outdoor Tiles',
    damagePercent: 20, damageType: 'Surface Scratch', originalPrice: 55, discountedPrice: 34, stock: 180, unit: 'sq.ft',
    note: 'Light surface scuffing from handling — cosmetic only, does not affect anti-skid performance.',
    swatch: ['#9a6a3e', '#6c4726'],
  },
  {
    id: 'clr-05', name: 'Kashmir White Granite — Discontinued Lot', category: 'Granite Slabs',
    damagePercent: 0, damageType: 'Packaging Damage', originalPrice: 210, discountedPrice: 168, stock: 22, unit: 'sq.ft',
    note: 'Final lot from a discontinued quarry batch — undamaged, priced to clear remaining stock.',
    swatch: ['#e9e2d2', '#c9bfa5'],
  },
  {
    id: 'clr-06', name: 'Mosaic Grey Bathroom Tile — Glaze Variation', category: 'Bathroom Tiles',
    damagePercent: 10, damageType: 'Minor Crack', originalPrice: 53, discountedPrice: 39, stock: 260, unit: 'sq.ft',
    note: 'Slight glaze shade variation between pieces — recommended for single-room use.',
    swatch: ['#aeada4', '#716d63'],
  },
]

export function getDiscountPercent(item) {
  return Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)
}
