import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getDashboardStats } from '../../api/dashboard'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Icon } from '../../components/shared/Icon'

function StatCard({ icon, label, value, color = 'text-ca-primary', bg = 'bg-red-50' }) {
  return (
    <div className="stat-card flex items-center gap-4">
      <div className={`${bg} p-3 rounded-xl`}>
        <span className={`material-symbols-outlined ${color}`} style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-ca-on-surface">{value}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(r => { setStats(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : !stats ? (
        <p className="text-gray-400 text-sm">Could not load stats.</p>
      ) : (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="inventory_2"  label="Total Products"  value={stats.products.total}      bg="bg-red-50"    color="text-ca-primary" />
            <StatCard icon="check_circle" label="In Stock"        value={stats.products.in_stock}   bg="bg-green-50"  color="text-green-600" />
            <StatCard icon="cancel"       label="Out of Stock"    value={stats.products.out_of_stock} bg="bg-gray-100" color="text-gray-500" />
            <StatCard icon="category"     label="Categories"      value={stats.categories.total}    bg="bg-yellow-50" color="text-yellow-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Low Stock Alert */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ca-on-surface text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500" style={{ fontSize: 20 }}>warning</span>
                  Low Stock Alerts
                </h2>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                  {stats.products.low_stock} items
                </span>
              </div>
              {stats.low_stock_items.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">All products well stocked! 🎉</p>
              ) : (
                <div className="space-y-2">
                  {stats.low_stock_items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-ca-border last:border-0">
                      <span className="text-sm text-ca-on-surface font-medium line-clamp-1">{item.name}</span>
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full ml-2 shrink-0">
                        {item.stock_quantity} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-semibold text-ca-on-surface text-base mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/admin/products/new"
                  className="flex items-center gap-3 p-3 rounded-xl bg-ca-primary text-white hover:bg-ca-primary-c transition-colors">
                  <Icon name="add_circle" size={20} />
                  <span className="text-sm font-semibold">Add New Product</span>
                </Link>
                <Link to="/admin/products?filter=low_stock"
                  className="flex items-center gap-3 p-3 rounded-xl border border-ca-border hover:bg-gray-50 transition-colors">
                  <Icon name="inventory_2" size={20} className="text-ca-primary" />
                  <span className="text-sm font-semibold text-ca-on-surface">View Low Stock Items</span>
                </Link>
                <Link to="/admin/categories"
                  className="flex items-center gap-3 p-3 rounded-xl border border-ca-border hover:bg-gray-50 transition-colors">
                  <Icon name="category" size={20} className="text-ca-primary" />
                  <span className="text-sm font-semibold text-ca-on-surface">Manage Categories</span>
                </Link>
                <Link to="/" target="_blank"
                  className="flex items-center gap-3 p-3 rounded-xl border border-ca-border hover:bg-gray-50 transition-colors">
                  <Icon name="storefront" size={20} className="text-ca-primary" />
                  <span className="text-sm font-semibold text-ca-on-surface">View Customer Store</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
