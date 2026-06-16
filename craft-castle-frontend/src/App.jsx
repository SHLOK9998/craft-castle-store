import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { WishlistProvider } from './context/WishlistContext'
import { CartProvider } from './context/CartContext'

// Customer pages
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfServicePage } from './pages/TermsOfServicePage'
import { HowToOrderPage } from './pages/HowToOrderPage'
import { FAQPage } from './pages/FAQPage'

// Admin pages
import { LoginPage } from './pages/admin/LoginPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { ProductsPage } from './pages/admin/ProductsPage'
import { ProductFormPage } from './pages/admin/ProductFormPage'
import { CategoriesPage } from './pages/admin/CategoriesPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function AdminLoginRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/admin" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { fontFamily: 'Inter, sans-serif', fontSize: 14 },
                  success: { iconTheme: { primary: '#610000', secondary: '#fff' } },
                }}
              />
              <Routes>
                {/* ── Customer ── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/how-to-order" element={<HowToOrderPage />} />
                <Route path="/faqs" element={<FAQPage />} />

                {/* ── Admin ── */}
                <Route path="/admin/login" element={<AdminLoginRoute><LoginPage /></AdminLoginRoute>} />
                <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                <Route path="/admin/products/new" element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>} />
                <Route path="/admin/products/:id/edit" element={<ProtectedRoute><ProductFormPage /></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
