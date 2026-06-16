import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ca-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-modal p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎀</div>
            <h1 className="font-bold text-ca-on-surface text-xl">Craft Castle</h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ca-on-surface uppercase tracking-wide mb-1.5">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="admin" required
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ca-on-surface uppercase tracking-wide mb-1.5">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" required
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-ca-primary text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-ca-primary-c transition-colors disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Craft Castle · Handmade Rakhi Store</p>
      </div>
    </div>
  )
}
