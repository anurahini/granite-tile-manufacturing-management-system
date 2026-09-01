import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'gtmms_users'
const SESSION_KEY = 'gtmms_session'

// Seed a default demo account on first run so the login page is usable
// immediately, without any backend or API.
function seedUsers() {
  const existing = localStorage.getItem(USERS_KEY)
  if (!existing) {
    const defaultUsers = [
      {
        fullName: 'Ramesh Sundaram',
        employeeId: 'EMP-2001',
        email: 'ramesh.s@granitex.com',
        mobile: '+91 98400 12345',
        username: 'admin',
        password: 'admin123',
        department: 'Operations',
        role: 'Plant Administrator',
      },
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
  }
}

function getUsers() {
  seedUsers()
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedUsers()
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        /* corrupt session, ignore */
      }
    }
    setLoading(false)
  }, [])

  const login = ({ username, password, remember, method = 'username' }) => {
    const users = getUsers()
    const identifier = String(username).toLowerCase().trim()
    const match = users.find((u) => {
      if (u.password !== password) return false
      if (method === 'email') return u.email.toLowerCase() === identifier
      if (method === 'phone') return u.mobile.replace(/\s+/g, '') === identifier.replace(/\s+/g, '')
      return u.username.toLowerCase() === identifier
    })
    if (!match) {
      const label = method === 'email' ? 'email' : method === 'phone' ? 'mobile number' : 'username'
      return { success: false, message: `Invalid ${label} or password.` }
    }
    const sessionUser = {
      fullName: match.fullName,
      username: match.username,
      role: match.role,
      department: match.department,
      employeeId: match.employeeId,
    }
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      sessionStorage.removeItem(SESSION_KEY)
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      localStorage.removeItem(SESSION_KEY)
    }
    setUser(sessionUser)
    return { success: true }
  }

  const register = (data) => {
    const users = getUsers()
    const usernameTaken = users.some(
      (u) => u.username.toLowerCase() === String(data.username).toLowerCase()
    )
    if (usernameTaken) {
      return { success: false, message: 'That username is already registered.' }
    }
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === String(data.email).toLowerCase()
    )
    if (emailTaken) {
      return { success: false, message: 'An account with this email already exists.' }
    }
    users.push(data)
    saveUsers(users)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>')
  return ctx
}
