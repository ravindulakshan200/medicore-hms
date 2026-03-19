import { useState, useEffect } from 'react'

export default function BillingPage() {
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    patient: '', amount: '', services: '', status: 'Pending', paidAmount: 0
  })

  useEffect(() => { loadAll() }, [])

  const loadAll = async () => {
    const [b, p] = await Promise.all([
      fetch('http://localhost:3000/api/billing').then(r => r.json()),
      fetch('http://localhost:3000/api/patients').then(r => r.json()),
    ])
    setBills(b.data)
    setPatients(p.data)
  }

  const handleSubmit = async () => {
    if (!form.patient || !form.amount || !form.services) {
      alert('සියලු fields fill කරන්න!'); return
    }
    await fetch('http://localhost:3000/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setShowForm(false)
    setForm({ patient: '', amount: '', services: '', status: 'Pending', paidAmount: 0 })
    loadAll()
  }

  const handleDelete = async (id) => {
    if (!confirm('මේ bill delete කරන්නද?')) return
    await fetch(`http://localhost:3000/api/billing/${id}`, { method: 'DELETE' })
    loadAll()
  }

  const handlePrint = (b) => {
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${b.patient?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
            .logo { font-size: 28px; font-weight: bold; color: #10b981; }
            .sub { color: #64748b; font-size: 14px; }
            .info { display: flex; justify-content: space-between; margin: 20px 0; }
            .info-box { background: #f8fafc; padding: 15px; border-radius: 8px; width: 45%; }
            .label { font-size: 11px; color: #64748b; text-transform: uppercase; }
            .value { font-size: 15px; font-weight: bold; margin-top: 3px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; color: #64748b; }
            td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .total { text-align: right; font-size: 20px; font-weight: bold; color: #10b981; margin-top: 20px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .paid { background: #dcfce7; color: #16a34a; }
            .pending { background: #fef9c3; color: #ca8a04; }
            .footer { text-align: center; margin-top: 40px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏥 MediCore HMS</div>
            <div class="sub">Hospital Management System</div>
            <div class="sub">Invoice Receipt</div>
          </div>
          <div class="info">
            <div class="info-box">
              <div class="label">Patient Name</div>
              <div class="value">${b.patient?.name || '—'}</div>
              <div class="label" style="margin-top:10px">Bill ID</div>
              <div class="value">${b._id?.slice(-6).toUpperCase()}</div>
            </div>
            <div class="info-box">
              <div class="label">Date</div>
              <div class="value">${new Date(b.createdAt).toLocaleDateString()}</div>
              <div class="label" style="margin-top:10px">Status</div>
              <div class="value">
                <span class="status ${b.status === 'Paid' ? 'paid' : 'pending'}">${b.status}</span>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Services</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${b.services}</td>
                <td>Rs. ${Number(b.amount).toLocaleString()}</td>
                <td>Rs. ${Number(b.paidAmount).toLocaleString()}</td>
                <td>Rs. ${(Number(b.amount) - Number(b.paidAmount)).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div class="total">Total: Rs. ${Number(b.amount).toLocaleString()}</div>
          <div class="footer">
            Thank you for choosing MediCore HMS<br/>
            Printed on ${new Date().toLocaleString()}
          </div>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  const statusColor = (s) => {
    if (s === 'Paid')    return { bg: 'rgba(16,185,129,0.15)',  text: '#34d399', border: 'rgba(16,185,129,0.3)' }
    if (s === 'Pending') return { bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24', border: 'rgba(245,158,11,0.3)' }
    return { bg: 'rgba(99,102,241,0.15)', text: '#a5b4fc', border: 'rgba(99,102,241,0.3)' }
  }

  const totalAmount = bills.reduce((s, b) => s + (b.amount || 0), 0)
  const totalPaid   = bills.filter(b => b.status === 'Paid').reduce((s, b) => s + (b.amount || 0), 0)
  const pending     = bills.filter(b => b.status === 'Pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing</h1>
          <p className="text-sm mt-1" style={{color: '#64748b'}}>Manage payments & invoices</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-glow px-5 py-2.5 rounded-xl text-sm font-semibold text-white">
          + New Bill
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Invoiced', value: `Rs. ${totalAmount.toLocaleString()}`, color: 'from-blue-500 to-blue-700', icon: '💰' },
          { label: 'Collected',      value: `Rs. ${totalPaid.toLocaleString()}`,   color: 'from-emerald-500 to-emerald-700', icon: '✅' },
          { label: 'Pending Bills',  value: pending, color: 'from-orange-500 to-orange-700', icon: '⏳' },
        ].map(c => (
          <div key={c.label} className="stat-card rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg`}>
              {c.icon}
            </div>
            <div>
              <p className="text-xs" style={{color: '#64748b'}}>{c.label}</p>
              <p className="text-xl font-bold text-white">{c.value}</p>
            </div>
          </div>
        ))}
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
              {['Patient', 'Services', 'Amount', 'Paid', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-4 text-xs font-medium uppercase tracking-wider" style={{color: '#64748b'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12" style={{color: '#475569'}}>No bills yet!</td></tr>
            ) : (
              bills.map((b) => {
                const sc = statusColor(b.status)
                return (
                  <tr key={b._id} className="transition-all" style={{borderBottom: '1px solid rgba(255,255,255,0.04)'}}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-4 text-sm font-medium text-white">{b.patient?.name}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>{b.services}</td>
                    <td className="px-5 py-4 text-sm font-medium" style={{color: '#34d399'}}>Rs. {b.amount?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm" style={{color: '#94a3b8'}}>Rs. {b.paidAmount?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-3 py-1 rounded-full font-medium" style={{
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`
                      }}>{b.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handlePrint(b)}
                          className="text-xs px-3 py-1 rounded-lg transition-all"
                          style={{background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)'}}>
                          🖨️ Print
                        </button>
                        <button onClick={() => handleDelete(b._id)}
                          className="text-xs px-3 py-1 rounded-lg transition-all"
                          style={{background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)'}}>
                          Delete
                        </button>
                      </div>
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
            <h3 className="font-bold text-white text-lg mb-5">New Invoice</h3>
            <div className="space-y-3">
              <select className="w-full text-sm px-4 py-2.5 rounded-xl outline-none"
                style={{background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}
                value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
                <option value="">-- Select Patient --</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              {[
                { placeholder: 'Services (e.g. Consultation, X-Ray)', key: 'services' },
                { placeholder: 'Total Amount (Rs.)', key: 'amount', type: 'number' },
                { placeholder: 'Paid Amount (Rs.)', key: 'paidAmount', type: 'number' },
              ].map(f => (
                <input key={f.key} type={f.type || 'text'}
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
                <option>Pending</option>
                <option>Paid</option>
                <option>Partial</option>
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm"
                style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8'}}>
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-glow">
                Save Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}