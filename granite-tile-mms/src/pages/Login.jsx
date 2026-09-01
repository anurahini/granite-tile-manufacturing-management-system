import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Eye, EyeOff, User, Lock, Mail, Phone } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Pure-CSS "G" badge (no SVG) — a decorative stand-in for a Google button,
// since this is a frontend-only demo with no real OAuth provider connected.
function GoogleBadge() {
  return <span className="google-g-badge">G</span>
}

const methods = [
  { key: 'username', label: 'Username', icon: User, placeholder: 'e.g. admin', demo: 'admin' },
  { key: 'email', label: 'Email', icon: Mail, placeholder: 'you@granitex.com', demo: 'ramesh.s@granitex.com' },
  { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+91 98xxx xxxxx', demo: '+91 98400 12345' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [method, setMethod] = useState('username')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)

  const activeMethod = methods.find((m) => m.key === method)
  const MethodIcon = activeMethod.icon

  const redirectTo = location.state?.from && location.state.from !== '/login' ? location.state.from : '/dashboard'

  const switchMethod = (key) => {
    setMethod(key)
    setIdentifier('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password.trim()) {
      setError(`Please enter both ${activeMethod.label.toLowerCase()} and password.`)
      return
    }
    const result = login({ username: identifier.trim(), password, remember, method })
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Sign in to your account"
      subtitle="Enter your credentials to access the management system."
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
            This is a frontend-only demo, so password reset emails aren&apos;t actually sent.
            Use the demo account below, or register a new account.
          </div>
        )}

        <button type="submit" className="btn btn-primary auth-submit">
          <LogIn size={16} /> Login
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button
          type="button"
          className="btn btn-outline auth-submit auth-google-btn"
          onClick={() => setError('Google Sign-In is a demo UI only — no real OAuth backend is connected in this project.')}
        >
          <GoogleBadge /> Login with Google
        </button>

        <div className="auth-demo-note">Demo login — {activeMethod.label.toLowerCase()}: {activeMethod.demo} · password: admin123</div>
      </form>
    </AuthLayout>
  )
}
