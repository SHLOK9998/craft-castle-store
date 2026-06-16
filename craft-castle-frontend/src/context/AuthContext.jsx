import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('cc_admin_token'))
  const isAuthenticated = !!token

  const login = async (username, password) => {
    const res = await loginApi(username, password)
    const t = res.data.access_token
    localStorage.setItem('cc_admin_token', t)
    setToken(t)
    return t
  }

  const logout = () => {
    localStorage.removeItem('cc_admin_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
