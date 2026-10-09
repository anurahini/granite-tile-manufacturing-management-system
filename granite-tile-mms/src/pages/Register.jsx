import { useState, useEffect } from 'react'
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

export default function Register() {
  const { register, sendOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ---- OTP verification state connected to backend ----
  const [otpSent, setOtpSent] = useState(false)
  const [otpInput, setOtpInput] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval = null
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [timer])

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (key === 'mobile' && (otpSent || otpVerified)) {
      setOtpSent(false)
      setOtpVerified(false)
      setOtpInput('')
      setOtpError('')
      setDemoOtp('')
      setTimer(0)
    }
  }

  const handleSendOtp = async () => {
    setOtpError('')
    if (!form.mobile.trim()) {
      setOtpError('Enter your mobile number first.')
      return
    }
    const res = await sendOtp(form.mobile.trim())
    if (res.success) {
      setOtpSent(true)
      setOtpVerified(false)
      setOtpInput('')
      setTimer(30)
      if (res.otp) {
        setDemoOtp(res.otp)
      } else {
        setDemoOtp('')
      }
    } else {
      setOtpError(res.message || 'Failed to send OTP')
    }
  }

  const handleVerifyOtp = async () => {
    setOtpError('')
    if (!otpInput.trim()) {
      setOtpError('Please enter the 6-digit OTP.')
      return
    }
    const res = await verifyOtp(form.mobile.trim(), otpInput.trim())
    if (res.success) {
      setOtpVerified(true)
      setOtpError('')
    } else {
      setOtpError(res.message || 'Incorrect or expired OTP. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
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

    const result = await register({
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
              disabled={otpVerified || timer > 0}
            >
              {otpVerified ? (
                <><CheckCircle2 size={14} /> Verified</>
              ) : timer > 0 ? (
                `Resend (${timer}s)`
              ) : (
                <><SendHorizonal size={14} /> {otpSent ? 'Resend OTP' : 'Send OTP'}</>
              )}
            </button>
          </div>
        </div>

        {/* ---------- OTP verification UI ---------- */}
        {otpSent && !otpVerified && (
          <div className="auth-otp-panel">
            <div className="auth-otp-panel-label"><ShieldCheck size={14} /> Enter the 6-digit OTP sent to your mobile</div>

            {demoOtp && (
              <div style={{
                margin: '10px 0',
                padding: '10px 14px',
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
                color: '#92400e',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>
                  <strong>Demo / Testing OTP:</strong> <code style={{ fontSize: '15px', fontWeight: 'bold', background: '#fff', padding: '2px 8px', borderRadius: '4px', letterSpacing: '2px', color: '#b45309' }}>{demoOtp}</code>
                  <span style={{ fontSize: '11px', display: 'block', opacity: 0.85, marginTop: '2px' }}>
                    (Twilio credentials pending in backend/.env &mdash; use code <strong>{demoOtp}</strong> or <strong>123456</strong>)
                  </span>
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-dark"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => setOtpInput(demoOtp)}
                >
                  Auto-fill OTP
                </button>
              </div>
            )}

            <div className="auth-otp-row">
              <input
                type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                value={otpInput} onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
              />
              <button type="button" className="btn btn-primary btn-sm" onClick={handleVerifyOtp}>Verify OTP</button>
            </div>
            {otpError && <div className="auth-error" style={{ marginTop: 8 }}>{otpError}</div>}
            <div className="auth-hint" style={{ marginTop: 8 }}>
              A 6-digit verification code has been sent via SMS or generated for testing (valid for 5 minutes).
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
            <input id="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} autoComplete="new-password" onChange={update('confirmPassword')} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary auth-submit">
          <UserPlus size={16} /> Register
        </button>
      </form>
    </AuthLayout>
  )
}
