import { useState, useEffect } from 'react'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    patient: '', doctor: '', date: '', timeSlot: '', status: 'Pending', notes: ''
  })

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [a, p, d] = await Promise.all([
      fetch('http://localhost:3000/api/appointments').then(r => r.json()),
      fetch('http://localhost:3000/api/patients').then(r => r.json()),
      fetch('http://localhost:3000/api/doctors').then(r => r.json()),
    ])
    setAppointments(a.data)
    setPatients(p.data)
    setDoctors(d.data)
  }

  const handleSubmit = async () => {
    if (!form.patient || !form.doctor || !form.date || !form.timeSlot) {
      alert('සියලු fields fill කරන්න!'); return
    }
    await fetch('http://localhost:3000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    setForm({ patient: '', doctor: '', date: '', timeSlot: '', status: 'Pending', notes: '' })
    loadAll()
  }

  const statusColor = (s) => {
    if (s === 'Confirmed')  return { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.3)' }
    if (s === 'Pending')    return { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.3)' }
    if (s === 'Completed')  return { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.3)' }
    return { bg: 'rgba(239,68,68,0.15)', text: '#f87171', border: 'rgba(239,68,68,0.3)' }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Appointments</h1>
          <p className="text-sm mt-1" style={{color: '#64748b'}}>Manage appointments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
          + New Appointment
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(145deg, #1e293b, #162032)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <table className="w-full">
          <thead>
            <tr style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}>
              {['Patient', 'Doctor', 'Date', 'Time', 'Status'].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-medium uppercase tracking-wider" style={{color: '#64748b'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12" style={{color: '#475569'}}>No appointments yet!</td></tr>
            ) : (
              appointments.map((a) => {
                const sc = statusColor(a.status)
                return (
                  <tr key={a._id} className="transition-all" style={{borderBottom: '1px solid rgba(255,255,255,0.04)'}}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4 text-sm font-medium text-white">{a.patient?.name}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{a.doctor?.name}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{a.timeSlot}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`
                      }}>{a.status}</span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)'}}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{
            background: 'linear-gradient(145deg, #1e293b, #162032)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>
            <h3 className="font-bold text-white text-lg mb-5">New Appointment</h3>
            <div className="space-y-3">
              <select className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}
                value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <select className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}
                value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}>
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <input type="date"
                className="w-full text-sm px-4 py-2.5 rounded-xl text-white outline-none"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              <input
                className="w-full text-sm px-4 py-2.5 rounded-xl text-white outline-none"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                placeholder="Time (e.g. 09:00 AM)"
                value={form.timeSlot} onChange={e => setForm({...form, timeSlot: e.target.value})} />
              <select className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}
                value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <input
                className="w-full text-sm px-4 py-2.5 rounded-xl text-white outline-none"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                placeholder="Notes (optional)"
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}>
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}