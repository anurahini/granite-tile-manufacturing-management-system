import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, ArrowLeft, ShieldCheck, SendHorizonal, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const departments = ['Operations', 'Production', 'Sales', 'Finance', 'Warehouse', 'Quality', 'Administration']
const roles = ['Plant Administrator', 'Production Manager', 'Sales Executive', 'Inventory Clerk', 'Quality Inspector', 'Accounts Officer']

const initialForm = {
  fullName: '', employeeId: '', email: '', mobile: '',
  username: '', password: '', confirmPassword: '', department: '', role: '',
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ---- OTP verification state (frontend-only demo — no real SMS gateway) ----
  const [otpSent, setOtpSent] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    // If mobile number changes after OTP was already sent/verified, reset it
    if (key === 'mobile' && (otpSent || otpVerified)) {
      setOtpSent(false)
      setOtpVerified(false)
      setOtpValue('')
      setOtpInput('')
      setOtpError('')
    }
  }

  const handleSendOtp = () => {
    setOtpError('')
    if (!form.mobile.trim()) {
      setOtpError('Enter your mobile number first.')
      return
    }
    const code = generateOtp()
    setOtpValue(code)
    setOtpSent(true)
    setOtpVerified(false)
    setOtpInput('')
  }

  const handleVerifyOtp = () => {
    if (otpInput.trim() === otpValue) {
      setOtpVerified(true)
      setOtpError('')
    } else {
      setOtpError('Incorrect OTP. Please check and try again.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const required = ['fullName', 'employeeId', 'email', 'mobile', 'username', 'password', 'confirmPassword', 'department', 'role']
    const missing = required.some((key) => !form[key].trim())
    if (missing) {
      setError('Please fill in all fields before registering.')
      return
    }
    if (!otpVerified) {
      setError('Please verify your mobile number with OTP before registering.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password do not match.')
      return
    }

    const result = register({
      fullName: form.fullName.trim(),
      employeeId: form.employeeId.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      username: form.username.trim(),
      password: form.password,
      department: form.department,
      role: form.role,
    })

    if (!result.success) {
      setError(result.message)
      return
    }

    setSuccess('Account created successfully! Redirecting to login...')
    setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <AuthLayout
      eyebrow="Create Account"
      title="Register a new user"
      subtitle="Set up access for a new employee on the management system."
      footer={
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <div className="auth-form-row">
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" placeholder="e.g. Priya Natarajan" value={form.fullName} onChange={update('fullName')} />
          </div>
          <div className="field">
            <label htmlFor="employeeId">Employee ID</label>
            <input id="employeeId" type="text" placeholder="e.g. EMP-2109" value={form.employeeId} onChange={update('employeeId')} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@granitex.com" value={form.email} onChange={update('email')} autoComplete="email" />
        </div>

        {/* ---------- Mobile number + Send OTP ---------- */}
        <div className="field">
          <label htmlFor="mobile">Mobile Number</label>
          <div className="auth-otp-row">
            <input
              id="mobile" type="tel" placeholder="+91 98xxx xxxxx"
              value={form.mobile} onChange={update('mobile')} disabled={otpVerified}
            />
            <button
              type="button"
              className={`btn btn-sm ${otpVerified ? 'btn-ghost' : 'btn-dark'}`}
              onClick={handleSendOtp}
              disabled={otpVerified}
            >
              {otpVerified ? <><CheckCircle2 size={14} /> Verified</> : <><SendHorizonal size={14} /> {otpSent ? 'Resend OTP' : 'Send OTP'}</>}
            </button>
          </div>
        </div>

        {/* ---------- OTP verification UI ---------- */}
        {otpSent && !otpVerified && (
          <div className="auth-otp-panel">
            <div className="auth-otp-panel-label"><ShieldCheck size={14} /> Enter the 6-digit OTP sent to your mobile</div>
            <div className="auth-otp-row">
              <input
                type="text" maxLength={6} placeholder="Enter OTP"
                value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              />
              <button type="button" className="btn btn-primary btn-sm" onClick={handleVerifyOtp}>Verify OTP</button>
            </div>
            {otpError && <div className="auth-error" style={{ marginTop: 8 }}>{otpError}</div>}
            <div className="auth-hint" style={{ marginTop: 8 }}>
              Demo mode — no real SMS is sent. Your OTP is <b>{otpValue}</b>.
            </div>
          </div>
        )}
        {otpVerified && (
          <div className="auth-success" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={15} /> Mobile number verified successfully.
          </div>
        )}

        <div className="auth-form-row">
          <div className="field">
            <label htmlFor="department">Department</label>
            <select id="department" value={form.department} onChange={update('department')}>
              <option value="" disabled>Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" value={form.role} onChange={update('role')}>
              <option value="" disabled>Select role</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input id="reg-username" type="text" placeholder="Choose a username" value={form.username} onChange={update('username')} autoComplete="username" />
        </div>

        <div className="auth-form-row">
          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" placeholder="At least 6 characters" value={form.password} onChange={update('password')} autoComplete="new-password" />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary auth-submit">
          <UserPlus size={16} /> Register
        </button>
      </form>
    </AuthLayout>
  )
}
