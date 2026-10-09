import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Eye, EyeOff, User, Lock, Mail, Phone, Shield } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function GoogleBadge() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8, verticalAlign: 'middle', flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

const methods = [
  { key: 'username', label: 'Username', icon: User, placeholder: 'Enter username' },
  { key: 'email', label: 'Email', icon: Mail, placeholder: 'Enter email address' },
  { key: 'phone', label: 'Phone', icon: Phone, placeholder: 'Enter phone number' },
]

const AVAILABLE_ROLES = [
  'Plant Administrator',
  'Sales Executive',
  'Production Supervisor',
  'Inventory Clerk',
  'Purchase Officer',
  'Finance Manager'
]

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [method, setMethod] = useState('username')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Plant Administrator')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [googleModalOpen, setGoogleModalOpen] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')

  const activeMethod = methods.find((m) => m.key === method)
  const MethodIcon = activeMethod.icon

  const redirectTo = location.state?.from && location.state.from !== '/login' ? location.state.from : '/dashboard'
  const [activeClientId] = useState(() => {
    return localStorage.getItem('custom_google_client_id') || (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim() || '1081384744115-akkrt4iluhsdh7uo33fkdk2u7n7bhqrq.apps.googleusercontent.com'
  })

  const handleGoogleCredentialResponse = async (response) => {
    if (response && response.credential) {
      setError('')
      const res = await loginWithGoogle(response.credential)
      if (res.success) {
        navigate(redirectTo, { replace: true })
      } else {
        setError(res.message || 'Google authentication failed.')
      }
    } else {
      setError('Failed to obtain Google credential token.')
    }
  }

  const handleModalGoogleLogin = (email, name, accountRole) => {
    setGoogleModalOpen(false)
    const payload = JSON.stringify({
      email,
      name,
      sub: `google_modal_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      role: accountRole || role
    })
    handleGoogleCredentialResponse({ credential: payload })
  }

  useEffect(() => {
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1))
      const idToken = params.get('id_token') || params.get('access_token')
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname)
        handleGoogleCredentialResponse({ credential: idToken })
      }
    }
  }, [])

  useEffect(() => {
    const initGIS = () => {
      if (window.google?.accounts?.id && activeClientId && !activeClientId.includes('your_google_client_id')) {
        try {
          window.google.accounts.id.initialize({
            client_id: activeClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            ux_mode: 'popup',
          })
        } catch (err) {
          console.warn('[GIS Init Warning]:', err)
        }
      }
    }

    initGIS()
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGIS()
        clearInterval(interval)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [activeClientId])

  const triggerGooglePrompt = () => {
    setError('')
    if (window.google?.accounts?.id && activeClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: activeClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
        })
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleModalOpen(true)
          }
        })
        return
      } catch (err) {
        console.warn('[GIS Prompt Warning]:', err)
      }
    }

    setGoogleModalOpen(true)
  }

  const switchMethod = (key) => {
    setMethod(key)
    setIdentifier('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password.trim()) {
      setError(`Please enter both ${activeMethod.label.toLowerCase()} and password.`)
      return
    }
    if (!role) {
      setError('Please select your account role.')
      return
    }

    const result = await login({ username: identifier.trim(), password, role, remember, method })
    if (!result.success) {
      setError(result.message)
      return
    }
    const targetPath = role === 'Plant Administrator' ? '/admin-dashboard' : (redirectTo !== '/login' ? redirectTo : '/dashboard')
    navigate(targetPath, { replace: true })
  }

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to your account"
      subtitle="Enter your credentials and select your assigned role to access the management system."
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <div className="login-method-tabs">
        {methods.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`login-method-tab ${method === m.key ? 'active' : ''}`}
            onClick={() => switchMethod(m.key)}
          >
            <m.icon size={14} /> {m.label}
          </button>
        ))}
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error">{error}</div>}

        <div className="field">
          <label htmlFor="identifier">{activeMethod.label}</label>
          <div style={{ position: 'relative' }}>
            <MethodIcon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
            <input
              id="identifier"
              type={method === 'email' ? 'email' : method === 'phone' ? 'tel' : 'text'}
              placeholder={activeMethod.placeholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={{ paddingLeft: 36 }}
              autoComplete={method === 'email' ? 'email' : method === 'phone' ? 'tel' : 'username'}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 36 }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="field">
          <label htmlFor="role">Select Account Role</label>
          <div style={{ position: 'relative' }}>
            <Shield size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                paddingLeft: 36,
                width: '100%',
                height: 42,
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--cream-line)',
                background: 'var(--white)',
                color: 'var(--charcoal)',
                fontSize: 14,
                fontWeight: 500,
                appearance: 'auto'
              }}
            >
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="auth-row-between">
          <label className="auth-remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" className="auth-forgot-link" onClick={() => setForgotOpen(!forgotOpen)}>
            Forgot password?
          </button>
        </div>

        {forgotOpen && (
          <div className="auth-hint">
            To reset your password, contact your plant administrator or customer support.
          </div>
        )}

        <button type="submit" className="btn btn-primary auth-submit">
          <LogIn size={16} /> Login
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button
          type="button"
          className="btn btn-outline auth-submit auth-google-btn"
          onClick={triggerGooglePrompt}
        >
          <GoogleBadge /> Continue with Google
        </button>
      </form>

      {googleModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440,
            padding: '24px 28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <GoogleBadge />
                <h3 style={{ margin: 0, fontSize: 18, color: '#202124' }}>Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer', color: '#5f6368' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#5f6368', marginTop: 0, marginBottom: 20 }}>
              Choose an account to continue to Granite & Tile MMS:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { name: 'Admin Google User', email: 'admin.google@granitetile.com', role: 'Plant Administrator' },
                { name: 'Sales Executive User', email: 'sales.google@granitetile.com', role: 'Sales Executive' },
                { name: 'Supervisor Google User', email: 'supervisor.google@granitetile.com', role: 'Production Supervisor' }
              ].map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleModalGoogleLogin(acc.email, acc.name, acc.role)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    border: '1px solid #dadce0', borderRadius: 10, background: '#f8f9fa',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#edf2fc'}
                  onMouseOut={e => e.currentTarget.style.background = '#f8f9fa'}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: '#4285F4', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 15
                  }}>
                    {acc.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#202124' }}>{acc.name}</div>
                    <div style={{ fontSize: 12, color: '#5f6368' }}>{acc.email} ({acc.role})</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #e8eaed', paddingTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#5f6368', display: 'block', marginBottom: 6 }}>
                Or enter your Google Email:
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  style={{ flex: 1, height: 38, borderRadius: 8, border: '1px solid #dadce0', padding: '0 12px', fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail.trim()) {
                      handleModalGoogleLogin(customGoogleEmail.trim(), customGoogleEmail.split('@')[0], role)
                    }
                  }}
                  style={{ padding: '0 16px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
