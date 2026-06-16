import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../shared/Icon'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { path: '/admin',            icon: 'dashboard',   label: 'Dashboard'  },
  { path: '/admin/products',   icon: 'inventory_2', label: 'Products'   },
  { path: '/admin/categories', icon: 'category',    label: 'Categories' },
]

export function AdminLayout({ children, title }) {
  const { logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-64 flex' : (sidebarOpen ? 'hidden lg:flex' : 'hidden')} flex-col bg-ca-sidebar border-r border-ca-border h-screen sticky top-0`}
      style={{ minWidth: mobile ? undefined : 260 }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-ca-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎀</span>
          <div>
            <p className="font-bold text-ca-primary text-sm leading-tight">Craft Castle</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 hover:text-ca-primary transition-colors flex items-center justify-center"
          title="Close menu"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Extra mobile actions */}
      {mobile && (
        <div className="px-3 py-2 border-t border-ca-border space-y-1">
          <button
            onClick={toggleTheme}
            className="admin-nav-item w-full text-left flex items-center gap-3"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <Link
            to="/"
            target="_blank"
            className="admin-nav-item w-full text-left flex items-center gap-3 text-gray-500"
          >
            <Icon name="open_in_new" size={18} />
            <span>View Store</span>
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 py-4 border-t border-ca-border">
        <button onClick={handleLogout} className="admin-nav-item w-full text-left text-red-600 hover:bg-red-50">
          <Icon name="logout" size={18} />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-ca-bg font-inter">
      {sidebarOpen && <Sidebar />}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-50"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-ca-border px-4 sm:px-6 h-16 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(prev => !prev)} className="p-1 rounded hover:bg-gray-100">
            <Icon name="menu" size={22} />
          </button>
          <h1 className="font-semibold text-ca-on-surface text-base flex-1">{title}</h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-full border border-ca-border text-ca-primary hover:bg-ca-primary/5 dark:hover:bg-white/5 transition-colors hidden lg:flex items-center justify-center mr-2"
            title="Toggle theme"
          >
            <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
          </button>
          <Link to="/" target="_blank" className="text-xs text-gray-400 hover:text-ca-primary hidden lg:flex items-center gap-1">
            <Icon name="open_in_new" size={14} /> View Store
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
