import { createContext, useContext, useState } from 'react'

const CompareContext = createContext(null)
const MAX_COMPARE = 4

export function CompareProvider({ children }) {
  const [selected, setSelected] = useState([])

  const toggleCompare = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }

  const clearCompare = () => setSelected([])
  const isSelected = (id) => selected.includes(id)

  return (
    <CompareContext.Provider value={{ selected, toggleCompare, clearCompare, isSelected, maxCompare: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within a <CompareProvider>')
  return ctx
}
