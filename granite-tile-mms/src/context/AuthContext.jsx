import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/index.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'gtmms_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  const login = async ({ username, password, role, remember, method = 'username' }) => {
    try {
      const res = await api.post('/auth/login', { username, password, role, method })
      if (!res.success) {
        return { success: false, message: res.message || 'Login failed.' }
      }
      const sessionUser = { ...res.user, token: res.token }
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
        sessionStorage.removeItem(SESSION_KEY)
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
        localStorage.removeItem(SESSION_KEY)
      }
      setUser(sessionUser)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message || 'Unable to connect to server.' }
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data)
      if (!res.success) {
        return { success: false, message: res.message || 'Registration failed.' }
      }
      return { success: true, message: res.message }
    } catch (err) {
      return { success: false, message: err.message || 'Unable to connect to server.' }
    }
  }

  const sendOtp = async (mobile) => {
    return await api.post('/auth/send-otp', { mobile })
  }

  const verifyOtp = async (mobile, otp) => {
    return await api.post('/auth/verify-otp', { mobile, otp })
  }

  const loginWithGoogle = async (credential) => {
    try {
      const res = await api.post('/auth/google', { credential })
      if (!res.success) {
        return { success: false, message: res.message || 'Google login failed.' }
      }
      const sessionUser = { ...res.user, token: res.token }
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
      setUser(sessionUser)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message || 'Unable to connect to server.' }
    }
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
    loginWithGoogle,
    register,
    sendOtp,
    verifyOtp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>')
  return ctx
}

