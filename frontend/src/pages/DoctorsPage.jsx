import { useState, useEffect } from 'react'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', specialization: '', department: '', phone: '', status: 'On Duty'
  })

  useEffect(() => { loadDoctors() }, [])

  const loadDoctors = async () => {
    const res = await fetch('http://localhost:3000/api/doctors')
    const data = await res.json()
    setDoctors(data.data)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { alert('Name සහ Phone අනිවාර්යයි!'); return }
    await fetch('http://localhost:3000/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    setForm({ name: '', specialization: '', department: '', phone: '', status: 'On Duty' })
    loadDoctors()
  }

  const handleDelete = async (id) => {
    if (!confirm('මේ doctor delete කරන්නද?')) return
    await fetch(`http://localhost:3000/api/doctors/${id}`, { method: 'DELETE' })
    loadDoctors()
  }

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (s) => {
    if (s === 'On Duty')  return { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.3)' }
    if (s === 'Off Duty') return { bg: 'rgba(239,68,68,0.15)',   text: '#f87171', border: 'rgba(239,68,68,0.3)' }
    return { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Doctors</h1>
          <p className="text-sm mt-1" style={{color: '#64748b'}}>Total: {doctors.length}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
          + Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full text-sm px-4 py-3 rounded-xl text-white outline-none"
          style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
          placeholder="🔍 Search by name, specialization or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
              {['Name', 'Specialization', 'Department', 'Phone', 'Status', ''].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-medium uppercase tracking-wider" style={{color: '#64748b'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12" style={{color: '#475569'}}>
                {search ? 'No results found' : 'No doctors yet!'}
              </td></tr>
            ) : (
              filtered.map((d) => {
                const sc = statusColor(d.status)
                return (
                  <tr key={d._id} className="transition-all" style={{borderBottom: '1px solid rgba(255,255,255,0.04)'}}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4 text-sm font-medium text-white">{d.name}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{d.specialization}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{d.department}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{d.phone}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`
                      }}>{d.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(d._id)}
                        className="text-xs px-3 py-1 rounded-lg transition-all"
                        style={{background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)'}}>
                        Delete
                      </button>
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
            <h3 className="font-bold text-white text-lg mb-5">Add New Doctor</h3>
            <div className="space-y-3">
              {[
                { placeholder: 'Full Name', key: 'name' },
                { placeholder: 'Specialization', key: 'specialization' },
                { placeholder: 'Department', key: 'department' },
                { placeholder: 'Phone', key: 'phone' },
              ].map(f => (
                <input key={f.key} type="text"
                  className="w-full text-sm px-4 py-2.5 rounded-xl text-white outline-none"
                  style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)'}}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                />
              ))}
              <select className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}
                value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option>On Duty</option>
                <option>Off Duty</option>
                <option>On Leave</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}>
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow">
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}