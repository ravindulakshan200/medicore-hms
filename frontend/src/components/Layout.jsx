import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '⊞' },
  { to: '/patients',     label: 'Patients',     icon: '👤' },
  { to: '/doctors',      label: 'Doctors',      icon: '⚕' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/billing',      label: 'Billing',      icon: '🧾' },
]

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('hms_user'))

  const handleLogout = () => {
    localStorage.removeItem('hms_user')
    navigate('/login')
  }

  return (
    <div className="flex h-screen" style={{background: '#0f172a'}}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col" style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)'
      }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3" style={{borderBottom: '1px solid rgba(255,255,255,0.07)'}}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg"
            style={{background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.4)'}}>
            M
          </div>
          <div>
            <p className="font-bold text-white text-sm">MediCore HMS</p>
            <p className="text-xs" style={{color: '#64748b'}}>v1.0</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                boxShadow: '0 0 20px rgba(16,185,129,0.1)'
              } : {}}
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="px-4 py-4" style={{borderTop: '1px solid rgba(255,255,255,0.07)'}}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{background: 'rgba(16,185,129,0.2)', color: '#10b981'}}>
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-xs text-white font-medium">{user?.name}</p>
              <p className="text-xs" style={{color: '#64748b'}}>{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-xs py-2 rounded-lg transition-all"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)'
            }}
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}