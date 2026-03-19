import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }

export default function DashboardPage() {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, bills: 0 })
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])

  useEffect(() => { loadStats() }, [])

  const loadStats = async () => {
    const [p, d, a, b] = await Promise.all([
      fetch('http://localhost:3000/api/patients').then(r => r.json()),
      fetch('http://localhost:3000/api/doctors').then(r => r.json()),
      fetch('http://localhost:3000/api/appointments').then(r => r.json()),
      fetch('http://localhost:3000/api/billing').then(r => r.json()),
    ])
    setStats({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length, bills: b.data.length })
    setBills(b.data)
    setPatients(p.data)
  }

  const billingData = [
    { name: 'Paid',    value: bills.filter(b => b.status === 'Paid').length,    color: '#10b981' },
    { name: 'Pending', value: bills.filter(b => b.status === 'Pending').length, color: '#f59e0b' },
    { name: 'Partial', value: bills.filter(b => b.status === 'Partial').length, color: '#6366f1' },
  ]

  const patientData = [
    { name: 'Outpatient', value: patients.filter(p => p.status === 'Outpatient').length, color: '#10b981' },
    { name: 'Admitted',   value: patients.filter(p => p.status === 'Admitted').length,   color: '#f59e0b' },
    { name: 'Critical',   value: patients.filter(p => p.status === 'Critical').length,   color: '#ef4444' },
    { name: 'Discharged', value: patients.filter(p => p.status === 'Discharged').length, color: '#6366f1' },
  ]

  const barData = [
    { name: 'Patients',     value: stats.patients },
    { name: 'Doctors',      value: stats.doctors },
    { name: 'Appointments', value: stats.appointments },
    { name: 'Bills',        value: stats.bills },
  ]

  const cards = [
    { label: 'Total Patients',  value: stats.patients,     icon: '🧑‍⚕️', color: 'from-blue-600 to-blue-800',    glow: 'rgba(59,130,246,0.3)' },
    { label: 'Active Doctors',  value: stats.doctors,      icon: '👨‍⚕️', color: 'from-emerald-500 to-emerald-700', glow: 'rgba(16,185,129,0.3)' },
    { label: 'Appointments',    value: stats.appointments, icon: '📋', color: 'from-purple-500 to-purple-700',  glow: 'rgba(139,92,246,0.3)' },
    { label: 'Total Bills',     value: stats.bills,        icon: '💳', color: 'from-orange-500 to-orange-700',  glow: 'rgba(249,115,22,0.3)' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px'}}>
          <p style={{color: '#94a3b8', fontSize: 12}}>{label}</p>
          <p style={{color: '#10b981', fontWeight: 'bold'}}>{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* Header */}
      <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{color: '#64748b'}}>Welcome back, Admin 👋</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <motion.div key={card.label} variants={fadeUp} whileHover={{ scale: 1.04, y: -4 }} transition={{ type: 'spring', stiffness: 300 }}
            className="stat-card rounded-2xl p-5 cursor-pointer relative overflow-hidden">
            {/* Glow bg */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 100, height: 100, borderRadius: '50%',
              background: card.glow, filter: 'blur(30px)', pointerEvents: 'none'
            }} />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-sm" style={{color: '#64748b'}}>{card.label}</p>
            <p className="text-4xl font-bold text-white mt-1">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-5 mb-5">

        {/* Bar Chart */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5" style={{
          background: 'linear-gradient(145deg, #1e293b, #162032)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p className="text-white font-semibold mb-1">📊 Hospital Overview</p>
          <p className="text-xs mb-4" style={{color:'#475569'}}>All departments</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10b981" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5" style={{
          background: 'linear-gradient(145deg, #1e293b, #162032)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p className="text-white font-semibold mb-1">💰 Billing Status</p>
          <p className="text-xs mb-4" style={{color:'#475569'}}>Invoice breakdown</p>
          {bills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48" style={{color: '#475569'}}>
              <span className="text-4xl mb-3">🧾</span>
              <p className="text-sm">No billing data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={billingData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {billingData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {billingData.map(d => (
                  <div key={d.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{background: d.color}} />
                    <span className="text-xs" style={{color: '#94a3b8'}}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Patient Status Chart */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="rounded-2xl p-5 mb-5" style={{
        background: 'linear-gradient(145deg, #1e293b, #162032)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <p className="text-white font-semibold mb-1">🏥 Patient Status</p>
        <p className="text-xs mb-4" style={{color:'#475569'}}>Current patient breakdown</p>
        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32" style={{color: '#475569'}}>
            <span className="text-4xl mb-3">🧑‍⚕️</span>
            <p className="text-sm">No patient data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={patientData}>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {patientData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Welcome Banner */}
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.4}}
        className="card-3d rounded-2xl p-8 text-center relative overflow-hidden">
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 200,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-6xl mb-4">
          🏥
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">MediCore HMS</h2>
        <p className="text-sm mb-4" style={{color:'#64748b'}}>Complete Hospital Management Solution</p>
        <div className="flex justify-center gap-3">
          {['✅ System Online', '🔒 Secure', '⚡ Fast', '📊 Analytics'].map(tag => (
            <motion.div key={tag} whileHover={{scale:1.05}} className="text-xs px-3 py-1 rounded-full"
              style={{background:'rgba(16,185,129,0.1)', color:'#34d399', border:'1px solid rgba(16,185,129,0.2)'}}>
              {tag}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}