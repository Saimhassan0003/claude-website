import { useState } from 'react'
import styles from './AuthPage.module.css'
import Navbar from './Navbar'

const AuthPage = ({ onBack, onForCorporates, onAuthSuccess }) => {
    const [tab, setTab] = useState('login') // 'login' | 'signup'
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

    const handleSubmit = (e) => {
      e.preventDefault()
      setError('')
      if (tab === 'signup') {
        if (!form.name.trim()) return setError('Please enter your full name.')
        if (form.password !== form.confirm) return setError('Passwords do not match.')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(form.email.trim())) return setError('Please enter a valid email address.')
      if (form.password.length < 6) return setError('Password must be at least 6 characters.')
      
      // Simulate network request for security obscurity
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        onAuthSuccess?.()
      }, 800)
    }

  return (
    <div className={styles.page}>
      <Navbar
        isHR={false}
        screenInfo={null}
        onHome={onBack}
        onForCorporates={onForCorporates}
      />

      <div className={styles.center}>
        {/* Logo mark */}
        <div className={styles.logoMark}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C12 3 7 7 7 12c0 3.5 2.5 5 5 5s5-1.5 5-5c0-5-5-9-5-9Z" fill="none" stroke="#C9963A" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M12 17c0 0-7-1-8-5-.5-3 2-5 5-4" fill="none" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" opacity=".6"/>
            <path d="M12 17c0 0 7-1 8-5 .5-3-2-5-5-4" fill="none" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" opacity=".6"/>
            <circle cx="12" cy="17" r="1.4" fill="#C9963A"/>
          </svg>
          <span className={styles.logoTxt}><span className={styles.seh}>SEH</span><span className={styles.atti}>ATTI</span></span>
        </div>

        {/* Card */}
        <div className={styles.card}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
              onClick={() => { setTab('login'); setError('') }}
            >Login</button>
            <button
              className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
              onClick={() => { setTab('signup'); setError('') }}
            >Sign Up</button>
          </div>

          <h2 className={styles.heading}>
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className={styles.subheading}>
            {tab === 'login'
              ? 'Sign in to access your wellbeing report.'
              : 'Join the GCC Workplace Wellbeing initiative.'}
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
              />
            </div>

            {tab === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitBtn} type="submit" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : (tab === 'login' ? 'Sign In →' : 'Create Account →')}
            </button>
          </form>

          <p className={styles.switchLine}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className={styles.switchBtn}
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError('') }}
            >
              {tab === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        {/* Trust line */}
        <p className={styles.trust}>survey.sehatti.com · Secure · 100% Confidential · Data never sold</p>
      </div>
    </div>
  )
}

export default AuthPage
