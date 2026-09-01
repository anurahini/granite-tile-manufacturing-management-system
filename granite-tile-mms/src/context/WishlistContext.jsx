import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'gtmms_wishlist'

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items))
  }, [items])

  const isWishlisted = (id) => items.includes(id)

  const toggleWishlist = (id) => {
    setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const removeFromWishlist = (id) => setItems((prev) => prev.filter((x) => x !== id))

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a <WishlistProvider>')
  return ctx
}
