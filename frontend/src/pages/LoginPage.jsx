import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (form.email === 'admin@hospital.lk' && form.password === 'admin123') {
      localStorage.setItem('hms_user', JSON.stringify({ name: 'Admin', role: 'admin' }))
      navigate('/dashboard')
    } else {
      setError('Email හෝ Password වැරදියි!')
    }
    setLoading(false)
  }

  const FloatingIcon = ({ emoji, style }) => (
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: 'easeInOut' }}
      style={{ position: 'absolute', fontSize: 28, opacity: 0.15, pointerEvents: 'none', ...style }}
    >
      {emoji}
    </motion.div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 30% 20%, #1e3a5f 0%, #0f172a 50%, #1a0a2e 100%)'
    }}>
      {/* Animated background circles */}
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4 }}
        style={{ position: 'fixed', top: '10%', left: '15%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)',
          filter: 'blur(40px)', pointerEvents: 'none' }} />

      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1 }}
        style={{ position: 'fixed', bottom: '10%', right: '10%', width: 350, height: 350,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
          filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Floating medical icons */}
      <FloatingIcon emoji="💊" style={{ top: '15%', left: '10%' }} />
      <FloatingIcon emoji="🩺" style={{ top: '25%', right: '12%' }} />
      <FloatingIcon emoji="🏥" style={{ bottom: '20%', left: '8%' }} />
      <FloatingIcon emoji="💉" style={{ bottom: '30%', right: '8%' }} />
      <FloatingIcon emoji="🩻" style={{ top: '60%', left: '20%' }} />
      <FloatingIcon emoji="❤️" style={{ top: '10%', right: '25%' }} />

      {/* Login Card */}
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10" style={{
          background: 'linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28,
          padding: 40,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.05)'
        }}>

        {/* Logo */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center gap-3 mb-8">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 30px rgba(16,185,129,0.6)' }}>
            🏥
          </motion.div>
          <div>
            <p className="font-bold text-white text-lg">MediCore HMS</p>
            <p className="text-xs" style={{ color: '#64748b' }}>Hospital Management System</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>Sign in to your account</p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-4">
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: '#94a3b8' }}>Email Address</label>
            <motion.input whileFocus={{ scale: 1.01 }}
              type="email"
              className="w-full text-sm px-4 py-3 rounded-xl text-white outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="admin@hospital.lk"
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setError('') }}
            />
          </div>
          <div>
            <label className="text-xs mb-1.5 block font-medium" style={{ color: '#94a3b8' }}>Password</label>
            <motion.input whileFocus={{ scale: 1.01 }}
              type="password"
              className="w-full text-sm px-4 py-3 rounded-xl text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              placeholder="••••••••"
              value={form.password}
              onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogin} disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white mt-6 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }}>
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
              Logging in...
            </>
          ) : (
            <>🔐 Login to Dashboard</>
          )}
        </motion.button>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: '👥', label: 'Patients', val: 'Manage' },
            { icon: '👨‍⚕️', label: 'Doctors', val: 'Track' },
            { icon: '💊', label: 'Billing', val: 'Monitor' },
          ].map(item => (
            <div key={item.label} className="text-center py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs font-medium text-white">{item.label}</div>
              <div className="text-xs" style={{ color: '#475569' }}>{item.val}</div>
            </div>
          ))}
        </motion.div>

        {/* Hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-5 text-xs text-center rounded-xl py-3 px-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: '#334155' }}>
          admin@hospital.lk &nbsp;|&nbsp; admin123
        </motion.div>
      </motion.div>
    </div>
  )
}