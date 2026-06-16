import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { adminGetProducts, updateStock, deleteProduct } from '../../api/products'
import { adminGetCategories } from '../../api/categories'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { StockBadge } from '../../components/shared/StockBadge'
import { Icon } from '../../components/shared/Icon'
import toast from 'react-hot-toast'

export function ProductsPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(searchParams.get('filter') === 'low_stock')
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState(null)
  const [editingStock, setEditingStock] = useState({})
  const PAGE_SIZE = 20

  useEffect(() => {
    adminGetCategories().then(r => setCategories(r.data.categories || []))
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (search) params.search = search
      if (categoryId) params.category_id = categoryId
      if (lowStockOnly) params.low_stock_only = true
      const r = await adminGetProducts(params)
      setProducts(r.data.products || [])
      setTotal(r.data.total || 0)
    } finally { setLoading(false) }
  }, [page, search, categoryId, lowStockOnly])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      load()
    } catch { toast.error('Failed to delete') }
    finally { setDeletingId(null) }
  }

  const handleStockSave = async (id, qty) => {
    try {
      await updateStock(id, parseInt(qty))
      toast.success('Stock updated')
      setEditingStock(s => { const n = {...s}; delete n[id]; return n })
      load()
    } catch { toast.error('Failed to update stock') }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <AdminLayout title="Products">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products…"
          className="flex-1 min-w-48 border border-ca-border rounded-lg px-3 py-2 text-sm outline-none focus:border-ca-primary"
        />
        <select
          value={categoryId}
          onChange={e => { setCategoryId(e.target.value); setPage(1) }}
          className="border border-ca-border rounded-lg px-3 py-2 text-sm outline-none focus:border-ca-primary"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={lowStockOnly} onChange={e => { setLowStockOnly(e.target.checked); setPage(1) }} className="accent-ca-primary" />
          Low stock
        </label>
        <span className="text-xs text-gray-400 ml-auto">{total} products</span>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-ca-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ca-primary-c transition-colors">
          <Icon name="add" size={16} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ca-bg border-b border-ca-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ca-border">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    {/* Product name + image */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cf-surface border border-ca-border overflow-hidden shrink-0 flex items-center justify-center">
                          {p.media && (p.media.find(m => m.is_primary) || p.media[0]) ? (
                            <img
                              src={(p.media.find(m => m.is_primary) || p.media[0]).media_url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl">🎀</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ca-on-surface leading-tight line-clamp-1">{p.name}</p>
                          {p.is_featured && <span className="text-xs text-yellow-600">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {categories.find(c => c.id === p.category_id)?.name || '—'}
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3 font-semibold text-ca-on-surface">
                      ₹{p.discounted_price || p.price}
                      {p.discounted_price && <span className="text-xs text-gray-400 line-through ml-1">₹{p.price}</span>}
                    </td>
                    {/* Stock — inline editable */}
                    <td className="px-4 py-3">
                      {editingStock[p.id] !== undefined ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number" min="0"
                            value={editingStock[p.id]}
                            onChange={e => setEditingStock(s => ({ ...s, [p.id]: e.target.value }))}
                            className="w-16 border border-ca-primary rounded px-2 py-1 text-xs text-center outline-none"
                          />
                          <button onClick={() => handleStockSave(p.id, editingStock[p.id])} className="text-green-600 hover:text-green-800"><Icon name="check" size={16} /></button>
                          <button onClick={() => setEditingStock(s => { const n={...s}; delete n[p.id]; return n })} className="text-gray-400 hover:text-gray-600"><Icon name="close" size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingStock(s => ({ ...s, [p.id]: p.stock_quantity }))} className="flex items-center gap-1 group">
                          <StockBadge qty={p.stock_quantity} />
                          <Icon name="edit" size={13} className="text-gray-300 group-hover:text-gray-500 ml-1" />
                        </button>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg hover:bg-gray-100 text-ca-primary transition-colors">
                          <Icon name="edit" size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-40"
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 rounded border border-ca-border text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
          <span className="px-3 py-1.5 text-sm text-gray-400">Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 rounded border border-ca-border text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}
    </AdminLayout>
  )
}
